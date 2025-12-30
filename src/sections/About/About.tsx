import { useRef, useEffect, useState } from 'react';
import styles from './About.module.css';

const toolbox = {
  daily: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
  ship: ['Next.js', 'Python', 'AWS', 'Tailwind'],
  exploring: ['Rust', 'WebGL', 'Deno'],
};

const About = () => {
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.sectionNumber}>01.</span>
          <h2 className={styles.title}>
            About <span className={styles.titleHighlight}>Me</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        <div className={styles.content}>
          {/* Text content */}
          <div className={styles.textContent}>
            <p className={styles.intro}>
              I'm a full stack developer with a fascination for mathematical patterns
              and tessellations. From NCSSM to UIUC, I've been building software that
              brings complex ideas to life.
            </p>

            <p className={styles.body}>
              Currently at Chekhub in Raleigh, I build operations management software
              that helps businesses optimize their workforce. Previously at IBM, I
              developed enterprise solutions at scale.
            </p>

            <p className={styles.body}>
              When I'm not shipping features, you'll find me exploring generative art,
              building interactive tiling visualizations, or diving into the mathematics
              behind aperiodic patterns like the Einstein monotile.
            </p>

            {/* Quick facts */}
            <div className={styles.quickFacts}>
              <div className={styles.fact}>
                <span className={styles.factNumber}>UIUC</span>
                <span className={styles.factLabel}>Education</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factNumber}>NCSSM</span>
                <span className={styles.factLabel}>High School</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factNumber}>8+</span>
                <span className={styles.factLabel}>Years Experience</span>
              </div>
            </div>
          </div>

          {/* Toolbox */}
          <div className={styles.skillsContainer}>
            <h3 className={styles.skillsTitle}>Toolbox</h3>

            <div className={styles.toolboxSection}>
              <span className={styles.toolboxLabel}>Daily drivers</span>
              <div className={styles.tagList}>
                {toolbox.daily.map((tool) => (
                  <span key={tool} className={styles.tag}>{tool}</span>
                ))}
              </div>
            </div>

            <div className={styles.toolboxSection}>
              <span className={styles.toolboxLabel}>Also ship with</span>
              <div className={styles.tagList}>
                {toolbox.ship.map((tool) => (
                  <span key={tool} className={styles.tagSecondary}>{tool}</span>
                ))}
              </div>
            </div>

            <div className={styles.toolboxSection}>
              <span className={styles.toolboxLabel}>Currently exploring</span>
              <div className={styles.tagList}>
                {toolbox.exploring.map((tool) => (
                  <span key={tool} className={styles.tagExploring}>{tool}</span>
                ))}
              </div>
            </div>

            {/* Decorative code block */}
            <div className={styles.codeDecor}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
              </div>
              <pre className={styles.codeContent}>
{`const akash = {
  location: "Raleigh, NC",
  interests: ["tessellations", "math"],
  current: "Chekhub",
  seeking: "the hat"
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default About;
