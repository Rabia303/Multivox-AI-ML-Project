// src/components/common/ProgressBar.jsx
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.leather};
  border-radius: 8px;
  overflow: hidden;
  height: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.goldAccent}, #F4D03F);
  border-radius: 8px;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease;
`;

export default function ProgressBar({ percentage }) {
  return (
    <ProgressContainer>
      <ProgressFill percentage={percentage} />
    </ProgressContainer>
  );
}