import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './TessellationBackground.module.css';

interface Triangle {
  id: number;
  x: number;
  y: number;
  size: number;
  isUp: boolean;
  delay: number;
  colorType: 'blue' | 'orange' | 'gradient';
  layer: number;
  distFromCenter: number;
}

interface TessellationBackgroundProps {
  onAnimationComplete?: () => void;
  interactive?: boolean;
}

const TessellationBackground = ({
  onAnimationComplete,
  interactive = true,
}: TessellationBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [phase, setPhase] = useState<'seed' | 'revealing' | 'complete'>('seed');
  const mousePosRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Generate tessellation pattern
  const generateTessellation = useCallback(() => {
    const triangleList: Triangle[] = [];
    const isMobile = window.innerWidth < 768;
    const baseSize = isMobile ? 60 : 80;
    const triHeight = baseSize * Math.sqrt(3) / 2;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const colsNeeded = Math.ceil(screenWidth / (baseSize / 2)) + 4;
    const rowsNeeded = Math.ceil(screenHeight / triHeight) + 4;

    let id = 0;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let row = -2; row < rowsNeeded; row++) {
      for (let col = -2; col < colsNeeded; col++) {
        const isUpward = (row + col) % 2 === 0;
        const x = col * (baseSize / 2);
        const y = row * triHeight;

        const triCenterX = x + baseSize / 2;
        const triCenterY = y + triHeight / 2;

        const distFromCenter = Math.sqrt(
          Math.pow(triCenterX - centerX, 2) +
          Math.pow(triCenterY - centerY, 2)
        );
        const normalizedDist = Math.min(1, distFromCenter / maxDist);

        // Snappy ripple - 500ms max spread from center
        const delay = normalizedDist * 500;

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
          isUp: isUpward,
          delay,
          colorType,
          layer: Math.floor(normalizedDist * 5),
          distFromCenter,
        });
      }
    }

    return triangleList;
  }, []);

  // Find the seed triangle (closest to center)
  const seedTriangleId = useMemo(() => {
    if (triangles.length === 0) return null;
    let closest = triangles[0];
    for (const tri of triangles) {
      if (tri.distFromCenter < closest.distFromCenter) {
        closest = tri;
      }
    }
    return closest.id;
  }, [triangles]);

  // Initialize triangles and run animation sequence
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const tris = generateTessellation();
    setTriangles(tris);

    // Timeline:
    // 0ms: Seed appears
    // 1000ms: Start revealing (ripple out)
    // 2000ms: Complete

    setTimeout(() => {
      setPhase('revealing');
    }, 1000);

    setTimeout(() => {
      setPhase('complete');
    }, 2000);
  }, [generateTessellation]);

  // Call onAnimationComplete when phase becomes complete
  useEffect(() => {
    if (phase === 'complete') {
      onAnimationComplete?.();
    }
  }, [phase, onAnimationComplete]);

  // Canvas for ambient glow
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

      // Subtle ambient glow
      const glowPoints = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: 'rgba(0, 212, 255, 0.02)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: 'rgba(255, 107, 53, 0.02)' },
      ];

      glowPoints.forEach((point, i) => {
        const pulse = Math.sin(elapsed * 0.0008 + i * Math.PI) * 0.5 + 0.5;
        const radius = 250 + pulse * 100;

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

      // Mouse glow when interactive
      if (interactive && phase === 'complete') {
        const mousePos = mousePosRef.current;
        const mouseGlow = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 150
        );
        mouseGlow.addColorStop(0, 'rgba(0, 212, 255, 0.04)');
        mouseGlow.addColorStop(0.5, 'rgba(255, 107, 53, 0.02)');
        mouseGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 150, 0, Math.PI * 2);
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
  }, [interactive, phase]);

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Particles
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 8,
    })), []
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[phase]}`}
    >
      <canvas ref={canvasRef} className={styles.ambientCanvas} />

      <div className={styles.tessellationLayer}>
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className={`
              ${styles.triangle}
              ${styles[triangle.colorType]}
              ${styles[`layer${triangle.layer}`]}
              ${!triangle.isUp ? styles.down : ''}
              ${triangle.id === seedTriangleId ? styles.seed : ''}
            `}
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: `${triangle.size}px`,
              height: `${triangle.size * Math.sqrt(3) / 2}px`,
              '--delay': `${triangle.delay}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={styles.particlesLayer}>
        {particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className={styles.particle}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TessellationBackground;
