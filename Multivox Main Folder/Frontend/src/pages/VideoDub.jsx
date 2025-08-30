import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaUpload, FaCog, FaDownload, FaPlay } from 'react-icons/fa';

// This will be set dynamically based on the ngrok URL
let API_URL = "https://cicada-together-marginally.ngrok-free.app";

// GlassPanel component
const GlassPanel = styled.div`
  background: ${props => props.background || 'rgba(26, 29, 36, 0.5)'};
  border-radius: ${props => props.$rounded ? '16px' : '0'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.padding || '2rem'};
  transition: all 0.3s ease;
`;

// PrimaryButton component
const PrimaryButton = styled.button`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  color: #0a0b0e;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(161, 196, 253, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Main container with dark background
const DubContainer = styled.div`
  position: relative;
  width: 100%;
  color: #ffffff;
  background: #0a0b0e;
  padding: 4rem 2rem;
  min-height: 100vh;
`;

// Section styling consistent with home page
const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

// Header with home page's title styling
const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
    border-radius: 3px;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
`;

// Video section with glass panel effect
const VideoPreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const VideoPreview = styled(GlassPanel)`
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  background: rgba(26, 29, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 0;
`;

const FileInputLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

// Language selector matching home page style
const LanguageSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem auto;
`;

const LanguagePill = styled.div`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  font-weight: 500;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  min-width: 120px;
  text-align: center;
`;

const ArrowIcon = styled(FaArrowRight)`
  color: #a1c4fd;
  font-size: 1.5rem;
`;

// Controls section with grid layout
const ControlsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
`;

const ControlGroup = styled(GlassPanel)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(26, 29, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const ControlTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
`;

// Styled select to match home page inputs
const SelectControl = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:focus {
    border-color: rgba(161, 196, 253, 0.9);
    box-shadow: 0 0 0 3px rgba(161, 196, 253, 0.4);
  }

  option {
    background: #1a1d24;
    color: #fff;
  }
`;

// Checkbox styles
const CheckboxControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #a1c4fd;
`;

const CheckboxLabel = styled.label`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
`;

// Progress bar styles
const ProgressContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
`;

// Action button matching home page style
const ActionButton = styled(PrimaryButton)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  border-radius: 12px;
  margin: 2rem auto;
  display: block;
`;

// Error message styles
const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

// Success message styles
const SuccessMessage = styled.div`
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid rgba(46, 204, 113, 0.3);
`;

// Download button styles
const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  color: #0a0b0e;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(161, 196, 253, 0.4);
  }
`;

const VideoDub = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [processing, setProcessing] = useState(false);
  const [dubbedUrl, setDubbedUrl] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [speakers, setSpeakers] = useState({});
  const [voicePreferences, setVoicePreferences] = useState({});
  const [keepBackground, setKeepBackground] = useState(true);
  const [generateSubtitles, setGenerateSubtitles] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [supportedLanguages, setSupportedLanguages] = useState({});
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Fetch available voices and supported languages from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch supported languages
        const langResponse = await axios.get(`${API_URL}/languages`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        setSupportedLanguages(langResponse.data.supported_languages || {});
        
        // Fetch available voices
        const voicesResponse = await axios.get(`${API_URL}/voices`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        
        // Handle both array and object responses
        let voicesData = voicesResponse.data;
        
        // If the response is an object with language keys, flatten it to an array
        if (voicesData && typeof voicesData === 'object' && !Array.isArray(voicesData)) {
          // Convert object to array by combining all language arrays
          voicesData = Object.values(voicesData).flat();
        }
        
        // Ensure we always have an array
        setAvailableVoices(Array.isArray(voicesData) ? voicesData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback voices if API call fails
        setAvailableVoices([
          { id: "default", name: "Default Voice", language: "en", type: "gtts" },
        ]);
        
        // Fallback languages
        setSupportedLanguages({
          "en": {"name": "English", "tts_support": true},
          "es": {"name": "Spanish", "tts_support": true},
          "fr": {"name": "French", "tts_support": true},
          "de": {"name": "German", "tts_support": true},
          "it": {"name": "Italian", "tts_support": true},
          "pt": {"name": "Portuguese", "tts_support": true},
          "ja": {"name": "Japanese", "tts_support": true},
          "ko": {"name": "Korean", "tts_support": true},
          "zh-cn": {"name": "Chinese (Simplified)", "tts_support": true},
          "ru": {"name": "Russian", "tts_support": true},
          "ar": {"name": "Arabic", "tts_support": true},
          "hi": {"name": "Hindi", "tts_support": true},
          "ur": {"name": "Urdu", "tts_support": true},
        });
      }
    };
    
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("File too large. Max size: 50MB");
        return;
      }
      
      setVideoFile(file);
      setError("");
      setDubbedUrl(""); // Reset dubbed URL when new file is selected
      
      // Create a preview URL for the video
      const videoURL = URL.createObjectURL(file);
      setVideoPreviewUrl(videoURL);
    }
  };

  const handleVoiceChange = (speakerId, voiceId) => {
    setVoicePreferences(prev => ({
      ...prev,
      [speakerId]: voiceId
    }));
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }
    
    // Check if selected language is supported
    if (!supportedLanguages[language]) {
      const supportedList = Object.entries(supportedLanguages)
        .map(([code, info]) => `${code} (${info.name})`)
        .join(", ");
      
      setError(`Language '${language}' is not supported. Please choose from: ${supportedList}`);
      return;
    }
    
    // Check if TTS is supported for the selected language
    if (!supportedLanguages[language]?.tts_support) {
      setError(`TTS is not available for ${supportedLanguages[language]?.name}. Please choose a different language.`);
      return;
    }
    
    setError("");
    setProcessing(true);
    setDubbedUrl("");
    setSubtitleUrl("");
    setProgress(0);
    setStatus("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("language", language);
      formData.append("keep_background", keepBackground);
      formData.append("generate_subtitles", generateSubtitles);
      formData.append("voice_preferences", JSON.stringify(voicePreferences));

      const res = await axios.post(`${API_URL}/dub`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true"
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
          if (percent === 100) {
            setStatus("Processing video...");
          }
        },
        timeout: 300000  // 5 minutes timeout for processing
      });

      if (res.data.result_url) {
        setDubbedUrl(res.data.result_url);
        setSubtitleUrl(res.data.subtitle_url || "");
        setSpeakers(res.data.speakers || {});
        setStatus("Dubbing complete!");
        
        // Clear the original video preview to show the dubbed video
        if (videoPreviewUrl) {
          URL.revokeObjectURL(videoPreviewUrl);
          setVideoPreviewUrl("");
        }
      } else {
        setError("Failed to process video: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.status === 400 && err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timed out. The video might be too long or the server is busy.");
      } else {
        setError("Error: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoPreviewUrl("");
    setDubbedUrl("");
    setSubtitleUrl("");
    setError("");
    setSpeakers({});
    setVoicePreferences({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  // Filter voices by selected language - make sure availableVoices is an array
  const filteredVoices = Array.isArray(availableVoices) 
    ? availableVoices.filter(voice => 
        voice.language === language || voice.type === "gtts"
      )
    : [];

  return (
    <DubContainer>
      <Section>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>AI Video Dubbing</Title>
          <Subtitle>Transform your video with AI-powered dubbing while preserving the natural voice and emotion</Subtitle>
        </Header>

        <VideoPreviewSection>
          <VideoPreview $rounded>
            {dubbedUrl ? (
              <>
                <VideoPlayer 
                  ref={videoRef} 
                  controls 
                  src={dubbedUrl}
                  style={{ width: '100%', height: '100%' }}
                  autoPlay
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: 'white'
                }}>
                  Dubbed Video
                </div>
              </>
            ) : videoPreviewUrl ? (
              <>
                <VideoPlayer 
                  ref={videoRef} 
                  controls 
                  src={videoPreviewUrl}
                  style={{ width: '100%', height: '100%' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: 'white'
                }}>
                  Original Video
                </div>
              </>
            ) : (
              <FileInputLabel htmlFor="video-upload">
                <UploadIcon />
                <UploadText>Click to upload MP4 video</UploadText>
                <UploadSubtext>Max file size: 50MB</UploadSubtext>
              </FileInputLabel>
            )}
            <input 
              type="file" 
              accept="video/mp4" 
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
              id="video-upload"
            />
          </VideoPreview>

          <LanguageSelectorContainer>
            <LanguagePill>Original</LanguagePill>
            <ArrowIcon />
            <LanguagePill>
              <SelectControl 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', textAlign: 'center' }}
                disabled={processing}
              >
                {Object.entries(supportedLanguages).map(([code, info]) => (
                  <option 
                    key={code} 
                    value={code}
                    disabled={!info.tts_support}
                  >
                    {info.name}
                  </option>
                ))}
              </SelectControl>
            </LanguagePill>
          </LanguageSelectorContainer>
        </VideoPreviewSection>

        <ControlsSection>
          <ControlGroup $rounded>
            <div>
              <ControlTitle>Dubbing Options</ControlTitle>
              
              <CheckboxControl>
                <CheckboxInput 
                  type="checkbox" 
                  checked={keepBackground}
                  onChange={(e) => setKeepBackground(e.target.checked)}
                  disabled={processing}
                  id="keep-background"
                />
                <CheckboxLabel htmlFor="keep-background">
                  Keep background sounds/music
                </CheckboxLabel>
              </CheckboxControl>
              
              <CheckboxControl>
                <CheckboxInput 
                  type="checkbox" 
                  checked={generateSubtitles}
                  onChange={(e) => setGenerateSubtitles(e.target.checked)}
                  disabled={processing}
                  id="generate-subtitles"
                />
                <CheckboxLabel htmlFor="generate-subtitles">
                  Generate subtitles
                </CheckboxLabel>
              </CheckboxControl>
              
              <button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a1c4fd",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <FaCog /> {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
              </button>
            </div>
          </ControlGroup>

          {showAdvancedOptions && Object.keys(speakers).length > 0 && (
            <ControlGroup $rounded>
              <div>
                <ControlTitle>Speaker Voice Assignments</ControlTitle>
                {Object.entries(speakers).map(([speakerId, voice]) => (
                  <div key={speakerId} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.9)" }}>
                      {speakerId}:
                    </label>
                    <SelectControl 
                      value={voicePreferences[speakerId] || "default"}
                      onChange={(e) => handleVoiceChange(speakerId, e.target.value)}
                      disabled={processing}
                    >
                      <option value="default">Default Voice</option>
                      {filteredVoices.map(voice => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name}
                        </option>
                      ))}
                    </SelectControl>
                  </div>
                ))}
              </div>
            </ControlGroup>
          )}
        </ControlsSection>

        {processing && (
          <GlassPanel $rounded style={{ marginBottom: '2rem' }}>
            <ControlTitle>{status}</ControlTitle>
            <ProgressContainer>
              <ProgressBar style={{ width: `${progress}%` }} />
            </ProgressContainer>
            <p style={{ textAlign: 'center', margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>{progress}%</p>
          </GlassPanel>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {dubbedUrl && (
          <SuccessMessage>
            <ControlTitle style={{ textAlign: 'center', color: '#2ecc71' }}>Dubbing Complete!</ControlTitle>
            <p style={{ textAlign: 'center', margin: '0.5rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
              The dubbed video is now playing in the preview above.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <DownloadButton 
                href={dubbedUrl} 
                download="dubbed_video.mp4"
              >
                <FaDownload /> Download Video
              </DownloadButton>
              {subtitleUrl && (
                <DownloadButton 
                  href={subtitleUrl} 
                  download="subtitles.vtt"
                >
                  <FaDownload /> Download Subtitles
                </DownloadButton>
              )}
              <PrimaryButton onClick={resetForm} style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                Dub Another Video
              </PrimaryButton>
            </div>
          </SuccessMessage>
        )}

        {!dubbedUrl && (
          <ActionButton 
            onClick={handleSubmit}
            disabled={processing || !videoFile || !supportedLanguages[language]?.tts_support}
          >
            {processing ? 'Processing...' : 'Start Dubbing'}
          </ActionButton>
        )}
      </Section>
    </DubContainer>
  );
};

export default VideoDub;