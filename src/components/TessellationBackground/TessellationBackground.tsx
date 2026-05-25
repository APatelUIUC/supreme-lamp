import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './TessellationBackground.module.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
void useMemo;

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
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [phase, setPhase] = useState<'seed' | 'revealing' | 'complete'>('seed');
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

        // All tiles are now cream-toned; the three classes vary stroke opacity
        // so we still get the layered depth feel without a second color.
        const colorRandom = Math.random();
        let colorType: 'blue' | 'orange' | 'gradient';
        if (colorRandom < 0.6) {
          colorType = 'blue';      // faintest stroke
        } else if (colorRandom < 0.9) {
          colorType = 'gradient';  // mid
        } else {
          colorType = 'orange';    // strongest stroke (rare "warm bloom")
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

  // (Removed: ambient canvas glow, mouse-follow glow, and floating particles.
  // The wireframe is the only background element now.)
  void interactive;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[phase]}`}
    >
      <canvas ref={canvasRef} className={styles.ambientCanvas} />

      <svg
        className={styles.tessellationSvg}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {triangles.map((triangle) => {
          // Compute the three vertices in screen space.
          const w = triangle.size;
          const h = triangle.size * Math.sqrt(3) / 2;
          const x = triangle.x;
          const y = triangle.y;
          const points = triangle.isUp
            ? `${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`
            : `${x},${y} ${x + w},${y} ${x + w / 2},${y + h}`;
          return (
            <polygon
              key={triangle.id}
              points={points}
              fill="none"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className={`
                ${styles.triPolygon}
                ${styles[triangle.colorType]}
                ${styles[`layer${triangle.layer}`]}
                ${triangle.id === seedTriangleId ? styles.seed : ''}
              `}
              style={{ '--delay': `${triangle.delay}ms` } as React.CSSProperties}
            />
          );
        })}
      </svg>

    </div>
  );
};

export default TessellationBackground;
