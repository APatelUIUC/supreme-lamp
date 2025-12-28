import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'AI-Powered Code Assistant',
    description:
      'An intelligent code review and suggestion tool leveraging LLMs to analyze code patterns, detect bugs, and suggest optimizations in real-time.',
    technologies: ['Python', 'TypeScript', 'OpenAI API', 'FastAPI', 'React'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    featured: true,
    category: 'ai-ml',
  },
  {
    id: 'project-2',
    title: 'Distributed Task Queue',
    description:
      'High-performance, fault-tolerant distributed task queue system supporting millions of jobs per day with automatic retry and dead letter handling.',
    technologies: ['Go', 'Redis', 'PostgreSQL', 'gRPC', 'Kubernetes'],
    githubUrl: 'https://github.com',
    featured: true,
    category: 'backend',
  },
  {
    id: 'project-3',
    title: 'Real-Time Collaboration Platform',
    description:
      'WebSocket-powered collaborative workspace enabling real-time document editing, cursor presence, and conflict-free replicated data types (CRDTs).',
    technologies: ['TypeScript', 'Node.js', 'WebSocket', 'Y.js', 'React'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    featured: true,
    category: 'web',
  },
  {
    id: 'project-4',
    title: 'Cloud Infrastructure Toolkit',
    description:
      'Terraform modules and automation scripts for deploying secure, scalable cloud infrastructure across AWS, GCP, and Azure.',
    technologies: ['Terraform', 'AWS', 'Python', 'GitHub Actions', 'Docker'],
    githubUrl: 'https://github.com',
    featured: false,
    category: 'devops',
  },
  {
    id: 'project-5',
    title: 'Mobile Fitness Tracker',
    description:
      'Cross-platform mobile application for tracking workouts, nutrition, and health metrics with ML-powered insights and personalized recommendations.',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'TensorFlow'],
    githubUrl: 'https://github.com',
    featured: false,
    category: 'mobile',
  },
  {
    id: 'project-6',
    title: 'Open Source CLI Framework',
    description:
      'Developer-friendly CLI framework with auto-generated help, plugin architecture, and rich terminal UI components.',
    technologies: ['Rust', 'CLI', 'Terminal UI'],
    githubUrl: 'https://github.com',
    featured: true,
    category: 'open-source',
  },
];

export const getFeaturedProjects = (): Project[] =>
  projects.filter((p) => p.featured);

export const getProjectsByCategory = (category: Project['category']): Project[] =>
  projects.filter((p) => p.category === category);
