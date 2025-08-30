import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../common/Button';

export const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(10, 15, 20, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled(motion.div)`
  font-family: 'Inter', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentMist};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.5px;

  span {
    color: ${({ theme }) => theme.colors.accentPaloSanto};
    font-weight: 800;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled(motion.li)`
  position: relative;
  padding: 0.5rem 0;

  a {
    color: ${({ theme }) => theme.colors.accentSmoke};
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    position: relative;
    padding: 0.5rem 0;

    &:hover {
      color: ${({ theme }) => theme.colors.accentMist};
    }

    &.active {
      color: ${({ theme }) => theme.colors.accentMist};
      font-weight: 600;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.accentPaloSanto};
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after,
  &.active::after {
    width: 100%;
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accentMist};
  font-size: 1.6rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.secondary};
  padding: 1rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

export const MobileNavLink = styled(motion.a)`
  color: ${({ theme }) => theme.colors.accentSmoke};
  padding: 0.8rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    color: ${({ theme }) => theme.colors.accentMist};
    padding-left: 0.8rem;
  }

  &.active {
    color: ${({ theme }) => theme.colors.accentPaloSanto};
    font-weight: 600;
  }

  &::before {
    content: '→';
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

// Additional styled components for better organization
export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;

export const NavButton = styled(PrimaryButton)`
  padding: 0.6rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
`;