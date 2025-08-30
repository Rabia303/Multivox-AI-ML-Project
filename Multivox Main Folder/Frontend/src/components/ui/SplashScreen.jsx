// src/components/ui/SplashScreen.jsx
import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png'; 

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled components
const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('https://i.pinimg.com/736x/ed/48/11/ed4811f4cacc5b4a46750e6b9862143e.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.03) 100%
    );
    animation: ${shimmerAnimation} 8s linear infinite;
    pointer-events: none;
  }
`;

const LogoContainer = styled(motion.div)`
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
  position: relative;
  z-index: 2;
`;

const AppLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 12px;
`;

const Dot = styled.div.attrs(props => ({
  style: {
    animationDelay: props.$delay || '0s',
  }
}))`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: linear-gradient(45deg,rgb(65, 68, 69),rgb(54, 54, 54));
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
  box-shadow: 0 0 15px ${props => props.$color || 'rgba(53, 53, 53, 0.7)'};
`;

const LoadingText = styled(motion.p)`
  color: white;
  font-size: 1.3rem;
  margin-top: 1.5rem;
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-weight: 300;
  letter-spacing: 1px;
`;

const Particle = styled.div.attrs(props => {
  const floatAnim = css`
    0% { transform: translate(0, 0); }
    50% { transform: translate(${props.$translateX}px, ${props.$translateY}px); }
    100% { transform: translate(0, 0); }
  `;
  
  return {
    style: {
      width: `${props.$size}px`,
      height: `${props.$size}px`,
      left: `${props.$posX}%`,
      top: `${props.$posY}%`,
      animationDelay: `${props.$delay}s`,
      opacity: props.$opacity,
      animationDuration: `${props.$duration}s`,
      animationName: floatAnim,
    }
  }
})`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Create particles
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 10 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.3 + 0.1;
    const translateX = Math.random() * 100 - 50;
    const translateY = Math.random() * 100 - 50;

    return (
      <Particle
        key={i}
        $size={size}
        $posX={posX}
        $posY={posY}
        $delay={delay}
        $opacity={opacity}
        $duration={duration}
        $translateX={translateX}
        $translateY={translateY}
      />
    );
  });

  return (
    <SplashContainer>
      {particles}
      
      <LogoContainer
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.175, 0.885, 0.32, 1.275],
          delay: 0.2
        }}
      >
    <AppLogo src={logo} alt="App Logo" />
      </LogoContainer>

      <LoadingContainer>
        <LoadingDots>
          <Dot $delay="0s" $color="rgba(58, 60, 61, 0.7)" />
          <Dot $delay="0.2s" $color="rgba(58, 60, 61, 0.7)" />
          <Dot $delay="0.4s" $color="rgba(58, 60, 61, 0.7)" />
        </LoadingDots>
        <LoadingText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Preparing your experience...
        </LoadingText>
      </LoadingContainer>
    </SplashContainer>
  );
};

export default SplashScreen;