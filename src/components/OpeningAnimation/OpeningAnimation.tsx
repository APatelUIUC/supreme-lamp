import { useState, useEffect, useMemo } from 'react';
import styles from './OpeningAnimation.module.css';

interface OpeningAnimationProps {
  onComplete: () => void;
}

interface Triangle {
  id: number;
  row: number;
  col: number;
  isUp: boolean;
  x: number;
  y: number;
  delay: number;
  color: 'blue' | 'orange' | 'gradient';
}

const OpeningAnimation = ({ onComplete }: OpeningAnimationProps) => {
  const [phase, setPhase] = useState<'folding' | 'complete'>('folding');

  // Generate tessellation grid that covers the screen
  const triangles = useMemo(() => {
    const triList: Triangle[] = [];
    const triWidth = 60; // Width of each triangle
    const triHeight = triWidth * Math.sqrt(3) / 2; // Height based on equilateral

    // Calculate grid size to cover screen plus extra margin
    const cols = Math.ceil(window.innerWidth / (triWidth / 2)) + 4;
    const rows = Math.ceil(window.innerHeight / triHeight) + 4;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    let id = 0;

    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        // Each position has an up and down triangle
        const isUp = (row + col) % 2 === 0;
        const x = col * (triWidth / 2) - triWidth / 2;
        const y = row * triHeight;

        // Calculate distance from center for ripple delay
        const distX = x + triWidth / 2 - centerX;
        const distY = y + triHeight / 2 - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        // Delay based on distance - closer triangles appear first
        const delay = (distance / maxDist) * 800; // Max 800ms delay spread

        // Color distribution - mostly blue with some orange accents
        const random = Math.random();
        let color: 'blue' | 'orange' | 'gradient';
        if (random < 0.75) {
          color = 'blue';
        } else if (random < 0.92) {
          color = 'orange';
        } else {
          color = 'gradient';
        }

        triList.push({
          id: id++,
          row,
          col,
          isUp,
          x,
          y,
          delay,
          color,
        });
      }
    }

    return triList;
  }, []);

  useEffect(() => {
    // Fast animation - complete after all triangles have folded out
    const totalDuration = 1200; // 800ms max delay + 400ms animation

    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, totalDuration);

    const exitTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 400); // Extra 400ms for exit animation

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${styles[phase]}`}>
      {/* Tessellation grid */}
      <div className={styles.tessellationGrid}>
        {triangles.map((tri) => (
          <div
            key={tri.id}
            className={`${styles.triangle} ${styles[tri.color]} ${tri.isUp ? styles.up : styles.down}`}
            style={{
              '--x': `${tri.x}px`,
              '--y': `${tri.y}px`,
              '--delay': `${tri.delay}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Center glow effect */}
      <div className={styles.centerGlow} />

      {/* Name reveal in center */}
      <div className={styles.nameReveal}>
        <span className={styles.nameText}>Akash Patel</span>
      </div>
    </div>
  );
};

export default OpeningAnimation;
