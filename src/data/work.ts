import type { WorkExperience } from '../types';

export const workExperience: WorkExperience[] = [
  {
    id: 'chekhub',
    company: 'Chekhub',
    role: 'Full Stack Developer',
    period: '2022 - Present',
    description:
      'Building the operations management platform that empowers businesses to manage, scale, and optimize their workforce. Working across the full stack on a B2B SaaS product serving data centers, healthcare, telecom, and property management industries.',
    highlights: [
      'Developing features for asset management, workforce performance, and customer engagement modules',
      'Building mobile-first responsive interfaces for field workers and managers',
      'Implementing real-time operations dashboards and reporting tools',
      'Contributing to digital MOPs, SOPs, and training management systems',
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'ibm',
    company: 'IBM',
    role: 'Software Engineer',
    period: '2019 - 2022',
    description:
      'Worked on enterprise software solutions, contributing to large-scale systems and gaining experience with enterprise-grade development practices and methodologies.',
    highlights: [
      'Developed and maintained enterprise applications serving global clients',
      'Collaborated with cross-functional teams on complex technical projects',
      'Implemented best practices for code quality, testing, and documentation',
      'Gained experience with enterprise architecture and cloud infrastructure',
    ],
    technologies: ['Java', 'Python', 'React', 'Docker', 'Kubernetes'],
  },
];

export const getWorkExperience = (): WorkExperience[] => workExperience;
