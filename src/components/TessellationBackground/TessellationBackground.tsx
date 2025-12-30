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
    'initial' | 'revealing' | 'complete'
  >('initial');
  const mousePosRef = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef<number>(0);

  // Generate tessellation pattern with correct geometry
  const generateTessellation = useCallback(() => {
    const triangleList: Triangle[] = [];
    const baseSize = 80;
    const triHeight = baseSize * Math.sqrt(3) / 2;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate how many triangles we need
    const colsNeeded = Math.ceil(screenWidth / (baseSize / 2)) + 4;
    const rowsNeeded = Math.ceil(screenHeight / triHeight) + 4;

    let id = 0;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    // Create a proper tessellation grid
    for (let row = -2; row < rowsNeeded; row++) {
      for (let col = -2; col < colsNeeded; col++) {
        // Determine if this triangle points up or down
        const isUpward = (row + col) % 2 === 0;

        // Position calculation for proper tessellation:
        // - Each column is half a baseSize apart
        // - Each row is one triangle height apart
        const x = col * (baseSize / 2);
        const y = row * triHeight;

        // Calculate distance from center for animation delay
        const distFromCenter = Math.sqrt(
          Math.pow(x + baseSize / 2 - centerX, 2) +
          Math.pow(y + triHeight / 2 - centerY, 2)
        );
        const normalizedDist = Math.min(1, distFromCenter / maxDist);

        // Color distribution
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
          delay: normalizedDist * 1200 + Math.random() * 150,
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

    // Start animation sequence - simplified to 3 phases
    setTimeout(() => setAnimationPhase('revealing'), 300);
    setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete?.();
    }, 2500);

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

      // Interactive mouse glow - use ref to avoid re-renders
      if (interactive && animationPhase === 'complete') {
        const mousePos = mousePosRef.current;
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
  }, [interactive, animationPhase]);

  // Mouse tracking - use ref to avoid re-renders
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Generate particle data once to avoid recalculation on re-render
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
    })), []
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[animationPhase]}`}
    >
      {/* Canvas for ambient effects */}
      <canvas ref={canvasRef} className={styles.ambientCanvas} />

      {/* Tessellation triangles */}
      <div className={styles.tessellationLayer}>
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className={`${styles.triangle} ${styles[triangle.colorType]} ${styles[`layer${triangle.layer}`]} ${!triangle.isUp ? styles.down : ''}`}
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: `${triangle.size}px`,
              height: `${triangle.size * Math.sqrt(3) / 2}px`,
              animationDelay: `${triangle.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
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

      {/* Grid lines overlay */}
      <div className={styles.gridOverlay} />
    </div>
  );
};

export default TessellationBackground;
