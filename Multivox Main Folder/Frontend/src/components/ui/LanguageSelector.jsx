import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectorButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: rgba(26, 29, 36, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 1rem;

  &:hover {
    border-color: rgba(161, 196, 253, 0.4);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const LanguageList = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: rgba(26, 29, 36, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const LanguageItem = styled(motion.div)`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(161, 196, 253, 0.2);
    color: white;
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const GlobeContainer = styled(motion.div)`
  width: 100%;
  height: 200px;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(14, 22, 23, 0.8);
  display: grid;
  place-items: center;
  color: #ACAEB1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(26, 29, 36, 0.8);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-bottom-color: rgba(161, 196, 253, 0.8);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const LanguageSelector = ({ languages, onSelect, defaultLanguage = 'en', compact = false }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === defaultLanguage) || languages[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    onSelect(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SelectorContainer>
      <SelectorButton
        onClick={() => setIsOpen(!isOpen)}
        style={compact ? { padding: '0.75rem' } : {}}
      >
        <span>
          {selectedLanguage ? `${selectedLanguage.name} (${selectedLanguage.nativeName})` : 'Select Language'}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginLeft: '8px' }}
        >
          ▼
        </motion.span>
      </SelectorButton>

      <AnimatePresence>
        {isOpen && (
          <LanguageList
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!compact && (
              <>
                <GlobeContainer>
                  Globe Visualization
                </GlobeContainer>
                <SearchInput
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </>
            )}
            
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <LanguageItem 
                  key={language.code} 
                  onClick={() => handleSelect(language)}
                  whileHover={{ backgroundColor: 'rgba(161, 196, 253, 0.2)' }}
                >
                  {language.flag && (
                    <img 
                      src={language.flag} 
                      alt={`${language.name} flag`} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div>{language.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {language.nativeName}
                    </div>
                  </div>
                </LanguageItem>
              ))
            ) : (
              <LanguageItem style={{ justifyContent: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                No languages found
              </LanguageItem>
            )}
          </LanguageList>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};

export { LanguageSelector };