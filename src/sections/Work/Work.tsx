import { useState, useRef, useEffect } from 'react';
import { workExperience } from '../../data/work';
import styles from './Work.module.css';

const Work = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);

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

  const activeWork = workExperience[activeIndex];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      {/* Background decoration */}
      <div className={styles.bgDecoration}>
        <div className={styles.gridLines} />
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
      </div>

      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.sectionNumber}>03.</span>
          <h2 className={styles.title}>
            Work <span className={styles.titleHighlight}>Experience</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        {/* Experience content */}
        <div className={styles.content}>
          {/* Company tabs */}
          <div className={styles.tabList} ref={tabListRef}>
            {/* Tab indicator */}
            <div
              className={styles.tabIndicator}
              style={{ transform: `translateY(${activeIndex * 48}px)` }}
            />

            {workExperience.map((work, index) => (
              <button
                key={work.id}
                className={`${styles.tab} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className={styles.tabCompany}>{work.company}</span>
                <span className={styles.tabRole}>{work.role}</span>
              </button>
            ))}
          </div>

          {/* Experience details */}
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <h3 className={styles.role}>
                {activeWork.role}{' '}
                <span className={styles.company}>@ {activeWork.company}</span>
              </h3>
              <span className={styles.period}>{activeWork.period}</span>
            </div>

            <p className={styles.description}>{activeWork.description}</p>

            {/* Highlights */}
            <ul className={styles.highlights}>
              {activeWork.highlights.map((highlight, index) => (
                <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className={styles.highlightArrow}>▹</span>
                  {highlight}
                </li>
              ))}
            </ul>

            {/* Technologies used */}
            <div className={styles.techStack}>
              <span className={styles.techLabel}>Tech Stack:</span>
              <div className={styles.techTags}>
                {activeWork.technologies.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline decoration */}
        <div className={styles.timeline}>
          {workExperience.map((_, index) => (
            <div
              key={index}
              className={`${styles.timelineNode} ${index === activeIndex ? styles.active : ''} ${index < activeIndex ? styles.past : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <div className={styles.timelineDot} />
              {index < workExperience.length - 1 && <div className={styles.timelineLine} />}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative triangles */}
      <div className={styles.decorTriangles}>
        <svg className={styles.triangle1} viewBox="0 0 100 87">
          <polygon points="50,0 100,87 0,87" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className={styles.triangle2} viewBox="0 0 100 87">
          <polygon points="50,0 100,87 0,87" fill="currentColor" opacity="0.05" />
        </svg>
      </div>
    </section>
  );
};

export default Work;
