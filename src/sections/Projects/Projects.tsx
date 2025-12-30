import { useRef, useEffect, useState } from 'react';
import { getHexGridProjects } from '../../data/projects';
import type { Project } from '../../types';
import styles from './Projects.module.css';

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hexProjects = getHexGridProjects();

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

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNumber}>02.</span>
          <h2 className={styles.title}>
            Featured <span className={styles.titleHighlight}>Projects</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        <p className={styles.subtitle}>
          Click any hexagon to explore the live project.
        </p>

        <div className={styles.hexGrid}>
          {hexProjects.map((project, index) => (
            <HexagonCard
              key={project.id}
              project={project}
              index={index}
              isCenter={index === 0}
            />
          ))}
        </div>

        <div className={styles.viewMore}>
          <a
            href="https://github.com/APatelUIUC"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewMoreLink}
          >
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

interface HexagonCardProps {
  project: Project;
  index: number;
  isCenter: boolean;
}

const HexagonCard = ({ project, index, isCenter }: HexagonCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={project.liveUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.hexagon} ${isCenter ? styles.hexCenter : ''}`}
      data-index={index}
      style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (project.liveUrl === '#') {
          e.preventDefault();
        }
      }}
    >
      <div className={styles.hexInner}>
        <div className={`${styles.hexContent} ${isHovered ? styles.hovered : ''}`}>
          <h3 className={styles.hexTitle}>{project.title}</h3>
        </div>

        <div className={`${styles.hexOverlay} ${isHovered ? styles.visible : ''}`}>
          <p className={styles.hexDescription}>{project.description}</p>
          <span className={styles.hexCta}>
            View Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default Projects;
