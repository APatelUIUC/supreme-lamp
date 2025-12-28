import { useRef, useEffect, useState } from 'react';
import styles from './About.module.css';

const skills = [
  { name: 'React', level: 95 },
  { name: 'TypeScript', level: 92 },
  { name: 'Node.js', level: 90 },
  { name: 'Next.js', level: 88 },
  { name: 'PostgreSQL', level: 85 },
  { name: 'Python', level: 82 },
  { name: 'AWS', level: 80 },
  { name: 'Tailwind CSS', level: 90 },
];

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
                <span className={styles.factNumber}>17+</span>
                <span className={styles.factLabel}>GitHub Repos</span>
              </div>
            </div>
          </div>

          {/* Skills visualization */}
          <div className={styles.skillsContainer}>
            <h3 className={styles.skillsTitle}>Technical Skills</h3>
            <div className={styles.skillsList}>
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className={styles.skillItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel}>{skill.level}%</span>
                  </div>
                  <div className={styles.skillBar}>
                    <div
                      className={styles.skillProgress}
                      style={{ '--skill-level': `${skill.level}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
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
  coffee: true
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className={styles.bgDecoration}>
        <div className={styles.tessellationPattern} />
      </div>
    </section>
  );
};

export default About;
