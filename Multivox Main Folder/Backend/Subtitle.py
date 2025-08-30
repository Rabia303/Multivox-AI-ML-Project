from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, uuid, tempfile, shutil, time, logging

# 🔧 Add FFmpeg path manually (IMPORTANT!)
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg"

import yt_dlp
import whisper
from deep_translator import GoogleTranslator
from werkzeug.utils import secure_filename

# Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'mp4', 'webm', 'mov', 'avi', 'mkv', 'wav', 'mp3', 'm4a'}
MODEL_SIZE = "base"
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Whisper model
try:
    logger.info("Loading Whisper model...")
    model = whisper.load_model(MODEL_SIZE)
    logger.info("Whisper model loaded.")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {str(e)}")
    raise e

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def seconds_to_srt_time(seconds):
    """Convert seconds to SRT time format"""
    try:
        ms = int((seconds - int(seconds)) * 1000)
        sec = int(seconds)
        m, s = divmod(sec, 60)
        h, m = divmod(m, 60)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"
    except Exception as e:
        logger.error(f"Time conversion error: {e}")
        return "00:00:00,000"

def generate_srt(segments):
    """Generate SRT file content from segments"""
    srt_content = []
    for i, seg in enumerate(segments):
        try:
            start = seconds_to_srt_time(seg["start"])
            end = seconds_to_srt_time(seg["end"])
            srt_content.append(f"{i+1}\n{start} --> {end}\n{seg['text'].strip()}\n")
        except Exception as e:
            logger.error(f"SRT segment error: {e}")
    return "\n".join(srt_content)

@app.route("/api/generate-subtitles", methods=["POST"])
def generate_subtitles():
    """Main transcription + translation route"""
    content_length = request.content_length
    if content_length and content_length > MAX_FILE_SIZE:
        return jsonify({"error": f"File too large (limit {MAX_FILE_SIZE/1024/1024:.0f}MB)"}), 400

    lang = request.form.get("language", "en")
    video_url = request.form.get("videoUrl")
    file = request.files.get("file")
    burn_subtitles = request.form.get("burnSubtitles", "false") == "true"

    original_media_filename = None
    temp_file_path = None

    try:
        # Download from YouTube if URL provided
        if video_url:
            # Generate unique filename
            filename = f"{uuid.uuid4()}.mp4"
            temp_file_path = os.path.join(UPLOAD_FOLDER, filename)
            
            ydl_opts = {
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'outtmpl': temp_file_path,
                'quiet': True,
            }

            logger.info(f"Downloading: {video_url}")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_url])
            
            logger.info(f"Downloaded to: {temp_file_path}")
            original_media_filename = filename

        # Or save uploaded file
        elif file and allowed_file(file.filename):
            ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
            filename = f"{uuid.uuid4()}.{ext}"
            temp_file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(temp_file_path)
            logger.info(f"Uploaded file saved: {temp_file_path}")
            original_media_filename = filename
        else:
            return jsonify({"error": "No valid video or file provided"}), 400

        # Transcribe with Whisper
        logger.info("Transcribing...")
        result = model.transcribe(temp_file_path, task="transcribe", verbose=True)
        segments = result.get("segments", [])

        logger.info(f"Transcription completed: {len(segments)} segments")

        # Translate if needed
        translated_segments = []
        if lang != "same":
            logger.info(f"Translating to: {lang}")
            for i, seg in enumerate(segments):
                if not seg['text']:
                    translated_segments.append(seg)
                    continue
                try:
                    chunk_size = 5000
                    text_chunks = [seg['text'][j:j+chunk_size] for j in range(0, len(seg['text']), chunk_size)]
                    translated_chunks = []

                    for chunk in text_chunks:
                        translated = GoogleTranslator(source='auto', target=lang).translate(chunk)
                        translated_chunks.append(translated)

                    translated_text = "".join(translated_chunks)

                    translated_segments.append({
                        'start': seg['start'],
                        'end': seg['end'],
                        'text': translated_text
                    })

                    if i % 10 == 0:
                        logger.info(f"Translated {i+1}/{len(segments)}")

                except Exception as e:
                    logger.warning(f"Translation failed: {e}")
                    translated_segments.append({
                        'start': seg['start'],
                        'end': seg['end'],
                        'text': f"[Error] {seg['text'][:100]}..."
                    })
        else:
            translated_segments = [{
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"]
            } for seg in segments]

        # Generate SRT
        srt_content = generate_srt(translated_segments)

        return jsonify({
            "subtitles": translated_segments,
            "srt": srt_content,
            "language": lang,
            "originalMediaFilename": original_media_filename
        })

    except Exception as e:
        logger.error(f"API error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

    finally:
        # Cleanup only temporary files (not stored in UPLOAD_FOLDER)
        pass

# Serve uploaded/downloaded files
@app.route('/files/<filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)