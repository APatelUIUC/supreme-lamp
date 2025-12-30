import { useEffect, useState, useRef } from 'react';
import { personalInfo } from '../../data/navigation';
import styles from './Hero.module.css';

interface HeroProps {
  visible: boolean;
}

const Hero = ({ visible }: HeroProps) => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullText = personalInfo.tagline;

  // Typing effect
  useEffect(() => {
    if (!visible) return;

    let index = 0;
    const typingDelay = 50;

    const typeTimer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeTimer);
      }
    }, typingDelay);

    return () => clearInterval(typeTimer);
  }, [visible, fullText]);

  // Cursor blink
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        containerRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
        containerRef.current.style.opacity = `${1 - scrollY / 700}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className={`${styles.hero} ${visible ? styles.visible : ''}`}>
      <div ref={containerRef} className={styles.content}>
        {/* Decorative elements */}
        <div className={styles.decorLeft}>
          <div className={styles.decorLine} />
          <div className={styles.decorDot} />
        </div>

        {/* Main content */}
        <div className={styles.textContent}>
          <span className={styles.greeting}>
            <span className={styles.greetingBracket}>&lt;</span>
            Hello, World
            <span className={styles.greetingBracket}>/&gt;</span>
          </span>

          <h1 className={styles.name}>
            I'm <span className={styles.nameHighlight}>{personalInfo.name}</span>
          </h1>

          <h2 className={styles.title}>{personalInfo.title}</h2>

          <p className={styles.tagline}>
            {typedText}
            <span className={`${styles.cursor} ${showCursor ? styles.visible : ''}`}>|</span>
          </p>

          <p className={styles.description}>
            Full stack developer at Chekhub, building operations management software.
            UIUC alum passionate about mathematical patterns, generative art, and
            bringing tessellations to life through code.
          </p>

          <div className={styles.ctas}>
            <a href="#projects" className={styles.primaryBtn}>
              <span>View My Work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
            <a href="#contact" className={styles.secondaryBtn}>
              <span>Get In Touch</span>
            </a>
          </div>
        </div>

        {/* Right decorative elements */}
        <div className={styles.decorRight}>
          <div className={styles.decorLine} />
          <div className={styles.decorDot} />
        </div>

        {/* Floating code snippets */}
        <div className={styles.floatingCode}>
          <div className={styles.codeBlock}>
            <span className={styles.codeKeyword}>const</span>{' '}
            <span className={styles.codeVar}>tessellate</span> = {'{'}
            <br />
            &nbsp;&nbsp;<span className={styles.codeProp}>pattern</span>:{' '}
            <span className={styles.codeString}>'penrose'</span>,
            <br />
            &nbsp;&nbsp;<span className={styles.codeProp}>infinite</span>:{' '}
            <span className={styles.codeNumber}>true</span>
            <br />
            {'}'};
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>

      {/* Single subtle geometric decoration */}
      <div className={styles.geometricDecor}>
        <svg className={styles.triangle1} viewBox="0 0 100 87">
          <defs>
            <linearGradient id="heroTriGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <polygon points="50,0 100,87 0,87" fill="url(#heroTriGradient)" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
