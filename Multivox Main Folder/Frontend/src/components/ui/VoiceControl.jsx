// src/components/ui/VoiceControl.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';

const VoiceControlContainer = styled.div`
  margin-bottom: 2rem;
`;

const ControlGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ControlLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.mist};
  font-weight: 500;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SliderInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 6px;
  background: ${({ theme }) => theme.colors.leather};
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: ${({ theme }) => theme.colors.goldAccent};
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  min-width: 30px;
  text-align: center;
  color: ${({ theme }) => theme.colors.mist};
`;

const ToggleContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${({ theme }) => theme.colors.leather};
  border-radius: 12px;
  padding: 2px;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.smoke};
    transition: all 0.3s ease;
    left: 2px;
  }

  input:checked + & {
    background: ${({ theme }) => theme.colors.goldAccent};

    &::after {
      transform: translateX(26px);
      background: white;
    }
  }
`;

const ToggleInput = styled.input`
  display: none;
`;

const ToggleLabel = styled.span`
  margin-left: 0.75rem;
  color: ${({ theme }) => theme.colors.mist};
`;

export default function VoiceControl() {
  return (
    <VoiceControlContainer>
      <ControlGroup>
        <ControlLabel>Voice Settings</ControlLabel>
        
        <ControlGroup>
          <ControlLabel>Pitch Adjustment</ControlLabel>
          <SliderContainer>
            <SliderInput 
              type="range" 
              min="-5" 
              max="5" 
              step="1" 
              defaultValue="0" 
            />
            <SliderValue>0</SliderValue>
          </SliderContainer>
        </ControlGroup>
        
        <ControlGroup>
          <ControlLabel>Speaking Rate</ControlLabel>
          <SliderContainer>
            <SliderInput 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.1" 
              defaultValue="1.0" 
            />
            <SliderValue>1.0x</SliderValue>
          </SliderContainer>
        </ControlGroup>
      </ControlGroup>
      
      <ControlGroup>
        <ToggleContainer>
          <ToggleInput type="checkbox" />
          <ToggleSwitch />
          <ToggleLabel>Preserve Emotion</ToggleLabel>
        </ToggleContainer>
      </ControlGroup>
    </VoiceControlContainer>
  );
}