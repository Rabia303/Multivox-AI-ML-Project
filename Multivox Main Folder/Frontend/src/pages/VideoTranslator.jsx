import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// GlassPanel component (since it was imported but not defined)
const GlassPanel = styled.div`
  background: ${props => props.background || 'rgba(26, 29, 36, 0.5)'};
  border-radius: ${props => props.$rounded ? '16px' : '0'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.padding || '2rem'};
  transition: all 0.3s ease;
`;

// PrimaryButton component (since it was imported but not defined)
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
const TranslationContainer = styled.div`
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

const SampleVideoLabel = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  z-index: 2;
`;

const VideoPlayer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(161, 196, 253, 0.1) 0%, rgba(194, 233, 251, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
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

// Slider styles
const SliderControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
`;

const SliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
    cursor: pointer;
  }
`;

// Action button matching home page style
const ActionButton = styled(PrimaryButton)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  border-radius: 12px;
  margin: 2rem auto;
  display: block;
`;

const TranslationPage = () => {
  const [voiceStyle, setVoiceStyle] = useState('default');
  const [subtitleStyle, setSubtitleStyle] = useState('standard');
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceEmotion, setVoiceEmotion] = useState('neutral');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTranslation = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <TranslationContainer>
      <Section>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Video Translator</Title>
          <Subtitle>Transform your video with AI-powered translation while preserving the natural voice and emotion</Subtitle>
        </Header>

        <VideoPreviewSection>
          <VideoPreview $rounded>
            <SampleVideoLabel>Sample Video: "Introduction to AI"</SampleVideoLabel>
            <VideoPlayer>
              Video Preview Will Appear Here
            </VideoPlayer>
          </VideoPreview>

          <LanguageSelectorContainer>
            <LanguagePill>English</LanguagePill>
            <ArrowIcon />
            <LanguagePill>Spanish</LanguagePill>
          </LanguageSelectorContainer>
        </VideoPreviewSection>

        <ControlsSection>
          <ControlGroup $rounded>
            <div>
              <ControlTitle>Voice Style</ControlTitle>
              <SelectControl 
                value={voiceStyle} 
                onChange={(e) => setVoiceStyle(e.target.value)}
              >
                <option value="default">Default Voice</option>
                <option value="male">Male Voice</option>
                <option value="female">Female Voice</option>
                <option value="professional">Professional Tone</option>
              </SelectControl>
            </div>

            <div>
              <ControlTitle>Subtitle Style</ControlTitle>
              <SelectControl 
                value={subtitleStyle} 
                onChange={(e) => setSubtitleStyle(e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="minimal">Minimal</option>
                <option value="bold">Bold</option>
                <option value="elegant">Elegant</option>
              </SelectControl>
            </div>
          </ControlGroup>

          <ControlGroup $rounded>
            <div>
              <ControlTitle>Advanced Options</ControlTitle>
              
              <SliderControl>
                <SliderLabel>
                  <span>Speech Rate</span>
                  <span>{speechRate}x</span>
                </SliderLabel>
                <SliderInput
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                />
              </SliderControl>

              <div>
                <ControlTitle>Voice Emotion</ControlTitle>
                <SelectControl 
                  value={voiceEmotion} 
                  onChange={(e) => setVoiceEmotion(e.target.value)}
                >
                  <option value="neutral">Neutral</option>
                  <option value="happy">Happy</option>
                  <option value="serious">Serious</option>
                  <option value="energetic">Energetic</option>
                </SelectControl>
              </div>
            </div>
          </ControlGroup>
        </ControlsSection>

        <ActionButton 
          onClick={handleStartTranslation}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Video...' : 'Start Translation'}
        </ActionButton>
      </Section>
    </TranslationContainer>
  );
};

export default TranslationPage;