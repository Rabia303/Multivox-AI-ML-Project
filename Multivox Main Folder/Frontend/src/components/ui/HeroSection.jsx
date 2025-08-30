// src/components/ui/HeroSection.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const HeroContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0b0e 0%, #1a1d24 100%);
`;

export const VideoBackground = styled(motion.video)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.4;
  mix-blend-mode: screen;

  /* Fallback for browsers that don't support mix-blend-mode */
  @supports not (mix-blend-mode: screen) {
    opacity: 0.2;
    filter: brightness(1.5);
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 11, 14, 0.6);
  z-index: 1;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const HeroTitle = styled(motion.h1).attrs({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
})`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff 0%, #a1c4fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled(motion.p).attrs({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.2 },
})`
  font-size: 1.25rem;
  max-width: 700px;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;