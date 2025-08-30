// src/styles/theme.js
const theme = {
  colors: {
    primary: '#454641',       // Graphite
    secondary: '#0E1617',     // Leather
    accentMist: '#DCDDE1',
    accentPaloSanto: '#7C7C77',
    accentSmoke: '#ACAEB1',
  },
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  effects: {
    glass: 'rgba(69, 70, 65, 0.2)',
    blur: 'blur(10px)',
    border: '1px solid #ACAEB1',
  },
  transitions: {
    default: 'all 0.3s ease-in-out',
    hover: 'all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)',
  },
  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.18)',
    elevation: '0 4px 20px rgba(0, 0, 0, 0.25)',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

// Export as both named and default exports
export { theme };
export default theme;