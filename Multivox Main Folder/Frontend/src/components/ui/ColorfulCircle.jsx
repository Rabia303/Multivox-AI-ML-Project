// src/components/ui/ColorfulCircle.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { PrimaryButton } from '../common/Button';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircleWrapper = styled.div`
  margin: 0 auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ffffff 0deg,
    #f4b4b4 60deg,
    #88dba3 120deg,
    #ffffff 180deg,
    #f4b4b4 240deg,
    #88dba3 300deg,
    #ffffff 360deg
  );
  animation: ${spin} 8s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  background: white;
  padding: 10px 16px;
  border-radius: 50px;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
`;

const ColorfulCircle = () => {
  return (
    <CircleWrapper>
      <ButtonWrapper>
        <PrimaryButton small>🎙️ TRY A CALL</PrimaryButton>
      </ButtonWrapper>
    </CircleWrapper>
  );
};

export default ColorfulCircle;
