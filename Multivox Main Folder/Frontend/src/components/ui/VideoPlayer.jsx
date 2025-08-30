// src/components/ui/VideoPlayer.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PlayerContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
`;

export const VideoElement = styled.video`
  width: 100%;
  display: block;
`;

export const ControlsContainer = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(14, 22, 23, 0.9), transparent);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  cursor: pointer;
`;

export const Progress = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accentPaloSanto};
  border-radius: 2px;
  width: ${({ progress }) => progress || '0%'};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.accentMist};
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accentMist};
  font-size: 1.25rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.accentPaloSanto};
    transform: scale(1.1);
  }
`;

export const TimeDisplay = styled.span`
  color: ${({ theme }) => theme.colors.accentMist};
  font-size: 0.875rem;
`;

export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100px;
`;

export const VolumeSlider = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.accentMist};
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const FullscreenButton = styled(ControlButton)`
  font-size: 1rem;
`;