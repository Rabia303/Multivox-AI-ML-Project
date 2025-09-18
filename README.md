# 🎬 Multivox - AI-Powered Instant Dubbing & Subtitling

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-2.2+-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Whisper](https://img.shields.io/badge/OpenAI_Whisper-API-412991?logo=openai)](https://openai.com/index/whisper/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Break the language barrier. Instantly.** Multivox is a web application that leverages cutting-edge AI to provide seamless, real-time dubbing and subtitling for any video. Just paste a link or upload a file, and experience content in your preferred language.

## ✨ Inspiration

We imagined a world where no one has to wait for studios to dub their favorite movies or shows. A world where you can watch any video, from any corner of the internet, in your native language—with perfect lip-synced dubbing or accurate subtitles. Multivox was born from this vision to make media globally accessible.

## 🚀 What Multivox Can Do

*   **🌐 AI-Powered Dubbing & Subtitles**: Generate high-quality voiceovers and subtitles from video uploads or direct YouTube/Link.
*   **🗣 Multi-Language Translation**: Translate dialogue into numerous languages, breaking down barriers for a global audience.
*   **� Voice Style Customization**: Alter voice characteristics for different styles and tones, adding a layer of personalization.
*   **📥 Flexible Input Processing**: Supports both direct file uploads and URL links for maximum convenience.
*   **📄 Document Translation**: Upload documents (PDF, DOCX, TXT), translate them, and download the results in multiple formats.

## 🛠️ Tech Stack & Libraries

This project was built with a powerful combination of technologies:

*   **Frontend**: React (with Vite)
*   **Backend**: Flask
*   **AI & Core Processing**:
    *   `openai-whisper` → For accurate speech-to-text transcription.
    *   `deep-translator` & `googletrans` → For multi-language translation.
    *   `gTTS` (Google Text-to-Speech) → For speech synthesis (TTS).
    *   `pydub` → For audio processing and manipulation.
*   **Video & Content Handling**:
    *   `pytube` & `yt_dlp` → For downloading audio from YouTube links.
    *   `SpeechRecognition` → For fallback speech recognition.
    *   `pytesseract` → For OCR (future expansion).
*   **Document Processing**:
    *   `python-docx` → For reading and writing Word documents.
    *   `PyPDF2` → For reading text from PDFs.
    *   `reportlab` → For generating PDF outputs.
*   **Utilities**:
    *   `srt` → For generating and handling SubRip subtitle files.
    *   `flask-cors` → To enable Cross-Origin Requests.

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/multivox.git
    cd multivox
    ```

2.  **Backend Setup (Flask)**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python app.py
    ```
    The Flask server will start on `http://localhost:5000`.

3.  **Frontend Setup (React + Vite)**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The React app will start on `http://localhost:5173`.

## 💻 Usage

1.  **Go to the application** in your browser.
2.  **Choose your input method**: Paste a valid video URL (e.g., YouTube) or upload a video file.
3.  **Select your preferences**: Choose the target language for dubbing/subtitles and your desired voice style.
4.  **Submit and Process**: Click the button and let our AI work its magic! Processing time may vary based on video length and server load.
5.  **Download and Enjoy**: Once processing is complete, download your dubbed video, subtitles, or translated document.

## 🧠 How It Works (The Magic)

1.  **Ingestion**: The video/audio is extracted from the URL or uploaded file.
2.  **Transcription**: OpenAI's Whisper transcribes the audio to text with high accuracy.
3.  **Translation**: The transcribed text is translated to the target language using `deep-translator`.
4.  **Synthesis**: The translated text is converted to speech (TTS) using `gTTS` and other libraries, attempting to match the original timing.
5.  **Reconstruction**: The new audio is synced with the original video, and subtitle files (SRT) are generated.
6.  **Delivery**: The final video with AI dubbing and/or subtitles is presented to the user for download.

## 🏗️ Challenges We Faced & Overcame

This journey was a tremendous learning experience, filled with significant hurdles:

*   **GPU Intensive Processing**: High-quality voice synthesis and Whisper models demand immense computational power. Our Google Colab sessions repeatedly froze, pushing us to optimize our code and explore creative solutions to work within these limits.
*   **Integration Complexity**: Seamlessly stitching together a pipeline of over a dozen different libraries (Whisper, pytube, TTS, pydub, etc.) was a complex task, requiring deep debugging and error handling.
*   **Audio-Video Synchronization**: One of the toughest technical challenges was ensuring the newly generated dubbed audio perfectly matched the timing and flow of the original video.
*   **Prototype Under Pressure**: Despite these challenges, our team's perseverance and collaborative problem-solving turned this ambitious vision into a working, demonstrable prototype that received overwhelmingly positive feedback.

## 👥 The Amazing Team

Huge kudos to my incredible and dedicated teammates who made this possible:

*   **Rameen Sahar**
*   **Tayyaba Rehan**
*   **Rabia Imtiaz**

This project was a true testament to endless nights of hard work and collaboration.

## 🔮 Future Roadmap

Our vision for Multivox is just getting started. Here's what we're dreaming of next:

*   **Multi-Speaker Dubbing**: Our #1 priority! Differentiating between characters and using unique voices for each.
*   **Hyper-Realistic Voices**: Integrating advanced APIs like **Eleven Labs** for professional, human-like voice synthesis.
*   **Real-Time Processing**: Drastically reducing processing time for a near-instant experience.
*   **Lip-Syncing AI**: Using models like Wav2Lip to match the dubbed audio to the lip movements of the speakers.
*   **Platform & API**: Scaling Multivox into a full-fledged platform and API for developers and content creators.

**We believe with the right support and investment, Multivox can become something truly transformative for global media consumption.**

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

A special thank you to **Aptech** for providing a platform for aspiring developers and AI enthusiasts to shine. This project taught us invaluable lessons about AI, problem-solving under pressure, and the power of teamwork.

---
