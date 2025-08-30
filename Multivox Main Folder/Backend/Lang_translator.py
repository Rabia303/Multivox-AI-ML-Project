# app.py
import os
import io
import uuid
import sqlite3
import datetime as dt
import asyncio
import logging
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from googletrans import Translator
import pytesseract
from PIL import Image
from PyPDF2 import PdfReader
from docx import Document
import tempfile

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = "translator.db"

app = Flask(__name__)
CORS(app)

# Create a wrapper for async translation
async def async_translate(text, dest, src='auto'):
    translator = Translator()
    return await translator.translate(text, dest=dest, src=src)

def sync_translate(text, dest, src='auto'):
    return asyncio.run(async_translate(text, dest, src))

# ---------- Utilities ----------
def now_iso():
    return dt.datetime.utcnow().isoformat() + "Z"

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = db()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS translations (
        id TEXT PRIMARY KEY,
        owner TEXT,
        source_text TEXT,
        source_lang TEXT,
        target_lang TEXT,
        translated_text TEXT,
        created_at TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS phrasebook (
        id TEXT PRIMARY KEY,
        owner TEXT,
        source_text TEXT,
        target_lang TEXT,
        translated_text TEXT,
        created_at TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS shared (
        id TEXT PRIMARY KEY,           -- public UUID for sharing
        translation_id TEXT,           -- references translations.id
        created_at TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS domain_dictionary (
        domain TEXT,
        term TEXT,
        meaning TEXT
    )
    """)
    conn.commit()

    # Seed small domain terms if empty
    cur.execute("SELECT COUNT(*) c FROM domain_dictionary")
    if cur.fetchone()["c"] == 0:
        seeds = [
            ("medical", "BP", "Blood Pressure"),
            ("medical", "Rx", "Prescription"),
            ("medical", "Hx", "History (medical)"),
            ("legal", "affidavit", "A written sworn statement"),
            ("legal", "tort", "A civil wrong causing loss"),
            ("technical", "latency", "Delay before data transfer begins"),
            ("technical", "throughput", "Amount of data processed per time")
        ]
        cur.executemany("INSERT INTO domain_dictionary(domain, term, meaning) VALUES (?, ?, ?)", seeds)
        conn.commit()
    conn.close()

init_db()

# ---------- Helpers ----------
def apply_style_rules(text: str, style: str) -> str:
    """
    Simple, deterministic style tweaks (no LLM).
    'formal' | 'informal' | 'technical' | None
    """
    if not style:
        return text
    t = text.strip()
    if style == "formal":
        if not t.endswith("."):
            t += "."
        return "Kindly note: " + t
    if style == "informal":
        return t + " 🙂"
    if style == "technical":
        return "Specification: " + t
    return text

def apply_domain_dictionary(text: str, domain: str):
    """Append domain meanings in parentheses for known terms."""
    if not domain:
        return text
    conn = db()
    rows = conn.execute("SELECT term, meaning FROM domain_dictionary WHERE domain=?", (domain,)).fetchall()
    conn.close()
    out = text
    for r in rows:
        term = r["term"]
        meaning = r["meaning"]
        # naive replacement when the exact term appears (case-sensitive)
        out = out.replace(f" {term} ", f" {term} ({meaning}) ")
    return out

def save_translation(owner, source_text, source_lang, target_lang, translated_text):
    tid = str(uuid.uuid4())
    conn = db()
    conn.execute("""
        INSERT INTO translations(id, owner, source_text, source_lang, target_lang, translated_text, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (tid, owner, source_text, source_lang, target_lang, translated_text, now_iso()))
    conn.commit()
    conn.close()
    return tid
def create_pdf(translated_text, source_lang, target_lang):
    """Create a visually enhanced PDF with the translated text"""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Colors
    primary_color = (0.2, 0.4, 0.6)  # Dark blue
    accent_color = (0.1, 0.7, 0.9)   # Light blue
    dark_color = (0.1, 0.1, 0.2)     # Dark background
    
    # Add header with gradient
    c.setFillColorRGB(*primary_color)
    c.rect(0, height - 80, width, 80, fill=1, stroke=0)
    
    # Add title
    c.setFillColorRGB(1, 1, 1)  # White text
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, height - 40, f"Translation from {source_lang.upper()} to {target_lang.upper()}")
    
    # Add date
    c.setFont("Helvetica", 10)
    c.drawString(width - 200, height - 40, f"Generated: {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Add decorative line
    c.setStrokeColorRGB(*accent_color)
    c.setLineWidth(2)
    c.line(72, height - 50, width - 72, height - 50)
    
    # Add content with better styling
    c.setFillColorRGB(0.1, 0.1, 0.2)  # Dark text
    y_position = height - 100
    
    # Create a box for content
    c.setFillColorRGB(0.95, 0.95, 0.97)  # Light gray background
    c.rect(50, 50, width - 100, height - 170, fill=1, stroke=0)
    c.setFillColorRGB(0.1, 0.1, 0.2)  # Dark text
    
    # Format text with better wrapping
    text_object = c.beginText(60, height - 100)
    text_object.setFont("Helvetica", 12)
    text_object.setFillColorRGB(0.1, 0.1, 0.2)
    
    # Simple text wrapping
    lines = []
    for line in translated_text.split('\n'):
        if len(line) > 90:
            words = line.split(' ')
            current_line = ""
            for word in words:
                if len(current_line) + len(word) < 90:
                    current_line += word + " "
                else:
                    lines.append(current_line)
                    current_line = word + " "
            if current_line:
                lines.append(current_line)
        else:
            lines.append(line)
    
    # Add text to PDF
    for line in lines:
        if y_position < 100:
            c.drawText(text_object)
            c.showPage()
            # Reset for new page
            y_position = height - 50
            text_object = c.beginText(60, height - 50)
            text_object.setFont("Helvetica", 12)
            text_object.setFillColorRGB(0.1, 0.1, 0.2)
        
        text_object.textLine(line)
        y_position -= 15
    
    c.drawText(text_object)
    
    # Add footer
    c.setFont("Helvetica", 8)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawString(72, 30, "Generated by Language Translator App")
    c.drawRightString(width - 72, 30, "Page 1")
    
    c.save()
    buffer.seek(0)
    return buffer
# ---------- Core Routes ----------

@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json(force=True)
    text = data.get("text", "").strip()
    target_lang = data.get("target_lang", "en")
    source_lang = data.get("source_lang")  # optional, else auto
    owner = data.get("owner")              # optional userId
    style = data.get("style")              # "formal" | "informal" | "technical"
    domain = data.get("domain")            # "medical" | "legal" | "technical"

    if not text:
        return jsonify({"error": "Missing text"}), 400

    try:
        tr = sync_translate(text, dest=target_lang, src=source_lang if source_lang else "auto")
        out = tr.text or ""
        # domain & style helpers (deterministic)
        out = apply_domain_dictionary(out, domain)
        out = apply_style_rules(out, style)

        tid = None
        if owner:
            tid = save_translation(owner, text, tr.src, target_lang, out)

        return jsonify({
            "translated_text": out,
            "detected_source_lang": tr.src,
            "translation_id": tid
        })
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/smart_translate", methods=["POST"])
def smart_translate():
    """
    Hook for advanced AI (context, style, summarization).
    For now, it delegates to /translate-like behavior (deterministic).
    You can plug an LLM here later.
    """
    data = request.get_json(force=True)
    # Reuse /translate logic without saving twice:
    return translate_text()

# ---------- Document & OCR ----------

@app.route("/translate_file", methods=["POST"])
def translate_file():
    if "file" not in request.files:
        return jsonify({"error": "file required"}), 400
    file = request.files["file"]
    target_lang = request.form.get("target_lang", "en")
    source_lang = request.form.get("source_lang", "auto")
    owner = request.form.get("owner")
    style = request.form.get("style")
    domain = request.form.get("domain")

    # Extract text
    ext = (file.filename or "").lower()
    text = ""
    try:
        if ext.endswith(".pdf"):
            reader = PdfReader(file)
            for p in reader.pages:
                text += p.extract_text() or ""
        elif ext.endswith(".docx"):
            doc = Document(file)
            text = "\n".join([p.text for p in doc.paragraphs])
        elif ext.endswith((".jpg", ".jpeg", ".png")):
            # Handle image files with OCR
            img = Image.open(file.stream).convert("RGB")
            text = pytesseract.image_to_string(img)
        else:
            # assume UTF-8 text
            text = file.read().decode("utf-8", errors="ignore")
    except Exception as e:
        logger.error(f"File extraction error: {str(e)}")
        return jsonify({"error": f"extract failed: {e}"}), 500

    if not text.strip():
        return jsonify({"error": "no text found in file"}), 400

    try:
        tr = sync_translate(text, dest=target_lang, src=source_lang)
        out = tr.text or ""
        out = apply_domain_dictionary(out, domain)
        out = apply_style_rules(out, style)
        tid = None
        if owner:
            tid = save_translation(owner, text[:1000], tr.src, target_lang, out[:2000])  # store snippet to keep DB small

        # return both JSON and a downloadable handle
        return jsonify({
            "translated_text": out,
            "detected_source_lang": tr.src,
            "translation_id": tid,
            "original_text": text[:500] + "..." if len(text) > 500 else text
        })
    except Exception as e:
        logger.error(f"File translation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/download_pdf", methods=["POST"])
def download_pdf():
    data = request.get_json(force=True)
    translated_text = data.get("translated_text", "")
    source_lang = data.get("source_lang", "auto")
    target_lang = data.get("target_lang", "en")
    
    if not translated_text:
        return jsonify({"error": "No text to download"}), 400
        
    try:
        pdf_buffer = create_pdf(translated_text, source_lang, target_lang)
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"translation_{source_lang}_to_{target_lang}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        logger.error(f"PDF creation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ---------- Health Check ----------
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Translator API is running"})

# ---------- Run ----------
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")