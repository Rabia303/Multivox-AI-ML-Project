import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { 
  NavContainer, 
  Logo, 
  NavLinks, 
  NavLink, 
  AuthButtons,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink
} from './Navbar';
import {
  FooterContainer,
  FooterGrid,
  FooterColumn,
  SocialLinks,
  Copyright
} from './Footer';
import { PrimaryButton } from '../common/Button';
import logo from '../../assets/images/logo.png'; // Make sure to add your logo.png file in assets folder

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <NavContainer>
        <Logo as={Link} to="/">
          <img src={logo} alt="MultiVox Logo" style={{ height: '30px', marginRight: '10px' }} />
          Multi<span>Vox</span>
        </Logo>

        <NavLinks>
          <NavLink>
            <Link to="/">Home</Link>
          </NavLink>
          {/* <NavLink>
            <Link to="/VideoTranslator">Video Dubbing</Link>
          </NavLink> */}
            <NavLink>
            <Link to="/dub">Movie Dub</Link>
          </NavLink>
          <NavLink>
            <Link to="/voicetranslation">Voice Translation</Link>
          </NavLink>
            <NavLink>
            <Link to="/LanguageTranslator">Language Translator</Link>
          </NavLink>
             <NavLink>
            <Link to="/Sub">Subtitle Generator</Link>
          </NavLink>
        </NavLinks>

        <AuthButtons>
          <PrimaryButton small as={Link} to="/login">Login</PrimaryButton>
          <PrimaryButton small outline as={Link} to="/register">Sign Up</PrimaryButton>
        </AuthButtons>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu>
          <MobileNavLink as={Link} to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink as={Link} to="/translation" onClick={() => setMobileMenuOpen(false)}>Translate</MobileNavLink>
          <MobileNavLink as={Link} to="/dashboard/voicetranslation" onClick={() => setMobileMenuOpen(false)}>Voice Translation</MobileNavLink>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            
          </div>
        </MobileMenu>
      )}

      {/* Page Content */}
      <main style={{ marginTop: '80px', minHeight: 'calc(100vh - 160px)' }}>
        {children}
      </main>

      {/* Footer */}
      <FooterContainer>
        <FooterGrid>
          <FooterColumn>
            <h3>MultiVox</h3>
            <p>Breaking language barriers with AI-powered voice translation technology.</p>
            <SocialLinks>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </SocialLinks>
          </FooterColumn>
          <FooterColumn>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/translation">Translate</Link></li>
              <li><Link to="/dashboard/voicetranslation">Voice Translation</Link></li>
              <li><Link to="/dashboard/gamification">Gamification</Link></li>
              <li><Link to="/dashboard/profile">Profile</Link></li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </FooterColumn>
        </FooterGrid>
        <Copyright>
          &copy; {new Date().getFullYear()} MultiVox. All rights reserved.
        </Copyright>
      </FooterContainer>
    </>
  );
};

export default Layout;