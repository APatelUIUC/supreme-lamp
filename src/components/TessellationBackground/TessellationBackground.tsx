import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './TessellationBackground.module.css';

interface Triangle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  colorType: 'blue' | 'orange' | 'gradient';
  layer: number;
}

interface TessellationBackgroundProps {
  onAnimationComplete?: () => void;
  interactive?: boolean;
}

const TessellationBackground = ({
  onAnimationComplete,
  interactive = true,
}: TessellationBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [animationPhase, setAnimationPhase] = useState<
    'initial' | 'expanding' | 'tessellating' | 'complete'
  >('initial');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const startTimeRef = useRef<number>(0);

  // Generate tessellation pattern
  const generateTessellation = useCallback(() => {
    const triangleList: Triangle[] = [];
    const baseSize = 80;
    const height = baseSize * Math.sqrt(3) / 2;

    // Calculate grid dimensions to cover screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const cols = Math.ceil(screenWidth / baseSize) + 4;
    const rows = Math.ceil(screenHeight / height) + 4;

    let id = 0;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const isUpward = (row + col) % 2 === 0;
        const x = col * (baseSize / 2) - baseSize;
        const y = row * height - height;

        // Calculate distance from center for animation delay
        const distFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const maxDist = Math.sqrt(
          Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)
        ) / 2;
        const normalizedDist = distFromCenter / maxDist;

        // Determine color based on position and randomness
        const colorRandom = Math.random();
        let colorType: 'blue' | 'orange' | 'gradient';
        if (colorRandom < 0.7) {
          colorType = 'blue';
        } else if (colorRandom < 0.9) {
          colorType = 'orange';
        } else {
          colorType = 'gradient';
        }

        triangleList.push({
          id: id++,
          x,
          y,
          size: baseSize,
          rotation: isUpward ? 0 : 180,
          delay: normalizedDist * 1500 + Math.random() * 200,
          colorType,
          layer: Math.floor(normalizedDist * 5),
        });
      }
    }

    return triangleList;
  }, []);

  // Initialize triangles
  useEffect(() => {
    const tris = generateTessellation();
    setTriangles(tris);

    // Start animation sequence
    setTimeout(() => setAnimationPhase('expanding'), 500);
    setTimeout(() => setAnimationPhase('tessellating'), 1500);
    setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete?.();
    }, 4000);

    const handleResize = () => {
      const newTris = generateTessellation();
      setTriangles(newTris);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateTessellation, onAnimationComplete]);

  // Canvas animation for ambient effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ambient glow effects
      const glowPoints = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: 'rgba(0, 212, 255, 0.03)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: 'rgba(255, 107, 53, 0.03)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, color: 'rgba(0, 212, 255, 0.02)' },
      ];

      glowPoints.forEach((point, i) => {
        const pulse = Math.sin(elapsed * 0.001 + i * Math.PI / 2) * 0.5 + 0.5;
        const radius = 300 + pulse * 100;

        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, radius
        );
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive mouse glow
      if (interactive && animationPhase === 'complete') {
        const mouseGlow = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 200
        );
        mouseGlow.addColorStop(0, 'rgba(0, 212, 255, 0.05)');
        mouseGlow.addColorStop(0.5, 'rgba(255, 107, 53, 0.02)');
        mouseGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive, animationPhase, mousePos]);

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[animationPhase]}`}
    >
      {/* Canvas for ambient effects */}
      <canvas ref={canvasRef} className={styles.ambientCanvas} />

      {/* Central starting triangle */}
      <div className={`${styles.centralTriangle} ${animationPhase !== 'initial' ? styles.hidden : ''}`}>
        <svg viewBox="0 0 100 87" className={styles.centralTriangleSvg}>
          <defs>
            <linearGradient id="centralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#ff6b35" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="50,0 100,87 0,87"
            fill="url(#centralGradient)"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Tessellation triangles */}
      <div className={styles.tessellationLayer}>
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className={`${styles.triangle} ${styles[triangle.colorType]} ${styles[`layer${triangle.layer}`]}`}
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: `${triangle.size}px`,
              height: `${triangle.size * Math.sqrt(3) / 2}px`,
              transform: `rotate(${triangle.rotation}deg)`,
              animationDelay: `${triangle.delay}ms`,
              '--mouse-x': `${mousePos.x}px`,
              '--mouse-y': `${mousePos.y}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className={styles.particlesLayer}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines overlay */}
      <div className={styles.gridOverlay} />
    </div>
  );
};

export default TessellationBackground;
