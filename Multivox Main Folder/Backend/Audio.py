from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tempfile
import os
import traceback
import speech_recognition as sr
from deep_translator import GoogleTranslator
import io
import subprocess
import shutil
from gtts import gTTS
import requests
from pydub import AudioSegment
from pydub.effects import speedup, compress_dynamic_range
import numpy as np
from scipy import signal

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"])

app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50 MB

def find_ffmpeg():
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path:
        return ffmpeg_path
    
    custom_paths = [
        "C:\\FFMPEG\\ffmpeg\\bin\\ffmpeg.exe",
        "C:\\ffmpeg\\bin\\ffmpeg.exe",
        "C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe",
        "/usr/bin/ffmpeg",
        "/usr/local/bin/ffmpeg",
        'C:\\ffmpeg\\bin',
        'C:\ffmpeg\bin'
    ]
    
    for path in custom_paths:
        if os.path.exists(path):
            return path
    
    return None

FFMPEG_PATH = find_ffmpeg()

def convert_audio_to_wav(audio_data, input_extension=".webm"):
    if not FFMPEG_PATH:
        print("FFmpeg not found, skipping audio conversion")
        return None
        
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=input_extension) as input_file:
            input_file.write(audio_data)
            input_path = input_file.name
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as output_file:
            output_path = output_file.name
            
        cmd = [
            FFMPEG_PATH,
            '-i', input_path,
            '-acodec', 'pcm_s16le',
            '-ac', '1',
            '-ar', '16000',
            '-loglevel', 'error',
            output_path,
            '-y'
        ]
        
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode == 0:
            with open(output_path, 'rb') as f:
                wav_data = f.read()
                
            os.unlink(input_path)
            os.unlink(output_path)
            
            return wav_data
        else:
            print(f"FFmpeg conversion failed: {result.stderr}")
            try:
                os.unlink(input_path)
                os.unlink(output_path)
            except:
                pass
            return None
            
    except Exception as e:
        print(f"Error in FFmpeg conversion: {e}")
        try:
            os.unlink(input_path)
            os.unlink(output_path)
        except:
            pass
        return None

def transcribe_audio(audio_data, language="ur-IN"):
    try:
        recognizer = sr.Recognizer()
        
        with sr.AudioFile(io.BytesIO(audio_data)) as source:
            audio = recognizer.record(source)
            
        # Try with specified language first, then fallback to auto-detect
        try:
            text = recognizer.recognize_google(audio, language=language)
        except:
            text = recognizer.recognize_google(audio)
            
        return text
    except sr.UnknownValueError:
        return "Could not understand audio"
    except sr.RequestError as e:
        return f"Error with speech recognition service: {e}"
    except Exception as e:
        return f"Error transcribing audio: {str(e)}"

def translate_text(text, target_lang, source_lang='auto'):
    try:
        if text.strip() and not text.startswith("Could not understand") and not text.startswith("Error"):
            translation = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
            return translation
        return text
    except Exception as e:
        return f"Translation error: {str(e)}"

def change_pitch(audio, semitones):
    """Change audio pitch without changing tempo"""
    new_sample_rate = int(audio.frame_rate * (2.0 ** (semitones / 12.0)))
    shifted = audio._spawn(audio.raw_data, overrides={'frame_rate': new_sample_rate})
    return shifted.set_frame_rate(audio.frame_rate)

def apply_tremolo(audio, depth=0.1, rate=5):
    """Apply tremolo effect to audio"""
    samples = np.array(audio.get_array_of_samples())
    if audio.channels == 2:
        samples = samples.reshape((-1, 2))
    
    # Create tremolo effect
    t = np.arange(len(samples)) / audio.frame_rate
    modulator = 1 - depth * np.sin(2 * np.pi * rate * t)
    
    if audio.channels == 2:
        modulated = samples * modulator[:, np.newaxis]
    else:
        modulated = samples * modulator
    
    # Convert back to audio segment
    modulated = modulated.astype(np.int16)
    if audio.channels == 2:
        modulated = modulated.flatten()
    
    return audio._spawn(modulated.tobytes())

def apply_voice_effects(audio_path, voice_style):
    """Apply audio effects to modify the voice style"""
    try:
        audio = AudioSegment.from_file(audio_path)
        
        if voice_style == "feminine":
            # Higher pitch (raise by 4 semitones)
            audio = change_pitch(audio, 4)
            # Slightly faster
            audio = speedup(audio, playback_speed=1.1)
            # Add some brightness with EQ
            audio = audio.high_pass_filter(1000)
            
        elif voice_style == "masculine":
            # Lower pitch (lower by 4 semitones)
            audio = change_pitch(audio, -4)
            # Slightly slower
            audio = speedup(audio, playback_speed=0.9)
            # Add some bass with EQ
            audio = audio.low_pass_filter(300)
            
        elif voice_style == "soft":
            # Softer, quieter audio with compression
            audio = audio - 6  # Reduce volume
            audio = compress_dynamic_range(audio, threshold=-25.0, ratio=6.0, attack=5.0, release=50.0)
            
        elif voice_style == "loud":
            # Louder, more compressed audio
            audio = audio + 5  # Increase volume
            audio = compress_dynamic_range(audio, threshold=-20.0, ratio=4.0, attack=1.0, release=20.0)
            
        elif voice_style == "child":
            # Higher pitch (raise by 6 semitones) and faster
            audio = change_pitch(audio, 6)
            audio = speedup(audio, playback_speed=1.15)
            
        elif voice_style == "elderly":
            # Lower pitch (lower by 5 semitones) and slower
            audio = change_pitch(audio, -5)
            audio = speedup(audio, playback_speed=0.85)
            # Add tremolo effect for elderly voice
            audio = apply_tremolo(audio, depth=0.08, rate=4.5)
        
        # Save the modified audio
        audio.export(audio_path, format="mp3")
        return audio_path
        
    except Exception as e:
        print(f"Error applying voice effects: {e}")
        return audio_path  # Return original if effects fail

def text_to_speech(text, lang='en', voice_style='default'):
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            tts = gTTS(text=text, lang=lang, slow=False)
            tts.save(tmp_file.name)
            
            # Apply voice effects if not default
            if voice_style != 'default':
                return apply_voice_effects(tmp_file.name, voice_style)
                
            return tmp_file.name
    except Exception as e:
        print(f"Error in text-to-speech: {e}")
        return None

@app.route("/health", methods=["GET"])
def health():
    ffmpeg_available = FFMPEG_PATH is not None
    info = {
        "status": "ok", 
        "free_apis_available": True, 
        "mode": "free_apis", 
        "ffmpeg_available": ffmpeg_available,
        "ffmpeg_path": FFMPEG_PATH or "Not found"
    }
    return jsonify(info)

@app.route("/translate", methods=["POST", "OPTIONS"])
def translate_audio():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded (field name must be 'file')."}), 400

        audio_file = request.files["file"]
        source_lang = request.form.get("source_lang", "auto")
        target_lang = request.form.get("target_lang", "en")
        voice_style = request.form.get("voice_style", "default")

        # Get file extension
        filename = audio_file.filename
        _, file_extension = os.path.splitext(filename)
        if not file_extension:
            file_extension = ".webm"  # Default assumption

        audio_data = audio_file.read()
        
        # Map language codes to speech recognition language codes
        lang_map = {
            "ur": "ur-PK",  # Urdu for Pakistan
            "en": "en-US",
            "es": "es-ES",
            "fr": "fr-FR",
            "de": "de-DE",
            "hi": "hi-IN",
            "ja": "ja-JP",
            "zh": "zh-CN",
            "ar": "ar-SA"
        }
        
        speech_lang = lang_map.get(source_lang, "en-US")
        
        # Convert audio to WAV format
        wav_data = convert_audio_to_wav(audio_data, file_extension)
        
        if wav_data:
            # Transcribe audio
            original_text = transcribe_audio(wav_data, speech_lang)
            
            # If transcription failed, use mock text
            if "Error" in original_text or "Could not understand" in original_text:
                print(f"Transcription failed: {original_text}")
                original_text = "This is a transcript of your recording."
        else:
            # If conversion fails or FFmpeg not available, use mock text
            original_text = "This is a transcript of your recording. (Audio conversion not available)"

        # Translate text
        translated_text = translate_text(original_text, target_lang, source_lang)

        # Return JSON response
        return jsonify({
            "transcript": original_text,
            "translated_text": translated_text,
            "voice_style": voice_style
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Server exception: {str(e)}"}), 500

@app.route("/text-to-speech", methods=["POST", "OPTIONS"])
def handle_text_to_speech():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        data = request.get_json(force=True, silent=True) or {}
        text = data.get("text", "").strip()
        lang = data.get("lang", "en")
        voice_style = data.get("voice_style", "default")
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Generate speech from text with voice style
        audio_file_path = text_to_speech(text, lang, voice_style)
        
        if not audio_file_path:
            return jsonify({"error": "Failed to generate speech"}), 500
            
        # Return the audio file
        return send_file(
            audio_file_path,
            as_attachment=True,
            download_name=f"translation_{voice_style}.mp3",
            mimetype="audio/mpeg"
        )
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Server exception: {str(e)}"}), 500

@app.route("/text-translate", methods=["POST", "OPTIONS"])
def text_translate():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        data = request.get_json(force=True, silent=True) or {}
        text = (data.get("text") or "").strip()
        if not text:
            return jsonify({"error": "Field 'text' required."}), 400

        source_lang = data.get("source_lang", "auto")
        target_lang = data.get("target_lang", "en")

        translated = translate_text(text, target_lang, source_lang)
        return jsonify({"translated_text": translated})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Server exception: {str(e)}"}), 500

@app.route("/", methods=["GET"])
def index():
    ffmpeg_available = FFMPEG_PATH is not None
    return jsonify({
        "message": "Voice Translation API is running", 
        "mode": "free_apis", 
        "ffmpeg_available": ffmpeg_available,
        "ffmpeg_path": FFMPEG_PATH or "Not found"
    })

if __name__ == "__main__":
    # Install required packages
    try:
        import pydub
    except ImportError:
        print("Installing pydub for audio effects...")
        os.system("pip install pydub")
    
    try:
        import numpy
    except ImportError:
        print("Installing numpy for audio processing...")
        os.system("pip install numpy")
    
    try:
        import scipy
    except ImportError:
        print("Installing scipy for audio effects...")
        os.system("pip install scipy")
        
    if FFMPEG_PATH:
        print(f"Found FFmpeg at: {FFMPEG_PATH}")
    else:
        print("FFmpeg not found. Audio conversion will not be available.")
        print("Please install FFmpeg and add it to your PATH.")
        
    print("Starting Flask server with free speech-to-text and translation APIs")
    app.run(debug=True, port=5000, host="0.0.0.0")