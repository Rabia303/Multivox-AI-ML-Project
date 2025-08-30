import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaFileUpload, FaLink, FaSpinner, FaFileDownload, FaFire } from 'react-icons/fa';
import { PrimaryButton } from '../components/common/Button';
import { GlassPanel } from '../components/ui/GlassPanel';

// Languages supported by Google Translate
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
];

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledGlassPanel = styled(GlassPanel)`
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#4fc3f7' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  border-bottom: 2px solid ${props => props.$active ? '#4fc3f7' : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #4fc3f7;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  gap: 1rem;

  &:hover {
    border-color: #4fc3f7;
    background: rgba(79, 195, 247, 0.1);
  }
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: #4fc3f7;
  margin-top: 0.5rem;
  word-break: break-all;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #4fc3f7 0%, #29b6f6 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
  }
`;

const BurnButton = styled(DownloadButton)`
  background: linear-gradient(90deg, #ff6b6b 0%, #ff8e53 100%);
  margin-left: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4fc3f7 0%, #29b6f6 100%);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;

const Spinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LanguageSelectorContainer = styled.div`
  margin: 1.5rem 0;
`;

const LanguageSelect = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
`;

const LanguageOption = styled.option`
  background: #1a1d24;
  color: white;
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
`;

const PreviewVideo = styled.video`
  width: 100%;
  max-height: 500px;
  margin-top: 1rem;
  border-radius: 8px;
  background: black;
`;

const SubtitleGenerator = () => {
  const [inputMode, setInputMode] = useState('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [status, setStatus] = useState('idle'); // idle | processing | completed | error
  const [progress, setProgress] = useState(0);
  const [srtContent, setSrtContent] = useState('');
  const [vttUrl, setVttUrl] = useState('');
  const [burnedVideoUrl, setBurnedVideoUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState(''); // what the <video> element plays right now
  const [error, setError] = useState('');
  const [originalMediaFilename, setOriginalMediaFilename] = useState('');
  const vttBlobRef = useRef(null);
  const fileObjectUrlRef = useRef(null);

  // Cleanup blob URLs on unmount or when changed
  useEffect(() => {
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
      if (fileObjectUrlRef.current) URL.revokeObjectURL(fileObjectUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // create a preview object url immediately
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current);
        fileObjectUrlRef.current = null;
      }
      const obj = URL.createObjectURL(file);
      fileObjectUrlRef.current = obj;
      setPreviewSrc(obj);
    }
  };

  // Convert SRT to WebVTT format
  const srtToVtt = (srt) => {
    if (!srt) return '';
    return 'WEBVTT\n\n' + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  };

  // Main combined handler: generate subtitles AND burn them. While burning runs,
  // show the original preview with overlay (for local files immediate; for links if direct playable)
  const handleGenerateAndBurn = async () => {
    setError('');
    setBurnedVideoUrl('');
    setSrtContent('');
    setVttUrl('');
    setOriginalMediaFilename('');
    setProgress(5);

    if (inputMode === 'link' && !videoUrl) {
      setError('Please enter a video URL');
      return;
    }
    if (inputMode === 'file' && !selectedFile) {
      setError('Please upload a video file');
      return;
    }

    // If file is uploaded and preview not set yet, set it immediately
    if (inputMode === 'file' && selectedFile && !previewSrc) {
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current);
      }
      const obj = URL.createObjectURL(selectedFile);
      fileObjectUrlRef.current = obj;
      setPreviewSrc(obj);
    }

    // If link is a direct playable resource (mp4/webm), set previewSrc immediately
    if (inputMode === 'link' && videoUrl) {
      const lower = videoUrl.toLowerCase();
      if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) {
        setPreviewSrc(videoUrl);
      } else {
        // For YouTube / non-direct links, preview will be available only after backend returns originalMediaFilename
        setPreviewSrc('');
      }
    }

    setStatus('processing');
    setProgress(10);

    const formData = new FormData();
    formData.append('language', selectedLanguage);
    formData.append('burnSubtitles', 'true'); // always burn in this flow

    if (inputMode === 'link') {
      formData.append('videoUrl', videoUrl);
    } else {
      formData.append('file', selectedFile);
    }

    try {
      // POST to backend - backend should stream or return generated SRT quickly and then later return burned video path.
      const response = await axios.post(
        'http://localhost:5000/api/generate-subtitles',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const p = Math.round(((progressEvent.loaded / (progressEvent.total || 1)) * 40) + 10);
            setProgress(Math.min(p, 60));
          },
          timeout: 20 * 60 * 1000, // 20 minutes - adjust if needed
        }
      );

      // Expecting backend to return at least:
      // { srt: '...', originalMediaFilename: '/files/abc.mp4' (optional), video_with_subtitles: '/output/burned.mp4' (if ready) }
      const data = response.data || {};
      const srt = data.srt || '';
      setSrtContent(srt);

      // create VTT overlay immediately from SRT (so preview shows generated subtitles instantly)
      if (srt) {
        const vttText = srtToVtt(srt);
        if (vttBlobRef.current) {
          URL.revokeObjectURL(vttBlobRef.current);
          vttBlobRef.current = null;
        }
        const blob = new Blob([vttText], { type: 'text/vtt' });
        const vttBlobUrl = URL.createObjectURL(blob);
        vttBlobRef.current = vttBlobUrl;
        setVttUrl(vttBlobUrl);
      }

      // If backend returns originalMediaFilename (when link upload flow), set preview to that backend file URL
      if (data.originalMediaFilename) {
        const backendOriginal = `http://localhost:5000/files/${data.originalMediaFilename}`;
        setOriginalMediaFilename(data.originalMediaFilename);
        setPreviewSrc(backendOriginal);
      }

      setProgress(80);

      // If backend already returned burned video path in the same response:
      if (data.video_with_subtitles) {
        const burned = `http://localhost:5000${data.video_with_subtitles}`;
        setBurnedVideoUrl(burned);
        // swap preview to burned video but keep VTT track (shouldn't cause flicker)
        setPreviewSrc(burned);
        setProgress(100);
        setStatus('completed');
      } else {
        // If burned video isn't present yet, poll for completion (optional) or wait for backend push.
        // Here we'll attempt a simple polling approach — poll endpoint to check for finished burned video.
        // Polling endpoint (you must implement on backend) could be: /api/subtitle-status?fileId=...
        // We'll try a best-effort poll up to N times if backend returned a jobId.
        const jobId = data.jobId || null;
        if (jobId) {
          // Polling loop
          const maxPolls = 30; // adjust
          let attempts = 0;
          let burnedUrl = null;
          while (attempts < maxPolls && !burnedUrl) {
            // small delay
            await new Promise(res => setTimeout(res, 2000));
            attempts += 1;
            try {
              const statusResp = await axios.get(`http://localhost:5000/api/subtitle-status?jobId=${jobId}`);
              if (statusResp?.data?.video_with_subtitles) {
                burnedUrl = `http://localhost:5000${statusResp.data.video_with_subtitles}`;
                break;
              }
              // progress feedback if provided
              if (statusResp?.data?.progress) {
                const backendProgress = 80 + Math.round(statusResp.data.progress * 0.18); // map to 80-98
                setProgress(Math.min(98, backendProgress));
              }
            } catch (pollErr) {
              // ignore transient poll errors
            }
          }
          if (burnedUrl) {
            setBurnedVideoUrl(burnedUrl);
            setPreviewSrc(burnedUrl);
            setProgress(100);
            setStatus('completed');
          } else {
            // poll timed out - still mark completed but warn user
            setStatus('completed');
            setProgress(98);
            setError('Burning finished in background but we could not find the burned video yet. Check server or try again later.');
          }
        } else {
          // If no jobId and no burned video: treat as completed generating SRT but burned video will be available later
          setStatus('completed');
          setProgress(90);
        }
      }
    } catch (err) {
      console.error('Error generating/burning subtitles', err);
      setStatus('error');
      const errMsg = err.response?.data?.error || err.message || 'Failed to generate/burn subtitles';
      setError(errMsg);
    }
  };

  const handleDownloadSRT = () => {
    if (!srtContent) return;
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles-${selectedLanguage}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBurnedVideo = () => {
    if (!burnedVideoUrl) return;
    const a = document.createElement('a');
    a.href = burnedVideoUrl;
    a.download = 'video_with_subtitles.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container>
      <StyledGlassPanel>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Video Subtitle Generator
        </h1>

        <Tabs>
          <Tab $active={inputMode === 'link'} onClick={() => setInputMode('link')}>
            <FaLink /> Video URL
          </Tab>
          <Tab $active={inputMode === 'file'} onClick={() => setInputMode('file')}>
            <FaFileUpload /> File Upload
          </Tab>
        </Tabs>

        {inputMode === 'link' ? (
          <InputContainer>
            <Input
              type="text"
              placeholder="Paste YouTube or video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <small style={{ color: 'rgba(255,255,255,0.6)' }}>
              Note: For non-direct links (YouTube) preview will appear after the server fetches the media.
            </small>
          </InputContainer>
        ) : (
          <>
            <FileUploadLabel htmlFor="file-upload-input">
              <FaFileUpload size={24} />
              <span>Click to upload video file</span>
              {selectedFile && <FileName>{selectedFile.name}</FileName>}
            </FileUploadLabel>
            <HiddenFileInput
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
              accept="video/*,audio/*"
            />
          </>
        )}

        <LanguageSelectorContainer>
          <LanguageSelect
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <LanguageOption key={lang.code} value={lang.code}>
                {lang.name}
              </LanguageOption>
            ))}
          </LanguageSelect>
        </LanguageSelectorContainer>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <PrimaryButton
            onClick={handleGenerateAndBurn}
            disabled={status === 'processing'}
            style={{ flex: 1, background: 'linear-gradient(90deg, #C2E9FB 0%, #C2E9FB 100%)' }}
          >
            {status === 'processing' ? <><Spinner /> Processing...</> : <><FaFire /> Generate & Burn Subtitles</>}
          </PrimaryButton>
        </div>

        {status === 'processing' && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>
            <ProgressText>Processing... {progress}%</ProgressText>
          </ProgressContainer>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Results + Downloads */}
        {(status === 'completed' || srtContent || burnedVideoUrl) && (
          <ResultsContainer>
            <div style={{ display: 'flex', marginTop: '1.5rem' }}>
              {srtContent && (
                <DownloadButton onClick={handleDownloadSRT}>
                  <FaFileDownload /> Download SRT
                </DownloadButton>
              )}
              {burnedVideoUrl && (
                <BurnButton onClick={handleDownloadBurnedVideo}>
                  <FaFileDownload /> Download Burned Video
                </BurnButton>
              )}
            </div>

            {/* Live preview + overlay */}
            {previewSrc ? (
              <PreviewContainer>
                <h2>Video Preview with Subtitles</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Subtitles are shown as an overlay during playback. If burning is complete, the preview will switch to the burned file automatically.
                </p>
                <PreviewVideo controls key={previewSrc}>
                  <source src={previewSrc} type="video/mp4" />
                  {vttUrl && (
                    <track
                      src={vttUrl}
                      kind="subtitles"
                      srcLang={selectedLanguage}
                      label={languages.find(l => l.code === selectedLanguage)?.name || 'Subtitles'}
                      default
                    />
                  )}
                  Your browser does not support the video tag.
                </PreviewVideo>
              </PreviewContainer>
            ) : (
              <PreviewContainer>
                <h2>Preview will appear here</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  If you uploaded a file, it will play immediately with live subtitles. For links, preview appears if the URL is directly playable or after the server fetches it.
                </p>
              </PreviewContainer>
            )}
          </ResultsContainer>
        )}
      </StyledGlassPanel>
    </Container>
  );
};

export default SubtitleGenerator;