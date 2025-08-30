// src/components/common/Button.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ButtonBase = styled(motion.button)`
  padding: ${({ $size }) => 
    $size === 'sm' ? '0.5rem 1rem' : 
    $size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  border-radius: 8px;
  font-weight: 500;
  font-size: ${({ $size }) => $size === 'sm' ? '0.875rem' : '1rem'};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover:not(:disabled)::after {
    transform: translateX(100%);
  }
`;

export const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  color: #0a0b0e;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 70%);
    box-shadow: 0 5px 15px rgba(161, 196, 253, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(ButtonBase)`
  background: transparent;
  color: #a1c4fd;
  border: 1px solid rgba(161, 196, 253, 0.5);
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background: rgba(161, 196, 253, 0.1);
    border-color: rgba(161, 196, 253, 0.8);
  }
`;

export const IconButton = styled(ButtonBase)`
  padding: 0.5rem;
  border-radius: 50%;
  width: ${({ $size }) => $size === 'sm' ? '32px' : '40px'};
  height: ${({ $size }) => $size === 'sm' ? '32px' : '40px'};
  background: rgba(161, 196, 253, 0.2);
  color: #a1c4fd;
  border: 1px solid rgba(161, 196, 253, 0.3);

  &:hover:not(:disabled) {
    background: rgba(161, 196, 253, 0.4);
    color: #ffffff;
    border-color: rgba(161, 196, 253, 0.8);
  }
`;