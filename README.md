# Personal Portfolio Website

A stunning, modern portfolio website featuring an impressive tessellation-themed opening animation, built with React, TypeScript, and Vite.

## Features

- **Spectacular Opening Animation**: Triangle tessellation that expands from the center
- **Interactive Background**: Dynamic tessellation pattern with mouse tracking
- **Smooth Animations**: Scroll-triggered reveals and parallax effects
- **Responsive Design**: Fully responsive across all device sizes
- **Modern Tech Stack**: React 18, TypeScript, Vite, CSS Modules

## Design System

### Color Palette
- **Primary Blues**: Deep tech blues (`#0a192f`, `#0d1321`)
- **Accent Blue**: Electric blue (`#00d4ff`)
- **Accent Orange**: Neon orange (`#ff6b35`)
- **Text Colors**: Carefully crafted for accessibility

### Typography
- **Display**: Space Grotesk
- **Body**: Inter
- **Code**: JetBrains Mono

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation/      # Site navigation
│   ├── OpeningAnimation/# Intro animation sequence
│   └── TessellationBackground/
├── sections/            # Page sections
│   ├── Hero/            # Landing section
│   ├── About/           # About me section
│   ├── Projects/        # Project showcase
│   ├── Work/            # Work experience
│   └── Contact/         # Contact section
├── data/                # Static data
├── hooks/               # Custom React hooks
├── styles/              # Global styles & variables
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Personal Information
Update your details in `src/data/navigation.ts`:
```typescript
export const personalInfo = {
  name: 'Your Name',
  title: 'Software Engineer',
  tagline: 'Building the future, one line at a time',
  email: 'hello@example.com',
};
```

### Projects
Add your projects in `src/data/projects.ts`

### Work Experience
Update your experience in `src/data/work.ts`

## Performance

- Optimized animations with `requestAnimationFrame`
- CSS containment for improved rendering
- Lazy-loaded components
- Respects `prefers-reduced-motion`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this template for your own portfolio!
