// src/components/common/Loader.jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  display: inline-block;
  width: ${({ size }) => size || '24px'};
  height: ${({ size }) => size || '24px'};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.accentPaloSanto};
  animation: ${spin} 1s ease-in-out infinite;
`;

export const SkeletonLoader = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 25%,
    ${({ theme }) => theme.colors.accentSmoke} 50%,
    ${({ theme }) => theme.colors.primary} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accentPaloSanto};
  border-radius: 3px;
  width: ${({ progress }) => progress || '0%'};
  transition: width 0.4s ease;
`;