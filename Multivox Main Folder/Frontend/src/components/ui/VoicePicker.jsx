// src/components/ui/VoicePicker.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';

const VoicePickerContainer = styled(GlassPanel)`
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const VoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const VoiceOption = styled(motion.div).attrs({
  whileHover: { scale: 1.05 },
})`
  padding: 1rem;
  border: 1px solid ${({ $selected }) => $selected ? '#DCDDE1' : '#7C7C77'};
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background: ${({ $selected }) => $selected ? 'rgba(220, 221, 225, 0.1)' : 'transparent'};
`;

const VoicePicker = ({ voices, onSelect }) => {
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  
  const handleSelect = (voice) => {
    setSelectedVoice(voice);
    onSelect(voice);
  };

  return (
    <VoicePickerContainer>
      <h4>Select Voice</h4>
      <VoiceGrid>
        {voices.map((voice) => (
          <VoiceOption
            key={voice}
            $selected={voice === selectedVoice}
            onClick={() => handleSelect(voice)}
          >
            {voice}
          </VoiceOption>
        ))}
      </VoiceGrid>
    </VoicePickerContainer>
  );
};

export default VoicePicker;