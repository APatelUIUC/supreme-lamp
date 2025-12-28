import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './OpeningAnimation.module.css';

interface OpeningAnimationProps {
  onComplete: () => void;
}

interface TriangleData {
  cx: number;
  cy: number;
  isUp: boolean;
  delay: number;
  progress: number;
  color: string;
  glowIntensity: number;
}

const OpeningAnimation = ({ onComplete }: OpeningAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'animating' | 'complete'>('animating');
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const trianglesRef = useRef<TriangleData[]>([]);

  // Color palette
  const colors = {
    bgDark: '#0a0e17',
    blue: '#00d4ff',
    blueGlow: 'rgba(0, 212, 255, 0.6)',
    blueFill: 'rgba(0, 212, 255, 0.15)',
    orange: '#ff6b35',
    orangeGlow: 'rgba(255, 107, 53, 0.6)',
    orangeFill: 'rgba(255, 107, 53, 0.2)',
    white: 'rgba(255, 255, 255, 0.1)',
  };

  // Generate perfect tessellation
  const generateTessellation = useCallback((width: number, height: number) => {
    const triangles: TriangleData[] = [];

    // Triangle dimensions - make them larger for more impact
    const triBase = Math.max(80, Math.min(width, height) / 12);
    const triHeight = triBase * Math.sqrt(3) / 2;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    // Calculate grid to cover screen with margin
    const cols = Math.ceil(width / (triBase / 2)) + 6;
    const rows = Math.ceil(height / triHeight) + 6;
    const startCol = -3;
    const startRow = -3;

    for (let row = startRow; row < rows; row++) {
      for (let col = startCol; col < cols; col++) {
        // In a proper tessellation, each grid cell has one triangle
        // The orientation alternates based on position
        const isUp = (row + col) % 2 === 0;

        // Calculate center of triangle
        const cx = col * (triBase / 2);
        const cy = row * triHeight + (isUp ? triHeight * 2/3 : triHeight * 1/3);

        // Distance from screen center for ripple effect
        const dx = cx - centerX;
        const dy = cy - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Delay based on distance - creates ripple from center
        const normalizedDist = distance / maxDist;
        const delay = normalizedDist * 600; // 600ms max spread

        // Color selection - create patterns
        const distanceRing = Math.floor(distance / (triBase * 2));
        const angleFromCenter = Math.atan2(dy, dx);
        const sector = Math.floor((angleFromCenter + Math.PI) / (Math.PI / 6)); // 12 sectors

        let color: string;
        if ((distanceRing + sector) % 7 === 0) {
          color = 'orange';
        } else if ((distanceRing + sector) % 5 === 0) {
          color = 'gradient';
        } else {
          color = 'blue';
        }

        triangles.push({
          cx,
          cy,
          isUp,
          delay,
          progress: 0,
          color,
          glowIntensity: Math.random() * 0.5 + 0.5,
        });
      }
    }

    return { triangles, triBase, triHeight };
  }, []);

  // Draw a single triangle
  const drawTriangle = useCallback((
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    isUp: boolean,
    base: number,
    height: number,
    progress: number,
    color: string,
    glowIntensity: number
  ) => {
    if (progress <= 0) return;

    const scale = Math.min(1, progress);
    const opacity = Math.min(1, progress);

    // Calculate vertices
    const halfBase = (base / 2) * scale;
    const h = height * scale;

    let x1, y1, x2, y2, x3, y3;

    if (isUp) {
      // Up-pointing: top vertex, bottom-left, bottom-right
      x1 = cx; y1 = cy - h * 2/3;
      x2 = cx - halfBase; y2 = cy + h * 1/3;
      x3 = cx + halfBase; y3 = cy + h * 1/3;
    } else {
      // Down-pointing: bottom vertex, top-left, top-right
      x1 = cx; y1 = cy + h * 2/3;
      x2 = cx - halfBase; y2 = cy - h * 1/3;
      x3 = cx + halfBase; y3 = cy - h * 1/3;
    }

    ctx.save();

    // Add glow effect for some triangles
    if (glowIntensity > 0.7 && progress > 0.5) {
      ctx.shadowBlur = 20 * glowIntensity * opacity;
      ctx.shadowColor = color === 'orange' ? colors.orangeGlow : colors.blueGlow;
    }

    // Draw filled triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    // Fill color based on type
    if (color === 'orange') {
      ctx.fillStyle = `rgba(255, 107, 53, ${0.12 * opacity})`;
      ctx.strokeStyle = `rgba(255, 107, 53, ${0.5 * opacity})`;
    } else if (color === 'gradient') {
      const gradient = ctx.createLinearGradient(x2, y2, x3, y3);
      gradient.addColorStop(0, `rgba(0, 212, 255, ${0.15 * opacity})`);
      gradient.addColorStop(1, `rgba(255, 107, 53, ${0.15 * opacity})`);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * opacity})`;
    } else {
      ctx.fillStyle = `rgba(0, 212, 255, ${0.1 * opacity})`;
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 * opacity})`;
    }

    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }, [colors]);

  // Main animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;

    // Initialize tessellation if needed
    let triBase = 80;
    let triHeight = triBase * Math.sqrt(3) / 2;

    if (trianglesRef.current.length === 0) {
      const data = generateTessellation(canvas.width, canvas.height);
      trianglesRef.current = data.triangles;
      triBase = data.triBase;
      triHeight = data.triHeight;
    }

    // Clear canvas
    ctx.fillStyle = colors.bgDark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw triangles
    trianglesRef.current.forEach((tri) => {
      const adjustedTime = elapsed - tri.delay;
      if (adjustedTime > 0) {
        // Easing function for smooth fold-in
        const duration = 350;
        const t = Math.min(1, adjustedTime / duration);
        // Elastic ease out
        tri.progress = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * ((2 * Math.PI) / 3));
      }

      drawTriangle(
        ctx,
        tri.cx,
        tri.cy,
        tri.isUp,
        triBase,
        triHeight,
        tri.progress,
        tri.color,
        tri.glowIntensity
      );
    });

    // Draw center glow
    const glowProgress = Math.min(1, elapsed / 400);
    const glowSize = 150 + glowProgress * 200;
    const glowOpacity = Math.max(0, 1 - elapsed / 800);

    if (glowOpacity > 0) {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, glowSize
      );
      gradient.addColorStop(0, `rgba(0, 212, 255, ${0.6 * glowOpacity})`);
      gradient.addColorStop(0.3, `rgba(255, 107, 53, ${0.3 * glowOpacity})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Check if animation should complete
    if (elapsed > 1400) {
      setPhase('complete');
      setTimeout(onComplete, 400);
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [generateTessellation, drawTriangle, colors, onComplete]);

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Regenerate tessellation on resize
      trianglesRef.current = [];
    };

    resize();
    window.addEventListener('resize', resize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className={`${styles.container} ${styles[phase]}`}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Central triangle logo that pulses */}
      <div className={styles.centralLogo}>
        <svg viewBox="0 0 100 87" className={styles.logoSvg}>
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#ff6b35" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="50,5 95,82 5,82"
            fill="url(#logoGrad)"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Name reveal */}
      <div className={styles.nameReveal}>
        <span className={styles.nameText}>Akash Patel</span>
        <span className={styles.tagline}>Full Stack Developer</span>
      </div>
    </div>
  );
};

export default OpeningAnimation;
