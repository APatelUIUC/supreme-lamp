import { useRef, useEffect, useState } from 'react';
import styles from './About.module.css';

const skills = [
  { name: 'TypeScript', level: 95 },
  { name: 'React', level: 92 },
  { name: 'Node.js', level: 88 },
  { name: 'Python', level: 85 },
  { name: 'Go', level: 78 },
  { name: 'AWS', level: 82 },
  { name: 'PostgreSQL', level: 85 },
  { name: 'Docker', level: 88 },
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
              Hello! I'm a passionate software engineer who loves building things that
              live on the internet. My journey in tech started when I discovered the
              magic of turning ideas into reality through code.
            </p>

            <p className={styles.body}>
              I specialize in creating robust, scalable applications with clean code
              and thoughtful architecture. Whether it's crafting responsive user
              interfaces, designing efficient APIs, or architecting cloud infrastructure,
              I bring the same level of dedication and attention to detail.
            </p>

            <p className={styles.body}>
              When I'm not coding, you'll find me exploring new technologies,
              contributing to open-source projects, or sharing knowledge with
              the developer community.
            </p>

            {/* Quick facts */}
            <div className={styles.quickFacts}>
              <div className={styles.fact}>
                <span className={styles.factNumber}>5+</span>
                <span className={styles.factLabel}>Years Experience</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factNumber}>50+</span>
                <span className={styles.factLabel}>Projects Completed</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factNumber}>10k+</span>
                <span className={styles.factLabel}>Lines of Code</span>
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
{`const developer = {
  name: "Your Name",
  skills: ["TS", "React", "Go"],
  passion: "Building things",
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
