import { useEffect, useState, useRef } from 'react';
import { personalInfo } from '../../data/navigation';
import LatentAtlasPreview from '../../components/LatentAtlasPreview';
import styles from './Hero.module.css';

interface HeroProps {
  visible: boolean;
}

const Hero = ({ visible }: HeroProps) => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [previewReady, setPreviewReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
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

  // Parallax effect — desktop only. On mobile the Voronoi card sits
  // in-flow below the CTAs, and parallax-shifting .content downward
  // makes the CTAs visually slide INTO the card's area.
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        const isMobile = window.innerWidth <= 768;
        containerRef.current.style.transform = isMobile
          ? ''
          : `translateY(${scrollY * 0.3}px)`;
        containerRef.current.style.opacity = `${1 - scrollY / 700}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Voronoi entry fade-in (after the hero's other animations land)
  useEffect(() => {
    const t = setTimeout(() => setPreviewReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Scroll-driven horizontal drift for the Voronoi.
  //   - At scrollY = 0: card sits ~15vw to the LEFT of its base position
  //     (so it's more centered in the hero)
  //   - As you scroll, it slides right toward the viewport edge
  //   - By the time you've scrolled ~80% of one viewport height,
  //     it's at its base position (right: 5vw) and stays there
  // Disabled on mobile (the card is in-flow there, not fixed).
  useEffect(() => {
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const el = previewRef.current;
      if (!el) return;

      if (window.innerWidth <= 768) {
        el.style.transform = '';
        return;
      }

      const hero = window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / (hero * 0.8)));
      const x = -15 * (1 - progress); // start −15vw, end 0
      el.style.transform = `translateX(${x.toFixed(2)}vw)`;
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update(); // set initial position before first paint
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
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

      {/* Latent Atlas preview — fixed to the top-right of the viewport,
          drifts right with scroll. Featured project card. */}
      <div
        ref={previewRef}
        className={`${styles.previewSlot} ${previewReady ? styles.previewReady : ''}`}
      >
        <LatentAtlasPreview
          href="https://latent-atlas-alpha.vercel.app/"
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
