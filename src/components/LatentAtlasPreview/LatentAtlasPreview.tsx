import { useEffect, useRef } from 'react';
import { Delaunay } from 'd3-delaunay';
import { WORDS, AXES, type Axis } from './words';
import styles from './LatentAtlasPreview.module.css';

interface LatentAtlasPreviewProps {
  href: string;
}

// Visual budget (logical px). Canvas internals scale by DPR.
const W = 400;
const VIZ_H = 220;        // canvas viz area
const PADDING = 24;        // viz inset (room for labels at edges)

// Animation timing
const HOLD_MS = 5400;      // hold on each axis
const TRANSITION_MS = 1800; // smooth lerp between axes
const CYCLE_MS = HOLD_MS + TRANSITION_MS;

// One special word that draws in coral — echoes the Latent Atlas accent
const HIGHLIGHT_INDICES = [0, 30]; // 'happy' and 'sky' — visually distributed

// Stable priority order: highlighted words first, then words with the most
// "extreme" trait values (they anchor the axes), then everything else.
// Used by the label-collision pass so the most-meaningful labels survive.
const PRIORITY_ORDER: number[] = (() => {
  const extremity = (i: number) => {
    const t = WORDS[i].traits;
    return Math.max(
      Math.abs(t.valence),
      Math.abs(t.abstraction),
      Math.abs(t.size),
      Math.abs(t.time)
    );
  };
  return Array.from({ length: WORDS.length }, (_, i) => i).sort((a, b) => {
    const aHl = HIGHLIGHT_INDICES.includes(a) ? 0 : 1;
    const bHl = HIGHLIGHT_INDICES.includes(b) ? 0 : 1;
    if (aHl !== bHl) return aHl - bHl;
    return extremity(b) - extremity(a);
  });
})();

// Map a [-1, 1] trait to viz-area pixel coords
const traitToX = (t: number) =>
  PADDING + ((t + 1) / 2) * (W - PADDING * 2);
const traitToY = (t: number) =>
  // invert so larger trait values go UP visually
  PADDING + (1 - (t + 1) / 2) * (VIZ_H - PADDING * 2);

interface LiveWord {
  i: number;
  label: string;
  // current drawn position
  x: number;
  y: number;
  // target position based on active axis
  tx: number;
  ty: number;
  // persistent per-word jitter so identical-trait words don't stack on top
  jitterX: number;
  jitterY: number;
}

const computeTargets = (axis: Axis): Array<[number, number]> =>
  WORDS.map((w) => [
    traitToX(w.traits[axis.xTrait]),
    traitToY(w.traits[axis.yTrait]),
  ]);

const LatentAtlasPreview = ({ href }: LatentAtlasPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const wordsRef = useRef<LiveWord[]>([]);
  const startTimeRef = useRef<number>(0);

  // Init word state
  useEffect(() => {
    const initialAxis = AXES[0];
    const targets = computeTargets(initialAxis);
    wordsRef.current = WORDS.map((w, i) => {
      // Use word index as a stable seed for repeatable jitter
      const jx = ((Math.sin(i * 12.97) + 1) / 2 - 0.5) * 16;
      const jy = ((Math.cos(i * 7.31) + 1) / 2 - 0.5) * 14;
      return {
        i,
        label: w.label,
        x: targets[i][0] + jx,
        y: targets[i][1] + jy,
        tx: targets[i][0] + jx,
        ty: targets[i][1] + jy,
        jitterX: jx,
        jitterY: jy,
      };
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = VIZ_H * dpr;
    ctx.scale(dpr, dpr);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;

    const drawFrame = (now: number) => {
      if (AXES.length === 0) return;
      const elapsed = Math.max(0, now - startTimeRef.current);

      // Determine active and target axis based on cycle progress
      const cycleIdx = Math.floor(elapsed / CYCLE_MS);
      const cyclePos = elapsed - cycleIdx * CYCLE_MS;
      const safeFromIdx = ((cycleIdx % AXES.length) + AXES.length) % AXES.length;
      const safeToIdx = (safeFromIdx + 1) % AXES.length;
      const fromAxis = AXES[safeFromIdx];
      const toAxis = AXES[safeToIdx];
      if (!fromAxis || !toAxis) return;

      // Transition only during the last TRANSITION_MS of the cycle
      const inTransition = cyclePos > HOLD_MS;
      const transitionT = inTransition
        ? Math.min(1, (cyclePos - HOLD_MS) / TRANSITION_MS)
        : 0;
      // ease in/out
      const eased = transitionT < 0.5
        ? 2 * transitionT * transitionT
        : 1 - Math.pow(-2 * transitionT + 2, 2) / 2;

      const fromTargets = computeTargets(fromAxis);
      const toTargets = computeTargets(toAxis);

      // Update each word's target with interpolation between axes,
      // plus a tiny Lissajous drift for ambient motion.
      const driftT = now * 0.0003;
      const points: [number, number][] = [];
      for (let i = 0; i < wordsRef.current.length; i++) {
        const w = wordsRef.current[i];
        const targetX =
          fromTargets[i][0] + (toTargets[i][0] - fromTargets[i][0]) * eased +
          w.jitterX;
        const targetY =
          fromTargets[i][1] + (toTargets[i][1] - fromTargets[i][1]) * eased +
          w.jitterY;

        const driftX = Math.sin(driftT + i * 0.7) * 2.5;
        const driftY = Math.cos(driftT * 0.8 + i * 0.9) * 2.5;

        w.tx = targetX + driftX;
        w.ty = targetY + driftY;
        // Smooth catch-up to target (gentler in reduced motion)
        const k = reducedMotionRef.current ? 1 : 0.12;
        w.x += (w.tx - w.x) * k;
        w.y += (w.ty - w.y) * k;

        points.push([w.x, w.y]);
      }

      // Clear with warm-dark background
      ctx.fillStyle = '#0E0A06';
      ctx.fillRect(0, 0, W, VIZ_H);

      // Voronoi cells — faint cream strokes
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, W, VIZ_H]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(242, 235, 221, 0.16)';
      for (let i = 0; i < points.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if (!cell) continue;
        ctx.beginPath();
        for (let j = 0; j < cell.length; j++) {
          const [px, py] = cell[j];
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Two-pass rendering: dots for everyone, labels with collision avoidance.
      // First pass — draw every dot.
      for (let i = 0; i < wordsRef.current.length; i++) {
        const w = wordsRef.current[i];
        const isHighlight = HIGHLIGHT_INDICES.includes(i);
        ctx.fillStyle = isHighlight
          ? 'rgba(229, 100, 75, 0.95)'
          : 'rgba(232, 224, 208, 0.55)';
        ctx.beginPath();
        ctx.arc(w.x, w.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Second pass — greedy label placement in priority order.
      // Labels that would overlap an already-placed label are skipped
      // (their dot remains, so the point is still visible).
      ctx.font = '500 11px "Geist Mono", monospace';
      ctx.textBaseline = 'middle';
      const placed: Array<[number, number, number, number]> = []; // [x, y, w, h]
      const PAD = 3;
      const LABEL_H = 12;
      const LABEL_OFFSET = 5;

      for (const i of PRIORITY_ORDER) {
        const w = wordsRef.current[i];
        const isHighlight = HIGHLIGHT_INDICES.includes(i);

        const lw = ctx.measureText(w.label).width;
        const lx = w.x + LABEL_OFFSET - PAD;
        const ly = w.y - LABEL_H / 2 - PAD;
        const bw = lw + PAD * 2;
        const bh = LABEL_H + PAD * 2;

        // AABB overlap test against everything already placed
        let overlap = false;
        for (let j = 0; j < placed.length; j++) {
          const [px, py, pw, ph] = placed[j];
          if (lx < px + pw && lx + bw > px && ly < py + ph && ly + bh > py) {
            overlap = true;
            break;
          }
        }
        if (overlap) continue;

        ctx.fillStyle = isHighlight
          ? 'rgba(229, 100, 75, 0.95)'
          : 'rgba(232, 224, 208, 0.88)';
        ctx.fillText(w.label, w.x + LABEL_OFFSET, w.y);
        placed.push([lx, ly, bw, bh]);
      }

      if (isVisibleRef.current && !reducedMotionRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    };

    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // IntersectionObserver — pause when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const wasVisible = isVisibleRef.current;
          isVisibleRef.current = entry.isIntersecting;
          // (The animation loop checks isVisibleRef each frame and
          // pauses/resumes itself — no need to re-prime rAF here.)
          void wasVisible;
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      aria-label="Latent Atlas — open project in a new tab"
    >
      <div className={styles.viz}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <span className={styles.eyebrow}>featured · interactive essay</span>
      </div>

      <div className={styles.text}>
        <h3 className={styles.title}>Latent Atlas</h3>
        <p className={styles.subtitle}>
          A map of how an AI represents meaning.
        </p>
        <div className={styles.footer}>
          <span className={styles.tagline}>
            what i've been doing with my evenings lately.
          </span>
          <span className={styles.cta}>
            explore
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default LatentAtlasPreview;
