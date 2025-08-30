// VoiceTranslationPage.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const PrimaryButton = ({ children, onClick, disabled, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "1rem",
      fontWeight: "700",
      opacity: disabled ? 0.8 : 1,
      ...style,
    }}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, disabled, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: "transparent",
      color: "#a1c4fd",
      border: "2px solid #a1c4fd",
      padding: "10px 22px",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "1rem",
      fontWeight: "700",
      ...style,
    }}
  >
    {children}
  </button>
);

const GlassPanel = ({ children, style }) => (
  <div
    style={{
      background: "rgba(26, 29, 36, 0.55)",
      border: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(8px)",
      borderRadius: "14px",
      padding: "1.5rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Icons (simple emoji)
const Mic = () => <span style={{ marginRight: 8 }}>🎤</span>;
const Stop = () => <span style={{ marginRight: 8 }}>⏹️</span>;
const Play = () => <span style={{ marginRight: 8 }}>▶️</span>;
const Spinner = () => <span style={{ marginRight: 8 }}>⏳</span>;
const Download = () => <span style={{ marginRight: 8 }}>📥</span>;
const Speaker = () => <span style={{ marginRight: 8 }}>🔊</span>;

// --- Styles (styled-components) ---
const VoiceTranslationContainer = styled.div`
  width: 100%;
  color: #fff;
  background: linear-gradient(135deg, #0a0b0e 0%, #121317 100%);
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Section = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.2rem;
    margin-bottom: 0.4rem;
  }
  p { color: rgba(255,255,255,0.8); margin: 0 auto; max-width: 740px; }
`;

const TranslationBox = styled(GlassPanel)`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 1.5rem;
  padding: 1.6rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const AudioSection = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:1rem;
`;

const AudioVisualizer = styled.div`
  width: 340px;
  height: 260px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.1));
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow: hidden;
`;

const VisualizerBars = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100px;
  width: 100%;
  gap: 2px;
  padding: 0 10px;
`;

const VisualizerBar = styled.div`
  width: 8px;
  background: linear-gradient(to top, #a1c4fd, #c2e9fb);
  border-radius: 4px 4px 0 0;
  transition: height 0.1s ease;
`;

const AudioStatus = styled.div`
  position:absolute;
  bottom:12px;
  background: rgba(0,0,0,0.6);
  padding:8px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  font-weight:700;
`;

const AudioControls = styled.div`
  display:flex;
  gap:1rem;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LanguageSelector = styled.div`
  display:flex;
  gap:1rem;
  margin-bottom: 1rem;
  select {
    padding: 10px;
    border-radius: 8px;
    background: white;
    color: #0d0909ff;
    border: 1px solid rgba(255,255,255,0.06);
    font-weight:600;
  }
  @media (max-width: 880px) { flex-direction: column; }
`;

const VoicePreview = styled.div`
  margin-top: 8px;
  h3 { margin: 0 0 .5rem 0; }
  p { color: rgba(255,255,255,0.8); }
`;

const ErrorMsg = styled.div`
  margin-top: 12px;
  color: #ffb3b3;
  font-size: 0.95rem;
  text-align:left;
`;

const ResultActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
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
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [error, setError] = useState("");
  const audioPlayerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const visualizerBarsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [visualizerData, setVisualizerData] = useState(new Array(20).fill(5));

  // Use environment variable or default to localhost
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "ur", name: "Urdu" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "pl", name: "Polish" },
    { code: "vi", name: "Vietnamese" },
    { code: "th", name: "Thai" }
  ];

  // Initialize audio context and analyzer
  useEffect(() => {
    if (recording) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Create bars for visualizer
      visualizerBarsRef.current = new Array(20).fill(0).map(() => React.createRef());
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [recording]);

  // Update visualizer bars
  useEffect(() => {
    if (recording && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Simplify the data for our visualizer
        const newData = [];
        const step = Math.floor(dataArray.length / 20);
        
        for (let i = 0; i < 20; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j];
          }
          newData.push(Math.max(5, sum / step / 4)); // Ensure minimum height
        }
        
        setVisualizerData(newData);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [recording]);

  // Clear audio chunks and URL
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
    setVisualizerData(new Array(20).fill(5));
  };

  // Start recording using MediaRecorder
  const startRecording = async () => {
    setError("");
    setTranslation("");
    setTranscript("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return setError("Browser does not support microphone access (getUserMedia).");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context and analyzer for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const options = { mimeType: "audio/webm" };
      const mediaRecorder = new MediaRecorder(stream, options);

      audioChunksClear();
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedBlobRef.current = recordedBlobRef.current 
            ? new Blob([recordedBlobRef.current, e.data], { type: e.data.type }) 
            : e.data;
        }
      };

      mediaRecorder.onstop = () => {
        // create URL
        if (recordedBlobRef.current) {
          const url = URL.createObjectURL(recordedBlobRef.current);
          setRecordedUrl(url);
        }
        // stop stream tracks
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {
          console.warn("Error stopping stream tracks:", e);
        }
        
        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      recordedBlobRef.current = null;
      mediaRecorder.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
      setError("Could not start microphone. Check permissions and try again.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
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
    audioPlayerRef.current.play().catch((e) => console.error("play error", e));
  };

  const handleTextToSpeech = async () => {
    if (!translation) return;
    
    try {
      const response = await fetch(`${API_BASE}/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translation,
          lang: targetLang,
        }),
      });
      
      if (!response.ok) {
        throw new Error("TTS request failed");
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setError("Text-to-speech failed. Please try again.");
    }
  };

  const downloadTranslation = () => {
    if (!translation) return;
    
    const element = document.createElement("a");
    const file = new Blob([translation], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "translation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // In the handleTranslate function, modify the error handling:
const handleTranslate = async () => {
    setError("");
    setLoading(true);
    setTranslation("");
    setTranscript("");

    const blob = recordedBlobRef.current;
    if (!blob) {
        setLoading(false);
        return setError("Please record audio first.");
    }

    try {
        const fd = new FormData();
        fd.append("file", blob, "recording.webm");
        fd.append("source_lang", sourceLang);
        fd.append("target_lang", targetLang);

        const res = await fetch(`${API_BASE}/translate`, {
            method: "POST",
            body: fd,
        });

        const responseText = await res.text();
        
        if (!res.ok) {
            let errorMsg = `Server error: ${res.status} ${res.statusText}`;
            try {
                const errorData = JSON.parse(responseText);
                errorMsg = errorData.error || errorMsg;
            } catch (e) {
                errorMsg = responseText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        const data = JSON.parse(responseText);
        setTranscript(data.transcript);
        setTranslation(data.translated_text);

    } catch (e) {
        console.error("translate error", e);
        setError(e.message || "Translation failed. Please check if the backend server is running.");
    } finally {
        setLoading(false);
    }
};
  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [recordedUrl]);

  return (
    <VoiceTranslationContainer>
      <Section>
        <Header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <h1>Pro Voice Translator</h1>
          <p>Record your voice, get it transcribed and translated in real-time. Listen to translations with text-to-speech.</p>
        </Header>

        <TranslationBox>
          <AudioSection>
            <AudioVisualizer>
              {recording ? (
                <VisualizerBars>
                  {visualizerData.map((height, index) => (
                    <VisualizerBar 
                      key={index} 
                      style={{ height: `${height}px` }} 
                    />
                  ))}
                </VisualizerBars>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {recording ? "Recording…" : recordedUrl ? "Recorded" : "Idle"}
                  </div>
                  <div style={{ marginTop: 8, color: "rgba(255,255,255,0.75)" }}>
                    {recording ? "Speak now" : recordedUrl ? "Ready to translate" : "Click Record"}
                  </div>
                </div>
              )}
              <AudioStatus>{recording ? "● Recording" : recordedUrl ? "● Ready" : "● Idle"}</AudioStatus>
            </AudioVisualizer>

            <AudioControls>
              {!recording ? (
                <PrimaryButton onClick={startRecording}><Mic />Record</PrimaryButton>
              ) : (
                <SecondaryButton onClick={stopRecording}><Stop />Stop</SecondaryButton>
              )}
              <PrimaryButton onClick={playRecorded} disabled={!recordedUrl}><Play />Play</PrimaryButton>
              <SecondaryButton onClick={() => { audioChunksClear(); setTranscript(""); setTranslation(""); }}>Clear</SecondaryButton>
            </AudioControls>

            <audio ref={audioPlayerRef} hidden controls />
          </AudioSection>

          <div>
            <LanguageSelector>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                {languages.filter(l => l.code !== 'auto').map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </LanguageSelector>

            <VoicePreview>
              <h3>Translation Result</h3>

              {translation ? (
                <>
                  {transcript && <p style={{ marginTop: 10 }}><strong>Transcript:</strong> {transcript}</p>}
                  {translation && <p style={{ marginTop: 6 }}><strong>Translation:</strong> {translation}</p>}
                  
                  <ResultActions>
                    <SecondaryButton onClick={handleTextToSpeech} disabled={!translation}>
                      <Speaker /> Listen
                    </SecondaryButton>
                    <SecondaryButton onClick={downloadTranslation} disabled={!translation}>
                      <Download /> Download
                    </SecondaryButton>
                  </ResultActions>
                </>
              ) : (
                <p>No translation yet — record audio and click "Translate" to get results.</p>
              )}

              {error && <ErrorMsg>{error}</ErrorMsg>}
            </VoicePreview>
          </div>
        </TranslationBox>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <PrimaryButton onClick={handleTranslate} disabled={loading || !recordedUrl}>
            {loading ? (<><Spinner />Translating…</>) : "Translate My Voice"}
          </PrimaryButton>
        </div>
      </Section>
    </VoiceTranslationContainer>
  );
};

export default VoiceTranslationPage;