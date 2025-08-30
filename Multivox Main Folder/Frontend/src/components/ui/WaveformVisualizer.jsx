// src/components/ui/WaveformVisualizer.jsx
import React from 'react';
import styled from 'styled-components';

const WaveformContainer = styled.div`
  width: 100%;
  height: 60px;
  background: rgba(12, 18, 23, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

const WaveformBar = styled.div`
  height: ${({ height }) => height}px;
  width: 3px;
  background: ${({ theme }) => theme.colors.accentPaloSanto};
  margin-right: 2px;
  border-radius: 2px;
`;

const generateRandomHeights = () => {
  const bars = [];
  for (let i = 0; i < 100; i++) {
    bars.push(Math.random() * 40 + 10);
  }
  return bars;
};

const WaveformVisualizer = () => {
  const bars = generateRandomHeights();

  return (
    <WaveformContainer>
      {bars.map((height, index) => (
        <WaveformBar key={index} height={height} />
      ))}
    </WaveformContainer>
  );
};

export default WaveformVisualizer;