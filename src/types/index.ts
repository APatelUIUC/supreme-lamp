// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  category: ProjectCategory;
}

export type ProjectCategory =
  | 'web'
  | 'mobile'
  | 'backend'
  | 'ai-ml'
  | 'devops'
  | 'open-source';

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  logoUrl?: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  icon?: string;
}

export type SkillCategory =
  | 'languages'
  | 'frameworks'
  | 'tools'
  | 'databases'
  | 'cloud';

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Triangle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  color: 'blue' | 'orange' | 'gradient';
  opacity: number;
}

export interface AnimationState {
  phase: 'initial' | 'expanding' | 'transitioning' | 'complete';
  progress: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Utility types
export type Theme = 'dark' | 'light';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade';
