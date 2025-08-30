// src/components/common/Input.jsx
import styled from 'styled-components';

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.accentSmoke};
  font-size: 0.875rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(12, 18, 23, 0.5);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.accentMist};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accentPaloSanto};
    box-shadow: 0 0 0 2px rgba(124, 124, 119, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.accentSmoke};
    opacity: 0.7;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  background: rgba(12, 18, 23, 0.5);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.accentMist};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transitions.default};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accentPaloSanto};
    box-shadow: 0 0 0 2px rgba(124, 124, 119, 0.3);
  }
`;