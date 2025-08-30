import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGlobe, FaMicrophone, FaClosedCaptioning, FaFileDownload, FaLanguage } from 'react-icons/fa';
import { PrimaryButton } from '../components/common/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { HeroContainer, VideoBackground, HeroOverlay, HeroContent } from '../components/ui/HeroSection';

// Data
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

const characters = [
  {
    id: 1,
    image: 'https://example.com/character1.png',
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 }
  }
];

const testimonials = [
  {
    id: 1,
    content: "This tool saved me hours of manual translation work. The voice quality is incredible!",
    initials: "SC",
    name: "Sarah Chen",
    title: "Content Creator"
  },
  {
    id: 2,
    content: "Our global campaigns are now possible thanks to Real Voice Translator. Game changer!",
    initials: "MJ",
    name: "Marcus Johnson",
    title: "Marketing Director"
  },
  {
    id: 3,
    content: "The AI voices sound so natural. My international audience loves the translations.",
    initials: "ER",
    name: "Elena Rodriguez",
    title: "YouTuber"
  }
];

const stats = [
  { id: 1, number: "10M+", label: "Videos Translated" },
  { id: 2, number: "50+", label: "Languages Supported" },
  { id: 3, number: "500K+", label: "Happy Users" },
  { id: 4, number: "99.9%", label: "Accuracy Rate" }
];

const features = [
  {
    id: 1,
    title: "Perfect Translations",
    description: "Advanced AI technology that understands context, emotion, and cultural nuances",
    icon: <FaGlobe size={32} />
  },
  {
    id: 2,
    title: "AI Voice Cloning",
    description: "Realistic voiceovers with emotion and personality",
    icon: <FaMicrophone size={32} />
  },
  {
    id: 3,
    title: "Smart Subtitles",
    description: "Auto-generated subtitles with custom styling",
    icon: <FaClosedCaptioning size={32} />
  },
  {
    id: 4,
    title: "Multiple Formats",
    description: "Download as video, audio, or subtitle files",
    icon: <FaFileDownload size={32} />
  },
  {
    id: 5,
    title: "50+ Languages",
    description: "Support for major world languages",
    icon: <FaLanguage size={32} />
  }
];

// Styles
const PageContainer = styled.div`
  position: relative;
  width: 100%;
  color: #ffffff;
  background: #0a0b0e;
  overflow-x: hidden;
`;

const floatAnimation = css`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  animation: float 4s ease-in-out infinite;
`;

const FloatingCharacters = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Character = styled(motion.div)`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(0 0 10px rgba(161, 196, 253, 0.5));
  opacity: 0.8;
  ${floatAnimation}
`;

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const StyledGlassPanel = styled(GlassPanel)`
  backdrop-filter: blur(5px);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  background: rgba(26, 29, 36, 0.5);
  width: 100%;
`;

const FormTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
  font-size: 1.8rem;
`;

const FormDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 1.1rem;
  outline: none;
  padding: 1.2rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  min-width: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    border-color: rgba(161, 196, 253, 0.9);
    box-shadow: 0 0 0 3px rgba(161, 196, 253, 0.4);
  }
`;

const TranslateButton = styled(PrimaryButton)`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  border: none;
  white-space: nowrap;
  padding: 1rem 3rem;
  font-weight: 500;
  font-size: 1.2rem;
  height: 56px;
  min-width: 200px;
  border-radius: 12px;
  
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(161, 196, 253, 0.4);
  }
`;

const LanguageSelectorContainer = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
`;

// Features Section Styles
const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #1a1d24 0%, #0a0b0e 100%);
  position: relative;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  margin: 0 auto 6rem auto;
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
    border-radius: 3px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(26, 29, 36, 0.7);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(161, 196, 253, 0.5);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem auto;
  background: linear-gradient(135deg, rgba(161, 196, 253, 0.2) 0%, rgba(194, 233, 251, 0.2) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1c4fd;
`;

const FeatureTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1.1rem;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #0a0b0e 0%, #1a1d24 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://example.com/background-pattern.gif') center/cover;
    opacity: 0.05;
    pointer-events: none;
  }
`;

const TestimonialsTitle = styled.h2`
  text-align: center;
  margin: 0 auto 6rem auto;
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
    border-radius: 3px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: rgba(26, 29, 36, 0.7);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TestimonialContent = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  margin-bottom: 2rem;
  line-height: 1.7;
  font-size: 1.1rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AuthorAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0b0e;
  font-weight: bold;
  font-size: 1.3rem;
`;

const AuthorInfo = styled.div``;
const AuthorName = styled.h4`margin: 0; color: #fff; font-weight: 600;`;
const AuthorTitle = styled.p`margin: 0; color: rgba(255,255,255,0.6); font-size: 0.9rem;`;

// Stats Section
const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #1a1d24 0%, #0a0b0e 100%);
  text-align: center;
`;

const StatsTitle = styled.h2`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 6rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StatCard = styled.div``;
const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;
const StatLabel = styled.p`color: rgba(255,255,255,0.8); font-size: 1.1rem;`;

// Component
const Home = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <PageContainer>
      {/* Hero Section with Form */}
      <HeroContainer ref={ref}>
        <VideoBackground 
          as="div"
          style={{
            background: "url('https://i.pinimg.com/originals/0d/c6/c7/0dc6c70e4fd4452be1376e7dfb8c7342.gif') center/cover no-repeat",
            y: yBg,
            opacity: opacityBg
          }}
        />
        <HeroOverlay />
        
        <FloatingCharacters>
          {characters.map((character) => (
            <Character
              key={character.id}
              style={{
                backgroundImage: `url(${character.image})`,
                width: '150px',
                height: '150px'
              }}
              initial={character.initial}
              animate={character.animate}
              transition={character.transition}
            />
          ))}
        </FloatingCharacters>

        <HeroContent>
          <FormContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StyledGlassPanel $rounded>
              <FormTitle>
                Break Language Barriers with AI-Powered Voice Translation
              </FormTitle>
              
              <FormDescription>
                Instantly translate any video content while preserving the natural voice and emotion of the original speaker
              </FormDescription>

              <InputRow>
                <StyledInput
                  type="text" 
                  placeholder="Paste YouTube or video URL here"
                />
                <TranslateButton>
                  Translate Now
                </TranslateButton>
              </InputRow>

              <LanguageSelectorContainer>
                <LanguageSelector 
                  languages={languages} 
                  onSelect={(lang) => setSelectedLanguage(lang)}
                  defaultLanguage="en"
                  compact
                  placeholder="Select Language"
                />
              </LanguageSelectorContainer>
            </StyledGlassPanel>
          </FormContainer>
        </HeroContent>
      </HeroContainer>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesTitle>
          Powerful Features
        </FeaturesTitle>
        
        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.id}>
              <FeatureIcon>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>
                {feature.title}
              </FeatureTitle>
              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <TestimonialsTitle>
          Loved by Creators Worldwide
        </TestimonialsTitle>
        1
        <TestimonialsGrid>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id}>
              <TestimonialContent>"{testimonial.content}"</TestimonialContent>
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.initials}</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.name}</AuthorName>
                  <AuthorTitle>{testimonial.title}</AuthorTitle>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsTitle>
          Join thousands of content creators, marketers, and businesses
        </StatsTitle>
        
        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.id}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>
    </PageContainer>
  );
};

export default Home;