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
    url: 'https://github.com',
    icon: 'github',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'linkedin',
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com',
    icon: 'twitter',
  },
  {
    platform: 'Email',
    url: 'mailto:hello@example.com',
    icon: 'mail',
  },
];

export const personalInfo = {
  name: 'Your Name',
  title: 'Software Engineer',
  tagline: 'Building the future, one line at a time',
  location: 'San Francisco, CA',
  email: 'hello@example.com',
  resumeUrl: '/resume.pdf',
};
