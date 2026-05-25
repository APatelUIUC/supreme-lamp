/* Hand-curated word list with traits in [-1, 1] on four conceptual axes.
   Each axis pair gets a different projection, which the canvas cycles
   through every ~7 seconds, watching word clusters re-form. */

export interface Word {
  label: string;
  traits: {
    valence: number;     // sad / unpleasant  ←→  happy / pleasant
    abstraction: number; // concrete / physical ←→  abstract / conceptual
    size: number;        // tiny / microscopic ←→  enormous / cosmic
    time: number;        // ancient / archaic ←→  modern / futuristic
  };
}

export interface Axis {
  id: string;
  xTrait: keyof Word['traits'];
  yTrait: keyof Word['traits'];
  xLabel: [string, string]; // [left, right]
  yLabel: [string, string]; // [bottom, top]
}

export const AXES: Axis[] = [
  {
    id: 'valence-abstraction',
    xTrait: 'valence',
    yTrait: 'abstraction',
    xLabel: ['sad', 'happy'],
    yLabel: ['concrete', 'abstract'],
  },
  {
    id: 'size-time',
    xTrait: 'size',
    yTrait: 'time',
    xLabel: ['small', 'large'],
    yLabel: ['ancient', 'modern'],
  },
  {
    id: 'abstraction-time',
    xTrait: 'abstraction',
    yTrait: 'time',
    xLabel: ['concrete', 'abstract'],
    yLabel: ['ancient', 'modern'],
  },
  {
    id: 'valence-size',
    xTrait: 'valence',
    yTrait: 'size',
    xLabel: ['sad', 'happy'],
    yLabel: ['small', 'large'],
  },
];

// 80-ish words. Traits roughly in [-1, 1]. Hand-tuned for visible clustering.
export const WORDS: Word[] = [
  // Emotions ─────────────────────────────────────────
  { label: 'happy',   traits: { valence:  1.0, abstraction: 0.55, size: -0.1, time:  0.1 } },
  { label: 'joy',     traits: { valence:  0.95, abstraction: 0.70, size: -0.1, time:  0.0 } },
  { label: 'love',    traits: { valence:  0.85, abstraction: 0.80, size: -0.1, time:  0.0 } },
  { label: 'peace',   traits: { valence:  0.75, abstraction: 0.85, size:  0.2, time:  0.0 } },
  { label: 'calm',    traits: { valence:  0.55, abstraction: 0.60, size:  0.0, time:  0.0 } },
  { label: 'hope',    traits: { valence:  0.80, abstraction: 0.85, size:  0.0, time:  0.6 } },
  { label: 'fear',    traits: { valence: -0.75, abstraction: 0.55, size:  0.0, time: -0.1 } },
  { label: 'anger',   traits: { valence: -0.85, abstraction: 0.55, size:  0.1, time:  0.0 } },
  { label: 'sad',     traits: { valence: -1.0, abstraction: 0.55, size:  0.0, time:  0.0 } },
  { label: 'grief',   traits: { valence: -0.95, abstraction: 0.65, size:  0.0, time: -0.2 } },
  { label: 'hate',    traits: { valence: -0.90, abstraction: 0.50, size:  0.0, time:  0.0 } },

  // Abstract concepts ────────────────────────────────
  { label: 'truth',   traits: { valence:  0.30, abstraction: 0.95, size:  0.0, time: -0.1 } },
  { label: 'idea',    traits: { valence:  0.25, abstraction: 0.90, size:  0.0, time:  0.2 } },
  { label: 'theory',  traits: { valence:  0.10, abstraction: 0.95, size:  0.1, time:  0.3 } },
  { label: 'math',    traits: { valence:  0.10, abstraction: 0.90, size:  0.0, time:  0.0 } },
  { label: 'beauty',  traits: { valence:  0.85, abstraction: 0.85, size:  0.0, time:  0.0 } },
  { label: 'dream',   traits: { valence:  0.55, abstraction: 0.80, size:  0.0, time:  0.0 } },
  { label: 'mind',    traits: { valence:  0.30, abstraction: 0.95, size: -0.3, time:  0.0 } },
  { label: 'soul',    traits: { valence:  0.40, abstraction: 0.95, size:  0.0, time: -0.2 } },
  { label: 'art',     traits: { valence:  0.50, abstraction: 0.70, size:  0.0, time:  0.0 } },
  { label: 'memory',  traits: { valence:  0.10, abstraction: 0.85, size:  0.0, time: -0.5 } },
  { label: 'reason',  traits: { valence:  0.20, abstraction: 0.90, size:  0.0, time:  0.1 } },
  { label: 'silence', traits: { valence:  0.10, abstraction: 0.65, size:  0.0, time:  0.0 } },

  // Concrete objects ─────────────────────────────────
  { label: 'chair',   traits: { valence:  0.05, abstraction: -0.90, size: -0.2, time:  0.0 } },
  { label: 'table',   traits: { valence:  0.05, abstraction: -0.90, size:  0.0, time:  0.0 } },
  { label: 'book',    traits: { valence:  0.40, abstraction: -0.40, size: -0.3, time: -0.2 } },
  { label: 'paper',   traits: { valence:  0.05, abstraction: -0.85, size: -0.5, time: -0.1 } },
  { label: 'pen',     traits: { valence:  0.10, abstraction: -0.90, size: -0.6, time:  0.0 } },
  { label: 'door',    traits: { valence:  0.05, abstraction: -0.90, size:  0.0, time:  0.0 } },
  { label: 'window',  traits: { valence:  0.10, abstraction: -0.80, size:  0.0, time:  0.0 } },
  { label: 'key',     traits: { valence:  0.20, abstraction: -0.60, size: -0.6, time:  0.0 } },
  { label: 'glass',   traits: { valence:  0.05, abstraction: -0.85, size: -0.3, time:  0.0 } },
  { label: 'metal',   traits: { valence:  0.00, abstraction: -0.80, size:  0.1, time:  0.1 } },
  { label: 'stone',   traits: { valence:  0.00, abstraction: -0.95, size:  0.0, time: -0.4 } },

  // Nature ───────────────────────────────────────────
  { label: 'tree',    traits: { valence:  0.25, abstraction: -0.70, size:  0.3, time: -0.1 } },
  { label: 'water',   traits: { valence:  0.20, abstraction: -0.70, size:  0.1, time:  0.0 } },
  { label: 'fire',    traits: { valence:  0.05, abstraction: -0.60, size:  0.1, time: -0.2 } },
  { label: 'sky',     traits: { valence:  0.50, abstraction: -0.30, size:  0.7, time:  0.0 } },
  { label: 'sun',     traits: { valence:  0.60, abstraction: -0.40, size:  0.95, time:  0.0 } },
  { label: 'moon',    traits: { valence:  0.50, abstraction: -0.30, size:  0.75, time: -0.2 } },
  { label: 'star',    traits: { valence:  0.55, abstraction:  0.20, size:  0.85, time:  0.0 } },
  { label: 'storm',   traits: { valence: -0.45, abstraction: -0.30, size:  0.6, time:  0.0 } },
  { label: 'ocean',   traits: { valence:  0.30, abstraction: -0.40, size:  0.95, time:  0.0 } },
  { label: 'mountain',traits: { valence:  0.20, abstraction: -0.70, size:  0.85, time: -0.3 } },

  // Sizes ────────────────────────────────────────────
  { label: 'tiny',    traits: { valence:  0.10, abstraction:  0.10, size: -0.95, time:  0.0 } },
  { label: 'small',   traits: { valence:  0.05, abstraction:  0.10, size: -0.55, time:  0.0 } },
  { label: 'huge',    traits: { valence:  0.10, abstraction:  0.10, size:  0.85, time:  0.0 } },
  { label: 'vast',    traits: { valence:  0.30, abstraction:  0.40, size:  0.95, time:  0.0 } },
  { label: 'atom',    traits: { valence:  0.05, abstraction:  0.40, size: -0.95, time:  0.2 } },
  { label: 'universe',traits: { valence:  0.45, abstraction:  0.55, size:  1.00, time:  0.0 } },

  // Time ─────────────────────────────────────────────
  { label: 'ancient', traits: { valence:  0.10, abstraction:  0.40, size:  0.2, time: -0.95 } },
  { label: 'modern',  traits: { valence:  0.15, abstraction:  0.40, size:  0.0, time:  0.85 } },
  { label: 'future',  traits: { valence:  0.40, abstraction:  0.55, size:  0.0, time:  1.00 } },
  { label: 'past',    traits: { valence:  0.00, abstraction:  0.45, size:  0.0, time: -0.75 } },
  { label: 'history', traits: { valence:  0.10, abstraction:  0.40, size:  0.1, time: -0.65 } },
  { label: 'eternal', traits: { valence:  0.40, abstraction:  0.85, size:  0.0, time:  0.0 } },
  { label: 'moment',  traits: { valence:  0.20, abstraction:  0.25, size: -0.5, time:  0.1 } },

  // People & social ──────────────────────────────────
  { label: 'king',    traits: { valence:  0.15, abstraction: -0.10, size:  0.1, time: -0.6 } },
  { label: 'queen',   traits: { valence:  0.20, abstraction: -0.10, size:  0.1, time: -0.6 } },
  { label: 'friend',  traits: { valence:  0.80, abstraction:  0.10, size:  0.0, time:  0.0 } },
  { label: 'family',  traits: { valence:  0.65, abstraction:  0.00, size:  0.0, time: -0.1 } },
  { label: 'child',   traits: { valence:  0.55, abstraction: -0.20, size: -0.4, time:  0.2 } },
  { label: 'parent',  traits: { valence:  0.45, abstraction: -0.10, size:  0.1, time: -0.2 } },
  { label: 'stranger',traits: { valence: -0.20, abstraction:  0.10, size:  0.0, time:  0.0 } },

  // Motion / verbs (used as concepts) ────────────────
  { label: 'fast',    traits: { valence:  0.35, abstraction:  0.10, size:  0.0, time:  0.4 } },
  { label: 'slow',    traits: { valence: -0.20, abstraction:  0.10, size:  0.0, time: -0.2 } },
  { label: 'dance',   traits: { valence:  0.75, abstraction: -0.05, size:  0.0, time:  0.0 } },
  { label: 'sleep',   traits: { valence:  0.25, abstraction: -0.10, size:  0.0, time:  0.0 } },
  { label: 'fly',     traits: { valence:  0.55, abstraction:  0.10, size:  0.2, time:  0.0 } },
  { label: 'fall',    traits: { valence: -0.30, abstraction: -0.05, size:  0.0, time:  0.0 } },

  // Color / sense ────────────────────────────────────
  { label: 'gold',    traits: { valence:  0.55, abstraction:  0.20, size: -0.3, time: -0.3 } },
  { label: 'shadow',  traits: { valence: -0.25, abstraction:  0.45, size:  0.0, time:  0.0 } },
  { label: 'light',   traits: { valence:  0.65, abstraction:  0.40, size:  0.0, time:  0.0 } },

  // Mind & body ──────────────────────────────────────
  { label: 'heart',   traits: { valence:  0.70, abstraction: -0.20, size: -0.5, time:  0.0 } },
  { label: 'brain',   traits: { valence:  0.15, abstraction: -0.40, size: -0.4, time:  0.3 } },
  { label: 'hand',    traits: { valence:  0.25, abstraction: -0.75, size: -0.3, time:  0.0 } },

  // Language ─────────────────────────────────────────
  { label: 'word',    traits: { valence:  0.20, abstraction:  0.55, size: -0.6, time:  0.0 } },
  { label: 'voice',   traits: { valence:  0.30, abstraction:  0.30, size: -0.4, time:  0.0 } },
  { label: 'music',   traits: { valence:  0.65, abstraction:  0.35, size:  0.0, time:  0.0 } },
  { label: 'song',    traits: { valence:  0.60, abstraction:  0.25, size: -0.3, time:  0.0 } },
  { label: 'story',   traits: { valence:  0.45, abstraction:  0.45, size:  0.0, time: -0.1 } },
];
