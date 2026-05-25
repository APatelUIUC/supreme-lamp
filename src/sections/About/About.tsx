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

  const renderToolList = (tools: string[]) =>
    tools.map((tool, i) => (
      <span key={tool}>
        {i > 0 && <span className={styles.dot}>·</span>}
        {tool}
      </span>
    ));

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNumber}>01</span>
          <h2 className={styles.title}>About</h2>
        </div>

        <div className={styles.body}>
          <p className={styles.lede}>
            Full stack and AI engineer with a fascination for mathematical
            patterns and tessellations. NCSSM, then UIUC. Eight years building
            software since.
          </p>

          <p>
            Currently at Chekhub in Raleigh, building operations management
            software and leading AI integrations with MCP. Before that, AI in
            healthcare at Centene and enterprise software at scale at IBM.
          </p>

          <p>
            When I'm not shipping features I'm chasing generative art and the
            mathematics behind aperiodic patterns — like the Einstein monotile.
          </p>
        </div>

        <dl className={styles.toolbox} aria-label="Toolbox">
          <div className={styles.toolboxRow}>
            <dt className={styles.toolboxLabel}>daily</dt>
            <dd className={styles.toolboxList}>{renderToolList(toolbox.daily)}</dd>
          </div>
          <div className={styles.toolboxRow}>
            <dt className={styles.toolboxLabel}>ship with</dt>
            <dd className={styles.toolboxList}>{renderToolList(toolbox.ship)}</dd>
          </div>
          <div className={styles.toolboxRow}>
            <dt className={styles.toolboxLabel}>exploring</dt>
            <dd className={styles.toolboxList}>{renderToolList(toolbox.exploring)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default About;
