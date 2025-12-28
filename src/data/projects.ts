import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'mobile-penrose-tiler',
    title: 'Mobile Penrose Tiler',
    description:
      'Interactive web application for creating mathematical tile patterns including Penrose, Einstein hat, triangular, and hexagonal tilings with real-time visual feedback and high-resolution export.',
    technologies: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/APatelUIUC/MobilePenroseTiler',
    liveUrl: 'https://mobilepenrosetiler.vercel.app',
    featured: true,
    category: 'web',
  },
  {
    id: 'gather',
    title: 'Gather - Event Platform',
    description:
      'A Partiful-inspired event management system with beautiful invitations, RSVP tracking, guest messaging, and waitlist management. Features 20+ curated templates across 10 categories.',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'SQLite', 'Framer Motion'],
    githubUrl: 'https://github.com/APatelUIUC/AutonomouslyImprovingGather',
    featured: true,
    category: 'web',
  },
  {
    id: '3d-voronoi',
    title: '3D Voronoi Visualization',
    description:
      'Interactive 3D visualization of Voronoi diagrams, bringing mathematical tessellation concepts to life with real-time rendering and manipulation capabilities.',
    technologies: ['JavaScript', 'Three.js', 'CSS', 'HTML5 Canvas'],
    githubUrl: 'https://github.com/APatelUIUC/3dVoronoi',
    liveUrl: 'https://3d-voronoi.vercel.app',
    featured: true,
    category: 'web',
  },
  {
    id: 'tiling-music',
    title: 'Tiling Music',
    description:
      'An experimental project exploring the intersection of mathematical tilings and music visualization, creating audio-reactive geometric patterns.',
    technologies: ['JavaScript', 'Web Audio API', 'CSS', 'HTML5'],
    githubUrl: 'https://github.com/APatelUIUC/tiling-music',
    liveUrl: 'https://tiling-music.vercel.app',
    featured: false,
    category: 'web',
  },
  {
    id: 'einstein-tiling',
    title: 'Einstein Hat Tiling',
    description:
      'Fork and enhancement of the hatviz project for constructing aperiodic hat tilings - the famous "einstein" monotile discovered in 2023.',
    technologies: ['JavaScript', 'P5.js', 'Mathematics'],
    githubUrl: 'https://github.com/APatelUIUC/EinsteinCopy',
    featured: false,
    category: 'open-source',
  },
  {
    id: 'tactile-js',
    title: 'Tactile.js Fork',
    description:
      'Enhanced JavaScript library for representing, manipulating, and drawing periodic tilings with improved mobile support and additional tiling patterns.',
    technologies: ['JavaScript', 'Canvas API', 'Mathematics'],
    githubUrl: 'https://github.com/APatelUIUC/mytactile',
    featured: false,
    category: 'open-source',
  },
];

export const getFeaturedProjects = (): Project[] =>
  projects.filter((p) => p.featured);

export const getProjectsByCategory = (category: Project['category']): Project[] =>
  projects.filter((p) => p.category === category);
