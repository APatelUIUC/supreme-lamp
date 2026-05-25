import { useEffect, useRef } from 'react';
import { Delaunay } from 'd3-delaunay';
import styles from './VoronoiPreview.module.css';

interface VoronoiPreviewProps {
  href: string;
  label?: string;
  width?: number;
  height?: number;
}

// Cool-toned palette — adjacent to the site's blue accent, but saturated
// enough to read as "portal to elsewhere." Weights skew toward teal/blue
// (site-cohesive) with rarer fuchsia/cyan as accent moments.
const PALETTE = [
  { rgb: '34, 211, 238', weight: 0.40 },   // teal       #22d3ee
  { rgb: '91, 163, 247', weight: 0.30 },   // site blue  #5BA3F7
  { rgb: '192, 132, 252', weight: 0.18 },  // fuchsia    #c084fc
  { rgb: '103, 232, 249', weight: 0.12 },  // cyan       #67e8f9
];

function pickColor(): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < PALETTE.length; i++) {
    cum += PALETTE[i].weight;
    if (r < cum) return i;
  }
  return PALETTE.length - 1;
}

interface Seed {
  baseX: number;
  baseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  phaseX: number;
  phaseY: number;
  colorIdx: number;
}

const VoronoiPreview = ({
  href,
  label = '3D Voronoi',
  width = 360,
  height = 240,
}: VoronoiPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);
  const seedsRef = useRef<Seed[]>([]);
  const scrollOffsetRef = useRef(0);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const SEED_COUNT = 34;

    seedsRef.current = Array.from({ length: SEED_COUNT }, () => ({
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      freqX: 0.00025 + Math.random() * 0.00035,
      freqY: 0.00025 + Math.random() * 0.00035,
      ampX: 6 + Math.random() * 14,
      ampY: 6 + Math.random() * 14,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      colorIdx: pickColor(),
    }));
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // DPR scaling so it renders crisp on retina. Display size is handled
    // by CSS (100% width, aspect-ratio); we only set the internal pixel
    // resolution here based on the logical width/height.
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Respect prefers-reduced-motion: draw once and stop
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;

    const renderFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const seeds = seedsRef.current;
      const scrollPhase = scrollOffsetRef.current * 0.0006;
      const time = reducedMotionRef.current ? 0 : t;

      const points: [number, number][] = seeds.map((s) => {
        const x =
          s.baseX +
          Math.sin(time * s.freqX + s.phaseX + scrollPhase) * s.ampX;
        const y =
          s.baseY +
          Math.cos(time * s.freqY + s.phaseY + scrollPhase * 1.3) * s.ampY;
        return [x, y];
      });

      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);

      // Render cells: faint fill + visible stroke
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';

      for (let i = 0; i < points.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if (!cell) continue;
        const color = PALETTE[seeds[i].colorIdx];

        // Build path
        ctx.beginPath();
        for (let j = 0; j < cell.length; j++) {
          const [x, y] = cell[j];
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Very faint fill for depth
        ctx.fillStyle = `rgba(${color.rgb}, 0.025)`;
        ctx.fill();

        // Visible stroke
        ctx.strokeStyle = `rgba(${color.rgb}, 0.55)`;
        ctx.stroke();
      }

      // Seed points — tiny cream dots, a hint of the underlying point set
      ctx.fillStyle = 'rgba(242, 235, 221, 0.45)';
      for (const [x, y] of points) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = (t: number) => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      renderFrame(t);

      if (reducedMotionRef.current) {
        // Reduced motion: render once, then stop
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  // Pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll → animation parameter
  useEffect(() => {
    const onScroll = () => {
      scrollOffsetRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.preview}
      aria-label={`${label} — open project in a new tab`}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.label}>
        <span className={styles.labelText}>{label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </a>
  );
};

export default VoronoiPreview;
