import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

// SVG Icons to replace emojis
const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="6" width="12" height="12" rx="1" ry="1"></rect>
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const VoiceStyleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 13a3 3 0 0 1 0-6"></path>
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
    <circle cx="12" cy="9" r="1"></circle>
  </svg>
);

const Spinner = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4"></path>
    <path d="M12 18v4"></path>
    <path d="M4.93 4.93l2.83 2.83"></path>
    <path d="M16.24 16.24l2.83 2.83"></path>
    <path d="M2 12h4"></path>
    <path d="M18 12h4"></path>
    <path d="M4.93 19.07l2.83-2.83"></path>
    <path d="M16.24 7.76l2.83-2.83"></path>
  </svg>
);

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(161, 196, 253, 0.5); }
  50% { box-shadow: 0 0 20px rgba(161, 196, 253, 0.8); }
  100% { box-shadow: 0 0 5px rgba(161, 196, 253, 0.5); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const PrimaryButton = styled(motion.button)`
  background: ${props => props.disabled ? "#7a8a9a" : "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  font-size: 1rem;
  font-weight: 700;
  opacity: ${props => props.disabled ? 0.7 : 1};
  box-shadow: ${props => props.disabled ? "none" : "0 4px 15px rgba(161, 196, 253, 0.4)"};
  animation: ${props => props.disabled ? "none" : css`${glow} 2s infinite`};
  
  &:focus {
    outline: none;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: ${props => props.disabled ? "#7a8a9a" : "#a1c4fd"};
  border: 2px solid ${props => props.disabled ? "#7a8a9a" : "#a1c4fd"};
  padding: 10px 22px;
  border-radius: 12px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  font-size: 1rem;
  font-weight: 700;
  box-shadow: ${props => props.disabled ? "none" : "0 4px 10px rgba(161, 196, 253, 0.3)"};
  
  &:focus {
    outline: none;
  }
`;

const GlassPanel = styled(motion.div)`
  background: rgba(26, 29, 36, 0.7);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
`;

const VoiceTranslationContainer = styled.div`
  width: 100%;
  color: #fff;
  background: linear-gradient(135deg, #0a0b0e 0%, #121317 50%, #1a1d24 100%);
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, rgba(161, 196, 253, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(194, 233, 251, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  position: relative;
  z-index: 1;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.8rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(161, 196, 253, 0.3);
  }
  
  p { 
    color: rgba(255,255,255,0.8); 
    margin: 0 auto; 
    max-width: 740px;
    font-size: 1.1rem;
  }
`;

const TranslationBox = styled(GlassPanel)`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const AudioSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const AudioVisualizer = styled.div`
  width: 100%;
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: ${props => props.recording ? 
      'linear-gradient(180deg, rgba(161, 196, 253, 0.15), transparent)' : 
      'transparent'};
    animation: ${props => props.recording ? css`${pulse} 2s infinite` : 'none'};
  }
`;

const AudioStatus = styled.div`
  position: absolute;
  bottom: 16px;
  background: rgba(0,0,0,0.7);
  padding: 10px 18px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.1);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.recording ? '#ff5f5f' : '#51cf66'};
    animation: ${props => props.recording ? css`${pulse} 1s infinite` : 'none'};
  }
`;

const AudioControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const LanguageSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  label {
    margin-bottom: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    
  }
  
  select {
    padding: 12px;
    border-radius: 10px;
    background: white;
    color: #686060ff;
    border: 1px solid rgba(255,255,255,0.1);
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #a1c4fd;
      box-shadow: 0 0 0 2px rgba(161, 196, 253, 0.3);
    }
  }
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const VoiceStyleSelector = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0;
  
  label {
    margin-bottom: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const VoicePreview = styled.div`
  margin-top: 1.5rem;
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    color: rgba(255,255,255,0.9);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
  }
  
  p { 
    color: rgba(255,255,255,0.8);
    line-height: 1.5;
  }
`;

const ErrorMsg = styled.div`
  margin-top: 12px;
  color: #ff6b6b;
  font-size: 0.95rem;
  text-align: left;
  padding: 12px;
  background: rgba(255,0,0,0.1);
  border-radius: 8px;
  border-left: 4px solid #ff6b6b;
`;

const SuccessMsg = styled.div`
  margin-top: 12px;
  color: #51cf66;
  font-size: 0.95rem;
  text-align: left;
  padding: 12px;
  background: rgba(0,255,0,0.1);
  border-radius: 8px;
  border-left: 4px solid #51cf66;
`;

const TranslationAudioSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
`;

const VoiceStyleCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  background: ${props => props.selected ? 'rgba(161, 196, 253, 0.2)' : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${props => props.selected ? '#a1c4fd' : 'rgba(255,255,255,0.1)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    background: rgba(161, 196, 253, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  span {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  small {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.6);
    margin-top: 4px;
  }
`;

const VoiceStyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FileUploadArea = styled(motion.div)`
  border: 2px dashed rgba(161, 196, 253, 0.4);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(161, 196, 253, 0.05);
  
  &:hover {
    border-color: #a1c4fd;
    background: rgba(161, 196, 253, 0.1);
  }
  
  input {
    display: none;
  }
  
  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
  }
`;

const DownloadButton = styled(motion.button)`
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  
  &:hover {
    background: linear-gradient(135deg, #40c057 0%, #2f9e44 100%);
  }
  
  &:focus {
    outline: none;
  }
`;

// ---------- Component ----------
const VoiceTranslationPage = () => {
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const recordedBlobRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("ur");
  const [targetLang, setTargetLang] = useState("en");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const audioPlayerRef = useRef(null);
  const translatedAudioRef = useRef(null);
  const [recordingLang, setRecordingLang] = useState("ur");
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState("default");
  const fileInputRef = useRef(null);
  const [audioName, setAudioName] = useState("");

  const API_BASE = "http://localhost:5000";

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "ur", name: "Urdu" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" }
  ];

  const voiceStyles = [
    { id: "default", name: "Default", icon: "🔊", description: "Standard voice" },
    { id: "feminine", name: "Feminine", icon: "🌸", description: "Softer, higher-pitched voice" },
    { id: "masculine", name: "Masculine", icon: "🦁", description: "Deeper, lower-pitched voice" },
    { id: "soft", name: "Soft", icon: "🍃", description: "Quiet, gentle voice" },
    { id: "loud", name: "Loud", icon: "📢", description: "Clear, projecting voice" },
    { id: "child", name: "Child", icon: "🚸", description: "Higher-pitched, youthful voice" },
    { id: "elderly", name: "Elderly", icon: "🧓", description: "Slower, more deliberate voice" }
  ];

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : "Unknown";
  };

  const getVoiceStyleName = (id) => {
    const style = voiceStyles.find(v => v.id === id);
    return style ? style.name : "Unknown";
  };

  const audioChunksClear = () => {
    recordedBlobRef.current = null;
    if (recordedUrl) {
      try { 
        URL.revokeObjectURL(recordedUrl); 
      } catch (e) {
        console.warn("Error revoking URL:", e);
      }
      setRecordedUrl(null);
    }
    if (translatedAudioUrl) {
      try {
        URL.revokeObjectURL(translatedAudioUrl);
      } catch (e) {
        console.warn("Error revoking translated audio URL:", e);
      }
      setTranslatedAudioUrl(null);
    }
    setTranscript("");
    setTranslation("");
    setError("");
    setSuccess("");
    setAudioName("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an audio file
    if (!file.type.startsWith('audio/')) {
      setError("Please upload an audio file");
      return;
    }
    
    setError("");
    setSuccess("");
    setTranslation("");
    setTranscript("");
    
    // Create a blob from the file
    recordedBlobRef.current = file;
    const url = URL.createObjectURL(file);
    setRecordedUrl(url);
    setAudioName(file.name);
    setSuccess("Audio file uploaded successfully!");
  };

  const startRecording = async () => {
    setError("");
    setSuccess("");
    setTranslation("");
    setTranscript("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return setError("Browser does not support microphone access (getUserMedia).");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16
        } 
      });
      const options = { mimeType: "audio/webm" };
      const mediaRecorder = new MediaRecorder(stream, options);

      audioChunksClear();
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        recordedBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
        setAudioName("recording.webm");
        
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {
          console.warn("Error stopping stream tracks:", e);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setRecording(true);
      setSuccess("Recording started... Speak now");
    } catch (e) {
      console.error(e);
      setError("Could not start microphone. Check permissions and try again.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    setSuccess("Recording stopped. Ready to translate.");
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn("stopRecording error:", e);
    }
  };

  const playRecorded = () => {
    if (!recordedUrl || !audioPlayerRef.current) return;
    audioPlayerRef.current.src = recordedUrl;
    audioPlayerRef.current.play().catch((e) => {
      console.error("play error", e);
      setError("Could not play audio: " + e.message);
    });
  };

  const playTranslatedAudio = () => {
    if (!translatedAudioUrl || !translatedAudioRef.current) return;
    translatedAudioRef.current.src = translatedAudioUrl;
    translatedAudioRef.current.play().catch((e) => {
      console.error("play translated audio error", e);
      setError("Could not play translated audio: " + e.message);
    });
  };

  const downloadTranslatedAudio = () => {
    if (!translatedAudioUrl) return;
    
    const a = document.createElement('a');
    a.href = translatedAudioUrl;
    a.download = `translated_${voiceStyle}_${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTranslate = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    setTtsLoading(true);

    const blob = recordedBlobRef.current;
    if (!blob) {
      setLoading(false);
      setTtsLoading(false);
      return setError("Please record or upload audio first.");
    }

    try {
      const fd = new FormData();
      fd.append("file", blob, audioName || "audio.webm");
      fd.append("source_lang", sourceLang);
      fd.append("target_lang", targetLang);
      fd.append("voice_style", voiceStyle);

      // Step 1: Translate the audio
      const res = await fetch(`${API_BASE}/translate`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let msg = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          msg = j.error || JSON.stringify(j);
        } catch (e) {
          console.warn("Error parsing error response:", e);
        }
        throw new Error(`Server error: ${msg}`);
      }

      const data = await res.json();
      setTranscript(data.transcript);
      setTranslation(data.translated_text);
      setSuccess("Translation successful!");

      // Step 2: Convert translated text to speech
      if (data.translated_text) {
        try {
          const ttsRes = await fetch(`${API_BASE}/text-to-speech`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: data.translated_text,
              lang: targetLang,
              voice_style: voiceStyle
            })
          });

          if (!ttsRes.ok) {
            throw new Error("TTS service failed");
          }

          const ttsBlob = await ttsRes.blob();
          const ttsUrl = URL.createObjectURL(ttsBlob);
          setTranslatedAudioUrl(ttsUrl);
          setSuccess(`Translation and ${getVoiceStyleName(voiceStyle)} voice generation successful!`);
        } catch (ttsError) {
          console.error("TTS error:", ttsError);
          setError("Translation was successful but audio generation failed.");
        }
      }

    } catch (e) {
      console.error("translate error", e);
      setError(e.message || "Translation failed. Please check if the server is running.");
    } finally {
      setLoading(false);
      setTtsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
      if (translatedAudioUrl) {
        URL.revokeObjectURL(translatedAudioUrl);
      }
    };
  }, [recordedUrl, translatedAudioUrl]);

  return (
    <VoiceTranslationContainer>
      <Section>
        <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1>Voice Translator with Multiple Voice Styles</h1>
          <p>Record your voice, upload an audio file, and get translations with different voice styles.</p>
        </Header>

        <TranslationBox>
          <AudioSection>
            <AudioVisualizer recording={recording}>
              <div style={{ textAlign: "center", zIndex: 2 }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  {recording ? "Recording…" : recordedUrl ? "Audio Ready" : "Ready"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem" }}>
                  {recording ? `Speaking ${getLanguageName(recordingLang)}` : 
                   recordedUrl ? "Ready to translate" : "Record or upload audio to start"}
                </div>
                {audioName && (
                  <div style={{ marginTop: 12, fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                    {audioName}
                  </div>
                )}
              </div>
              <AudioStatus recording={recording}>
                {recording ? "Recording" : recordedUrl ? "Ready" : "Waiting"}
                {recording && <span>{getLanguageName(recordingLang)}</span>}
              </AudioStatus>
            </AudioVisualizer>

            <div style={{ marginBottom: "1rem", textAlign: "center", width: "100%" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: 600 }}>I'm speaking in:</p>
              <select 
                value={recordingLang} 
                onChange={(e) => {
                  setRecordingLang(e.target.value);
                  setSourceLang(e.target.value);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#A6CAFC",
                  color: "balck",
                  border: "1px solid rgba(255,255,255,0.1)",
                  width: "80%",
                  fontWeight: 600
                }}
              >
                {languages.filter(l => l.code !== "auto").map(l => 
                  <option key={l.code} value={l.code}>{l.name}</option>
                )}
              </select>
            </div>

            <AudioControls>
              {!recording ? (
                <PrimaryButton onClick={startRecording} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <MicIcon /> Record
                </PrimaryButton>
              ) : (
                <SecondaryButton onClick={stopRecording} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><StopIcon /> Stop</SecondaryButton>
              )}
              <PrimaryButton onClick={playRecorded} disabled={!recordedUrl} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><PlayIcon /> Play</PrimaryButton>
              <SecondaryButton onClick={audioChunksClear} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Clear</SecondaryButton>
            </AudioControls>

            <FileUploadArea 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current.click()}
            >
              <UploadIcon />
              <p style={{ margin: "12px 0 6px 0", fontWeight: 600 }}>Click to upload audio file</p>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                Supported formats: MP3, WAV, WebM, OGG
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                style={{ display: "none" }}
              />
            </FileUploadArea>

            <audio ref={audioPlayerRef} hidden controls />
          </AudioSection>

          <div>
            <LanguageSelector>
              <div>
                <label>From Language:</label>
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                  {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label>To Language:</label>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                  {languages.filter(l => l.code !== "auto").map((l) => 
                    <option key={l.code} value={l.code}>{l.name}</option>)
                  }
                </select>
              </div>
            </LanguageSelector>

            <VoiceStyleSelector>
              <label><VoiceStyleIcon /> Voice Style:</label>
              <VoiceStyleGrid>
                {voiceStyles.map(style => (
                  <VoiceStyleCard 
                    key={style.id} 
                    selected={voiceStyle === style.id}
                    onClick={() => setVoiceStyle(style.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{style.icon}</span>
                    <p>{style.name}</p>
                    <small>{style.description}</small>
                  </VoiceStyleCard>
                ))}
              </VoiceStyleGrid>
            </VoiceStyleSelector>

            <VoicePreview>
              <h3>Translation Result</h3>

              {translation ? (
                <>
                  {transcript && (
                    <div style={{ marginTop: 16 }}>
                      <strong>Original ({getLanguageName(sourceLang)}):</strong> 
                      <div style={{ margin: "8px 0", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {transcript}
                      </div>
                    </div>
                  )}
                  {translation && (
                    <div style={{ marginTop: 16 }}>
                      <strong>Translation ({getLanguageName(targetLang)}):</strong> 
                      <div style={{ margin: "8px 0", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {translation}
                      </div>
                    </div>
                  )}
                  
                  {translatedAudioUrl && (
                    <TranslationAudioSection>
                      <strong>Audio Translation ({getVoiceStyleName(voiceStyle)} Voice):</strong>
                      <div style={{display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap"}}>
                        <PrimaryButton onClick={playTranslatedAudio} style={{padding: "10px 18px"}} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <SpeakerIcon /> Play Translation
                        </PrimaryButton>
                        <DownloadButton onClick={downloadTranslatedAudio} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <DownloadIcon /> Download MP3
                        </DownloadButton>
                      </div>
                    </TranslationAudioSection>
                  )}
                </>
              ) : (
                <p>No translation yet — record or upload audio and click "Translate".</p>
              )}

              {error && <ErrorMsg>{error}</ErrorMsg>}
              {success && <SuccessMsg>{success}</SuccessMsg>}
            </VoicePreview>
          </div>
        </TranslationBox>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <PrimaryButton 
            onClick={handleTranslate} 
            disabled={loading || !recordedUrl}
            style={{ minWidth: "220px", padding: "14px 28px", fontSize: "1.1rem" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (<><Spinner /> Translating…</>) : "Translate Audio"}
          </PrimaryButton>
        </div>
        
        <audio ref={translatedAudioRef} hidden controls />
      </Section>
    </VoiceTranslationContainer>
  );
};

export default VoiceTranslationPage;