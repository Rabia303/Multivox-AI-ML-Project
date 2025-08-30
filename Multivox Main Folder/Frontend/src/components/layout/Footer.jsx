import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.primary};
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.accentMist};
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FooterColumn = styled.div`
  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${({ theme }) => theme.colors.accentPaloSanto};
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: ${({ theme }) => theme.colors.accentSmoke};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.accentMist};
      padding-left: 0.5rem;
    }
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.accentMist};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      background: ${({ theme }) => theme.colors.accentPaloSanto};
      transform: translateY(-3px);
    }
  }
`;

export const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.accentSmoke}20;
  color: ${({ theme }) => theme.colors.accentSmoke};
  font-size: 0.875rem;
`;

// Export Link component to be used in Footer
export { Link };