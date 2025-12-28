import { useState, useRef, useEffect } from 'react';
import { projects, getFeaturedProjects } from '../../data/projects';
import type { Project, ProjectCategory } from '../../types';
import styles from './Projects.module.css';

const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Web Development',
  mobile: 'Mobile Apps',
  backend: 'Backend',
  'ai-ml': 'AI / Machine Learning',
  devops: 'DevOps',
  'open-source': 'Open Source',
};

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory | 'all' | 'featured'>('featured');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProjects =
    filter === 'all'
      ? projects
      : filter === 'featured'
      ? getFeaturedProjects()
      : projects.filter((p) => p.category === filter);

  const categories: (ProjectCategory | 'all' | 'featured')[] = [
    'featured',
    'all',
    'web',
    'backend',
    'ai-ml',
    'devops',
    'open-source',
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      {/* Section background decoration */}
      <div className={styles.bgDecoration}>
        <div className={styles.bgTriangle1} />
        <div className={styles.bgTriangle2} />
        <div className={styles.bgGlow} />
      </div>

      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.sectionNumber}>02.</span>
          <h2 className={styles.title}>
            Featured <span className={styles.titleHighlight}>Projects</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        <p className={styles.subtitle}>
          A collection of projects I've built, from open-source tools to production applications.
        </p>

        {/* Filter tabs */}
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all'
                ? 'All Projects'
                : cat === 'featured'
                ? 'Featured'
                : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className={styles.grid}>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isHovered={hoveredProject === project.id}
              onHover={setHoveredProject}
            />
          ))}
        </div>

        {/* View more link */}
        <div className={styles.viewMore}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.viewMoreLink}>
            <span>View More on GitHub</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const ProjectCard = ({ project, index, isHovered, onHover }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.setProperty('--mouse-x', `${x * 20}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y * 20}px`);
    cardRef.current.style.setProperty('--rotation-x', `${y * -5}deg`);
    cardRef.current.style.setProperty('--rotation-y', `${x * 5}deg`);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mouse-x', '0px');
      cardRef.current.style.setProperty('--mouse-y', '0px');
      cardRef.current.style.setProperty('--rotation-x', '0deg');
      cardRef.current.style.setProperty('--rotation-y', '0deg');
    }
    onHover(null);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isHovered ? styles.hovered : ''} ${project.featured ? styles.featured : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => onHover(project.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card glow effect */}
      <div className={styles.cardGlow} />

      {/* Card content */}
      <div className={styles.cardContent}>
        {/* Header with icons */}
        <div className={styles.cardHeader}>
          <div className={styles.folderIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div className={styles.cardLinks}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Project title & description */}
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDescription}>{project.description}</p>

        {/* Technologies */}
        <ul className={styles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        {/* Category badge */}
        <span className={styles.categoryBadge}>{categoryLabels[project.category]}</span>
      </div>

      {/* Decorative corner triangle */}
      <div className={styles.cornerTriangle}>
        <svg viewBox="0 0 40 40">
          <polygon points="0,0 40,0 0,40" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default Projects;
