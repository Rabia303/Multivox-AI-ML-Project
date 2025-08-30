import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMicrophone, FaHistory, FaCog, FaCopy, FaDownload, FaSync, FaMoon, FaTrash, FaUpload, FaGlobe, FaVolumeUp, FaStar, FaShare, FaBookmark, FaExpand, FaCompress, FaLightbulb } from 'react-icons/fa';

// GlassPanel component
const GlassPanel = styled.div`
  background: ${props => props.background || 'rgba(26, 29, 36, 0.7)'};
  border-radius: ${props => props.$rounded ? '20px' : '0'};
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: ${props => props.padding || '2rem'};
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

// PrimaryButton component
const PrimaryButton = styled.button`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  color: #0a0b0e;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(161, 196, 253, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// ClearButton component
const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 100, 100, 0.15);
  color: #ff6464;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 100, 100, 0.25);
    transform: translateY(-2px);
  }
`;

// Main container with dark background
const TranslationContainer = styled.div`
  position: relative;
  width: 100%;
  color: #ffffff;
  background: linear-gradient(135deg, #0a0b0e 0%, #1a1d24 100%);
  padding: 2rem;
  min-height: 100vh;
`;

// Section styling
const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
`;

// Header with title styling
const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 800;
  position: relative;
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
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
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 2rem auto;
  font-weight: 300;
`;

// Main content area
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// Text areas
const TextAreaContainer = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  height: 350px;
  padding: 1.8rem;
  background: rgba(26, 29, 36, 0.8);
`;

const TextAreaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const LanguageFlag = styled.span`
  font-size: 1.5rem;
`;

const LanguageSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(161, 196, 253, 0.6);
    box-shadow: 0 0 0 3px rgba(161, 196, 253, 0.2);
  }

  option {
    background: #1a1d24;
    color: #fff;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #ffffff;
  padding: 1.2rem;
  resize: none;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(161, 196, 253, 0.5);
    box-shadow: 0 0 0 3px rgba(161, 196, 253, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

// Character counter
const CharacterCounter = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: ${props => props.count > props.max ? '#ff6464' : 'rgba(255, 255, 255, 0.6)'};
  margin-top: 0.5rem;
`;

// Action buttons
const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: ${props => props.variant === 'primary' ? 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.variant === 'primary' ? '#0a0b0e' : '#ffffff'};
  border: none;
  padding: 0.9rem 1.6rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.variant === 'primary' ? '600' : '500'};
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' 
      ? '0 8px 20px rgba(161, 196, 253, 0.4)' 
      : '0 8px 20px rgba(0, 0, 0, 0.3)'};
    background: ${props => props.variant === 'primary' 
      ? 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)' 
      : 'rgba(255, 255, 255, 0.12)'};
  }
`;

// Features section
const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2rem 1.5rem;
  background: rgba(26, 29, 36, 0.7);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    background: rgba(26, 29, 36, 0.8);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.2rem;
  color: #a1c4fd;
  background: linear-gradient(135deg, rgba(161, 196, 253, 0.1) 0%, rgba(194, 233, 251, 0.1) 100%);
  padding: 1rem;
  border-radius: 16px;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
`;

// History section
const HistorySection = styled(GlassPanel)`
  margin-bottom: 2.5rem;
  background: rgba(26, 29, 36, 0.7);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const HistoryList = styled.div`
  max-height: 250px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(161, 196, 253, 0.5);
    border-radius: 10px;
  }
`;

const HistoryItem = styled.div`
  padding: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }
`;

const HistoryText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const HistoryTimestamp = styled.small`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
`;

// Settings section
const SettingsSection = styled(GlassPanel)`
  margin-bottom: 2.5rem;
  background: rgba(26, 29, 36, 0.7);
`;

const SettingGroup = styled.div`
  margin-bottom: 2rem;
`;

const SettingLabel = styled.label`
  display: block;
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-weight: 600;
  font-size: 1.1rem;
`;

const SettingSelect = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(161, 196, 253, 0.6);
    box-shadow: 0 0 0 3px rgba(161, 196, 253, 0.2);
  }

  option {
    background: #1a1d24;
    color: #fff;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: none;
  padding: 1rem 1.8rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 100, 100, 0.15);
  color: #ff6464;
  border: none;
  padding: 1rem 1.8rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(255, 100, 100, 0.2);
    transform: translateY(-2px);
  }
`;

const TipText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 2.5rem;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #a1c4fd;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
  display: inline-block;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FavoriteButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.favorited ? '#FFD700' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFD700;
    transform: scale(1.1);
  }
`;

const ExpandButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #a1c4fd;
  }
`;

const LanguageTranslator = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('Translation will appear here…');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [style, setStyle] = useState('default');
  const [domain, setDomain] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = sourceLanguage;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSourceText(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('translationFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
    };
  }, [sourceLanguage]);

  useEffect(() => {
    setCharCount(sourceText.length);
  }, [sourceText]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.lang = sourceLanguage;
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
    }
  };

  const speakText = () => {
    if (synthesisRef.current && translatedText && translatedText !== 'Translation will appear here…') {
      if (synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLanguage;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesisRef.current.speak(utterance);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          target_lang: targetLanguage,
          source_lang: sourceLanguage,
          style: style !== 'default' ? style : null,
          domain: domain !== 'general' ? domain : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translated_text);
        
        // Add to history
        if (sourceText.trim() !== '') {
          const newHistoryItem = {
            id: Date.now(),
            source: sourceText,
            translation: data.translated_text,
            timestamp: new Date().toLocaleString(),
            favorited: false
          };
          
          setHistory([newHistoryItem, ...history].slice(0, 5)); // Keep only last 5 items
        }
      } else {
        const error = await response.json();
        alert(`Translation failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    alert('Translation copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([translatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'translation.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch('http://localhost:5000/download_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          translated_text: translatedText,
          source_lang: sourceLanguage,
          target_lang: targetLanguage,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `translation_${sourceLanguage}_to_${targetLanguage}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        alert(`PDF download failed: ${error.error}`);
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF download failed. Please check your connection and try again.');
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('Translation will appear here…');
    setFileName('');
  };

  const handleReset = () => {
    setSourceText('');
    setTranslatedText('Translation will appear here…');
    setHistory([]);
    setFileName('');
    alert('App has been reset!');
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLanguage);
    formData.append('source_lang', sourceLanguage);
    formData.append('style', style);
    formData.append('domain', domain);

    try {
      const response = await fetch('http://localhost:5000/translate_file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSourceText(data.original_text || 'Document content extracted');
        setTranslatedText(data.translated_text);
        
        // Add to history
        const newHistoryItem = {
          id: Date.now(),
          source: `[Document: ${file.name}] ${data.original_text || 'Document content'}`,
          translation: data.translated_text,
          timestamp: new Date().toLocaleString(),
          favorited: false
        };
        
        setHistory([newHistoryItem, ...history].slice(0, 5));
      } else {
        const error = await response.json();
        alert(`Document translation failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Document upload error:', error);
      alert('Document upload failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    const updatedHistory = history.map(item => 
      item.id === id ? {...item, favorited: !item.favorited} : item
    );
    setHistory(updatedHistory);
    
    // Update favorites list
    const favoritedItem = updatedHistory.find(item => item.id === id && item.favorited);
    if (favoritedItem) {
      const newFavorites = [...favorites, favoritedItem];
      setFavorites(newFavorites);
      localStorage.setItem('translationFavorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = favorites.filter(item => item.id !== id);
      setFavorites(newFavorites);
      localStorage.setItem('translationFavorites', JSON.stringify(newFavorites));
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleSuggestion = () => {
    const suggestions = [
      "Hello, how are you today?",
      "Where is the nearest restaurant?",
      "I would like to book a hotel room for two nights.",
      "What time does the train depart?",
      "Could you please help me with directions?",
      "How much does this cost?",
      "I need to see a doctor as soon as possible.",
      "What is the weather forecast for tomorrow?",
      "Can you recommend a good local dish?",
      "Where can I find an ATM nearby?"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSourceText(randomSuggestion);
  };

  return (
    <TranslationContainer>
      <Section>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Language Translator</Title>
          <Subtitle>Translate text, documents, and access your translation history all in one place with our powerful AI translation engine</Subtitle>
        </Header>

        <MainContent>
          <TextAreaContainer $rounded style={{ height: expanded ? '450px' : '350px' }}>
            <TextAreaHeader>
              <LanguageSelector>
                <LanguageFlag>🌐</LanguageFlag>
                <LanguageSelect value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="zh-cn">Chinese</option>
                  <option value="ru">Russian</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                  <option value="ur">Urdu</option>
                  <option value="pt">Portuguese</option>
                  <option value="tr">Turkish</option>
                  <option value="ko">Korean</option>
                </LanguageSelect>
              </LanguageSelector>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <IconButton 
                  onClick={startListening} 
                  style={{ background: isListening ? 'rgba(161, 196, 253, 0.3)' : '' }}
                >
                  <FaMicrophone /> {isListening ? 'Listening...' : 'Speak'}
                </IconButton>
                <ClearButton onClick={handleClear}>
                  <FaTrash /> Clear
                </ClearButton>
                <ExpandButton onClick={toggleExpand}>
                  {expanded ? <FaCompress /> : <FaExpand />}
                </ExpandButton>
              </div>
            </TextAreaHeader>
            <TextArea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate or upload a document below"
            />
            <CharacterCounter count={charCount} max={5000}>
              {charCount}/5000 characters
            </CharacterCounter>
            <ActionButtons>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                />
                <label htmlFor="file-upload">
                  <IconButton as="span">
                    <FaUpload /> {fileName || 'Upload Document'}
                  </IconButton>
                </label>
                <IconButton onClick={handleSuggestion}>
                  <FaLightbulb /> Suggest
                </IconButton>
              </div>
              <IconButton 
                variant="primary" 
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
              >
                {isLoading ? <LoadingSpinner /> : null}
                Translate <FaArrowRight />
              </IconButton>
            </ActionButtons>
          </TextAreaContainer>

          <TextAreaContainer $rounded style={{ height: expanded ? '450px' : '350px' }}>
            <TextAreaHeader>
              <LanguageSelector>
                <LanguageFlag>🇪🇸</LanguageFlag>
                <LanguageSelect value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                  <option value="es">Spanish</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="zh-cn">Chinese</option>
                  <option value="ru">Russian</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                  <option value="ur">Urdu</option>
                  <option value="pt">Portuguese</option>
                  <option value="tr">Turkish</option>
                  <option value="ko">Korean</option>
                </LanguageSelect>
              </LanguageSelector>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <IconButton onClick={handleSwapLanguages}>
                  <FaSync /> Swap
                </IconButton>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <IconButton onClick={handleCopy}>
                    <FaCopy />
                  </IconButton>
                  <IconButton onClick={handleDownloadTxt}>
                    <FaDownload />
                  </IconButton>
                  <IconButton onClick={handleDownloadPdf}>
                    <FaDownload /> PDF
                  </IconButton>
                </div>
                <ExpandButton onClick={toggleExpand}>
                  {expanded ? <FaCompress /> : <FaExpand />}
                </ExpandButton>
              </div>
            </TextAreaHeader>
            <TextArea
              value={translatedText}
              readOnly
              style={{ color: translatedText === 'Translation will appear here…' ? 'rgba(255, 255, 255, 0.6)' : '#ffffff' }}
            />
            <ActionButtons>
              <IconButton 
                onClick={speakText}
                style={{ background: isSpeaking ? 'rgba(161, 196, 253, 0.3)' : '' }}
              >
                <FaVolumeUp /> {isSpeaking ? 'Speaking...' : 'Listen'}
              </IconButton>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                  Progress — Translations: {history.length} | Favorites: {favorites.length}
                </span>
              </div>
            </ActionButtons>
          </TextAreaContainer>
        </MainContent>

        <FeaturesSection>
          <FeatureCard $rounded onClick={() => document.getElementById('file-upload').click()}>
            <FeatureIcon>
              <FaUpload />
            </FeatureIcon>
            <FeatureTitle>Document Translation</FeatureTitle>
            <FeatureDescription>Translate PDF, DOCX, TXT, and image files with OCR technology</FeatureDescription>
          </FeatureCard>

          <FeatureCard $rounded onClick={speakText}>
            <FeatureIcon>
              <FaVolumeUp />
            </FeatureIcon>
            <FeatureTitle>Text-to-Speech</FeatureTitle>
            <FeatureDescription>Listen to your translations in natural sounding voices</FeatureDescription>
          </FeatureCard>

          <FeatureCard $rounded onClick={() => window.open('https://translate.google.com', '_blank')}>
            <FeatureIcon>
              <FaGlobe />
            </FeatureIcon>
            <FeatureTitle>Multi-Engine</FeatureTitle>
            <FeatureDescription>Compare translations with Google Translate for accuracy</FeatureDescription>
          </FeatureCard>

          <FeatureCard $rounded onClick={handleSuggestion}>
            <FeatureIcon>
              <FaLightbulb />
            </FeatureIcon>
            <FeatureTitle>Smart Suggestions</FeatureTitle>
            <FeatureDescription>Get example phrases to practice common translations</FeatureDescription>
          </FeatureCard>
        </FeaturesSection>

        <HistorySection $rounded>
          <SectionHeader>
            <SectionTitle><FaHistory /> Translation History</SectionTitle>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <IconButton>
                <FaShare /> Share
              </IconButton>
              <IconButton>
                <FaSync /> Refresh
              </IconButton>
            </div>
          </SectionHeader>
          {history.length > 0 ? (
            <HistoryList>
              {history.map(item => (
                <HistoryItem key={item.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <HistoryText><strong>Source:</strong> {item.source.slice(0, 70)}{item.source.length > 70 ? '...' : ''}</HistoryText>
                      <HistoryText><strong>Translation:</strong> {item.translation.slice(0, 70)}{item.translation.length > 70 ? '...' : ''}</HistoryText>
                      <HistoryTimestamp>{item.timestamp}</HistoryTimestamp>
                    </div>
                    <FavoriteButton 
                      favorited={item.favorited} 
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <FaStar />
                    </FavoriteButton>
                  </div>
                </HistoryItem>
              ))}
            </HistoryList>
          ) : (
            <HistoryText style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>No translations yet. Translate something to see it here!</HistoryText>
          )}
        </HistorySection>

        <SettingsSection $rounded>
          <SectionHeader>
            <SectionTitle><FaCog /> Settings</SectionTitle>
          </SectionHeader>

          <SettingGroup>
            <SettingLabel>Default Target Language</SettingLabel>
            <SettingSelect value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
              <option value="es">🇪🇸 Spanish</option>
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
              <option value="it">🇮🇹 Italian</option>
              <option value="ja">🇯🇵 Japanese</option>
              <option value="zh-cn">🇨🇳 Chinese</option>
              <option value="ru">🇷🇺 Russian</option>
              <option value="ar">🇸🇦 Arabic</option>
              <option value="hi">🇮🇳 Hindi</option>
              <option value="ur">🇵🇰 Urdu</option>
              <option value="pt">🇵🇹 Portuguese</option>
              <option value="tr">🇹🇷 Turkish</option>
              <option value="ko">🇰🇷 Korean</option>
            </SettingSelect>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Translation Style</SettingLabel>
            <SettingSelect value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="default">Default</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </SettingSelect>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Translation Domain</SettingLabel>
            <SettingSelect value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="general">General</option>
              <option value="business">Business</option>
              <option value="academic">Academic</option>
              <option value="technical">Technical</option>
              <option value="medical">Medical</option>
              <option value="legal">Legal</option>
            </SettingSelect>
          </SettingGroup>

          <SettingRow>
            <ToggleButton onClick={() => setDarkMode(!darkMode)}>
              <FaMoon /> {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </ToggleButton>
            <ResetButton onClick={handleReset}>
              <FaTrash /> Reset App
            </ResetButton>
          </SettingRow>

          <TipText>
            Tip: For best speech recognition, use Chrome. Document translation works best with clean, well-formatted files.
            You can now favorite translations for quick access later!
          </TipText>
        </SettingsSection>
      </Section>
    </TranslationContainer>
  );
};

export default LanguageTranslator;