// src/components/ui/GlassPanel.jsx
import styled from 'styled-components';

export const GlassPanel = styled.div`
  background: ${({ theme }) => theme.effects.glass};
  backdrop-filter: ${({ theme }) => theme.effects.blur};
  border: ${({ theme }) => theme.effects.border};
  border-radius: 12px;
  padding: ${({ padding }) => padding || '2rem'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-color: ${({ theme }) => theme.colors.mist};
  }
`;

export const GlassButton = styled.button`
  background: rgba(69, 70, 65, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid #ACAEB1;
  color: #DCDDE1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(69, 70, 65, 0.6);
    border-color: ${({ theme }) => theme.colors.goldAccent};
    color: ${({ theme }) => theme.colors.goldAccent};
  }
`;