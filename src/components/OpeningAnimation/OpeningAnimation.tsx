import { useState, useEffect, useCallback } from 'react';
import styles from './OpeningAnimation.module.css';

interface OpeningAnimationProps {
  onComplete: () => void;
}

type Phase = 'loading' | 'triangle' | 'expanding' | 'tessellating' | 'revealing' | 'complete';

const OpeningAnimation = ({ onComplete }: OpeningAnimationProps) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [triangleCount, setTriangleCount] = useState(0);

  // Generate expanding triangles
  const generateTriangles = useCallback(() => {
    const triangles = [];
    const layers = 6;
    let id = 0;

    for (let layer = 0; layer < layers; layer++) {
      const trianglesInLayer = layer === 0 ? 1 : layer * 6;
      const radius = layer * 80;

      for (let i = 0; i < trianglesInLayer; i++) {
        const angle = (i / trianglesInLayer) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (i % 2 === 0 ? 0 : 180) + (layer * 30);
        const delay = layer * 150 + i * 20;
        const isOrange = (layer + i) % 5 === 0;

        triangles.push({
          id: id++,
          x,
          y,
          rotation,
          delay,
          layer,
          isOrange,
          scale: 1 - layer * 0.1,
        });
      }
    }

    return triangles;
  }, []);

  const triangles = generateTriangles();

  useEffect(() => {
    // Animation timeline
    const timeline = [
      { phase: 'triangle' as Phase, delay: 300 },
      { phase: 'expanding' as Phase, delay: 1200 },
      { phase: 'tessellating' as Phase, delay: 2500 },
      { phase: 'revealing' as Phase, delay: 4000 },
      { phase: 'complete' as Phase, delay: 5000 },
    ];

    const timeouts = timeline.map(({ phase, delay }) =>
      setTimeout(() => setPhase(phase), delay)
    );

    // Trigger onComplete when done
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 5500);

    // Animate triangle count for loading
    let count = 0;
    const countInterval = setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      if (count > 100) count = 100;
      setTriangleCount(count);
      if (count >= 100) clearInterval(countInterval);
    }, 50);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(completeTimeout);
      clearInterval(countInterval);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${styles[phase]}`}>
      {/* Background gradient */}
      <div className={styles.background} />

      {/* Loading indicator */}
      <div className={styles.loadingIndicator}>
        <span className={styles.loadingText}>
          Initializing<span className={styles.dots}>...</span>
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${triangleCount}%` }}
          />
        </div>
        <span className={styles.loadingPercent}>{triangleCount}%</span>
      </div>

      {/* Central triangle origin */}
      <div className={styles.centerPoint}>
        <svg
          viewBox="0 0 100 87"
          className={styles.originTriangle}
        >
          <defs>
            <linearGradient id="originGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff">
                <animate
                  attributeName="stop-color"
                  values="#00d4ff;#ff6b35;#00d4ff"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#ff6b35">
                <animate
                  attributeName="stop-color"
                  values="#ff6b35;#00d4ff;#ff6b35"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <filter id="originGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="50,5 95,82 5,82"
            fill="none"
            stroke="url(#originGradient)"
            strokeWidth="2"
            filter="url(#originGlow)"
          />
          <polygon
            points="50,5 95,82 5,82"
            fill="url(#originGradient)"
            opacity="0.3"
          />
        </svg>

        {/* Inner rotating triangle */}
        <svg
          viewBox="0 0 100 87"
          className={styles.innerTriangle}
        >
          <polygon
            points="50,15 85,75 15,75"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Expanding tessellation */}
      <div className={styles.tessellationContainer}>
        {triangles.map((tri) => (
          <div
            key={tri.id}
            className={`${styles.expandingTriangle} ${tri.isOrange ? styles.orange : styles.blue}`}
            style={{
              '--x': `${tri.x}px`,
              '--y': `${tri.y}px`,
              '--rotation': `${tri.rotation}deg`,
              '--delay': `${tri.delay}ms`,
              '--scale': tri.scale,
              '--layer': tri.layer,
            } as React.CSSProperties}
          >
            <svg viewBox="0 0 100 87">
              <polygon
                points="50,0 100,87 0,87"
                fill="currentColor"
                opacity="0.6"
              />
              <polygon
                points="50,0 100,87 0,87"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Radial lines emanating from center */}
      <div className={styles.radialLines}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className={styles.radialLine}
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <div className={styles.particles}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={styles.particle}
            style={{
              '--angle': `${Math.random() * 360}deg`,
              '--distance': `${100 + Math.random() * 400}px`,
              '--duration': `${1 + Math.random() * 2}s`,
              '--delay': `${Math.random() * 2}s`,
              '--size': `${2 + Math.random() * 4}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Reveal overlay */}
      <div className={styles.revealOverlay} />

      {/* Text reveal */}
      <div className={styles.welcomeText}>
        <span className={styles.welcomeHello}>Hello, I'm</span>
        <span className={styles.welcomeName}>Your Name</span>
        <span className={styles.welcomeRole}>Software Engineer</span>
      </div>
    </div>
  );
};

export default OpeningAnimation;
