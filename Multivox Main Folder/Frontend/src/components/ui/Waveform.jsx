// src/components/ui/Waveform.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WaveformContainer = styled.div`
  width: 100%;
  height: 100px;
  background: rgba(12, 22, 23, 0.5);
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
`;

const WaveformBars = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 2px;
`;

const WaveformBar = styled(motion.div)`
  background: ${({ theme }) => theme.colors.goldAccent};
  width: 3px;
  border-radius: 2px;
`;

export default function Waveform() {
  // Generate random heights for the waveform bars
  const bars = Array.from({ length: 100 }, () => Math.random() * 80 + 20);

  return (
    <WaveformContainer>
      <WaveformBars>
        {bars.map((height, index) => (
          <WaveformBar 
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.005,
              type: 'spring',
              damping: 10
            }}
          />
        ))}
      </WaveformBars>
    </WaveformContainer>
  );
}