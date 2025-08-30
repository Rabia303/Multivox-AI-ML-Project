// src/components/ui/URLInput.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';

export const URLInputContainer = styled(GlassPanel)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const PasteButton = styled(motion.button).attrs({
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
})`
  background: #7C7C77;
  color: #DCDDE1;
  border: none;
  padding: 0 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: #ACAEB1;
  }
`;