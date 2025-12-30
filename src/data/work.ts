import type { WorkExperience } from '../types';

export const workExperience: WorkExperience[] = [
  {
    id: 'chekhub',
    company: 'Chekhub',
    role: 'Full Stack & AI Engineer',
    period: '2025 - 2026',
    description:
      'Building the operations management platform that empowers businesses to manage, scale, and optimize their workforce. Leading AI integrations using Model Context Protocol (MCP) to enhance platform capabilities.',
    highlights: [
      'Leading AI integration initiatives using Model Context Protocol (MCP) to connect AI systems with business tools',
      'Developing features for asset management, workforce performance, and customer engagement modules',
      'Building mobile-first responsive interfaces for field workers and managers',
      'Implementing real-time operations dashboards and reporting tools',
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'MCP'],
  },
  {
    id: 'centene',
    company: 'Centene',
    role: 'Software Developer',
    period: '2022 - 2025',
    description:
      'Developed cloud-native healthcare software and AI-powered solutions handling sensitive PHI data, ensuring HIPAA compliance while pioneering AI adoption across the organization.',
    highlights: [
      'Pioneered AI integration initiatives, implementing intelligent automation and ML-powered features',
      'Built full-stack features using React, Kafka, MongoDB, and Golang in a cloud-native architecture',
      'Led technology transition initiatives while maintaining strict HIPAA compliance and data security',
      'Served as Scrum Master for the Golang backend team, improving communication and team output',
    ],
    technologies: ['React', 'Golang', 'Kafka', 'MongoDB', 'AWS', 'AI/ML'],
  },
  {
    id: 'ibm',
    company: 'IBM',
    role: 'Software Engineer',
    period: '2018 - 2022',
    description:
      'Worked on IBM Guardium, a leading enterprise data security platform that provides real-time database activity monitoring, vulnerability assessment, and data protection for organizations worldwide.',
    highlights: [
      'Developed features for Guardium Data Protection, helping secure sensitive data across hybrid cloud environments',
      'Built and maintained security dashboards and compliance reporting tools',
      'Collaborated with cross-functional teams on vulnerability assessment and threat detection features',
      'Contributed to enterprise-scale systems serving Fortune 500 clients globally',
    ],
    technologies: ['Java', 'Python', 'React', 'Docker', 'Kubernetes'],
  },
];

export const getWorkExperience = (): WorkExperience[] => workExperience;
