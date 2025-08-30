// src/hooks/useTranslation.jsx
import { useState, useEffect } from 'react';

export const useTranslation = () => {
  const [translationState, setTranslationState] = useState({
    originalText: '',
    translatedText: '',
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    voiceSettings: {
      pitch: 0,
      speed: 1.0,
      emotion: 'neutral',
      voiceModel: 'default',
    },
    subtitles: {
      enabled: true,
      position: 'bottom',
      font: 'Inter',
      color: '#DCDDE1',
      size: 'medium',
    },
    progress: 0,
    status: 'idle', // 'idle' | 'processing' | 'completed' | 'error'
  });

  const translateText = async (text, sourceLang, targetLang) => {
    setTranslationState(prev => ({
      ...prev,
      status: 'processing',
      progress: 0,
    }));

    // Simulate translation progress
    const interval = setInterval(() => {
      setTranslationState(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            progress: 100,
            status: 'completed',
            translatedText: `This is a simulated translation of: "${text}" from ${sourceLang} to ${targetLang}`,
          };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const updateVoiceSettings = (settings) => {
    setTranslationState(prev => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        ...settings,
      },
    }));
  };

  const updateSubtitleSettings = (settings) => {
    setTranslationState(prev => ({
      ...prev,
      subtitles: {
        ...prev.subtitles,
        ...settings,
      },
    }));
  };

  const resetTranslation = () => {
    setTranslationState(prev => ({
      ...prev,
      originalText: '',
      translatedText: '',
      progress: 0,
      status: 'idle',
    }));
  };

  return {
    translationState,
    translateText,
    updateVoiceSettings,
    updateSubtitleSettings,
    resetTranslation,
    setOriginalText: (text) => setTranslationState(prev => ({
      ...prev,
      originalText: text,
    })),
    setSourceLanguage: (lang) => setTranslationState(prev => ({
      ...prev,
      sourceLanguage: lang,
    })),
    setTargetLanguage: (lang) => setTranslationState(prev => ({
      ...prev,
      targetLanguage: lang,
    })),
  };
};