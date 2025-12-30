import type { NavItem, SocialLink } from '../types';

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/APatelUIUC',
    icon: 'github',
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/akashpatelcs/',
    icon: 'linkedin',
  },
  {
    platform: 'Email',
    url: 'mailto:akash@patel.dev',
    icon: 'mail',
  },
];

export const personalInfo = {
  name: 'Akash Patel',
  title: 'Full Stack & AI Engineer',
  tagline: 'Crafting tessellations in code and design',
  location: 'Raleigh, NC',
  email: 'akash@patel.dev',
  resumeUrl: '/resume.pdf',
};
