import type { WorkExperience } from '../types';

export const workExperience: WorkExperience[] = [
  {
    id: 'work-1',
    company: 'Tech Innovators Inc.',
    role: 'Senior Software Engineer',
    period: '2022 - Present',
    description:
      'Leading development of cloud-native applications and mentoring junior developers. Architecting scalable microservices and implementing DevOps best practices.',
    highlights: [
      'Reduced system latency by 40% through database optimization and caching strategies',
      'Led migration of monolith to microservices, improving deployment frequency by 300%',
      'Mentored 5 junior developers, establishing code review and testing practices',
      'Implemented CI/CD pipelines reducing deployment time from hours to minutes',
    ],
    technologies: ['TypeScript', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL'],
  },
  {
    id: 'work-2',
    company: 'Digital Solutions Co.',
    role: 'Full Stack Developer',
    period: '2020 - 2022',
    description:
      'Built and maintained full-stack web applications, working across the entire product lifecycle from design to deployment.',
    highlights: [
      'Developed real-time collaboration features serving 50,000+ daily active users',
      'Built responsive web applications with 99.9% uptime SLA',
      'Integrated third-party APIs and payment systems for e-commerce platform',
      'Optimized frontend performance achieving 95+ Lighthouse scores',
    ],
    technologies: ['React', 'Node.js', 'Python', 'MongoDB', 'Docker'],
  },
  {
    id: 'work-3',
    company: 'Startup Labs',
    role: 'Software Developer',
    period: '2018 - 2020',
    description:
      'Early-stage startup experience building products from scratch, wearing multiple hats across development, testing, and deployment.',
    highlights: [
      'Built MVP that secured $2M seed funding',
      'Implemented automated testing reducing bug reports by 60%',
      'Designed and built RESTful APIs consumed by mobile and web clients',
      'Established coding standards and documentation practices',
    ],
    technologies: ['JavaScript', 'Python', 'React', 'Firebase', 'AWS'],
  },
];

export const getWorkExperience = (): WorkExperience[] => workExperience;
