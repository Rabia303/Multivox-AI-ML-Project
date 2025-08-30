import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import SplashScreen from './components/ui/SplashScreen';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import theme from './styles/theme.js';
import './styles/globals.css';
import './styles/animation.css';
import VoiceTranslationPage from './pages/VoiceTranslationPage.jsx';
import VideoTranslator from './pages/VideoTranslator';
import SubtitleGenerator from './pages/SubtitleGenerator.jsx';
import LanguageTranslator from './pages/LanguageTranslator.jsx';
import VideoDub from './pages/VideoDub.jsx';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/VideoTranslator" element={<Layout><VideoTranslator /></Layout>} />
              <Route path="/sub" element={<Layout><SubtitleGenerator /></Layout>} />
              <Route path="/languageTranslator" element={<Layout><LanguageTranslator /></Layout>} />
              <Route path="/voicetranslation" element={<Layout><VoiceTranslationPage /></Layout>} />
              <Route path="/dub" element={<Layout><VideoDub /></Layout>} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;