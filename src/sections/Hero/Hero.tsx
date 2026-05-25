import { useEffect, useState, useRef } from 'react';
import { personalInfo } from '../../data/navigation';
import VoronoiPreview from '../../components/VoronoiPreview';
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
        {/* Main content */}
        <div className={styles.textContent}>
          <h1 className={styles.name}>
            I'm <span className={styles.nameHighlight}>{personalInfo.name}</span>
          </h1>

          <h2 className={styles.title}>
            {personalInfo.title} in the <span className={styles.triangleHighlight}>Triangle</span>
          </h2>

          <p className={styles.tagline}>
            {typedText}
            <span className={`${styles.cursor} ${showCursor ? styles.visible : ''}`}>|</span>
          </p>

          <p className={styles.description}>
            Full stack & AI engineer at Chekhub, building operations management software
            and AI integrations with MCP. UIUC alum passionate about mathematical patterns,
            artificial intelligence, and building great software.
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

      </div>

      {/* 3D Voronoi preview — fixed to the top-right of the viewport,
          visible across the whole page like a piece of the header.
          Kept OUTSIDE the parallax-transformed `.content` div so the
          position:fixed correctly anchors to the viewport. */}
      <div className={styles.previewSlot}>
        <VoronoiPreview
          href="https://3d-voronoi.vercel.app/"
          label="3D Voronoi"
        />
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>

    </section>
  );
};

export default Hero;
