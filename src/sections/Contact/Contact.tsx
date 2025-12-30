import { useRef, useEffect, useState } from 'react';
import { socialLinks, personalInfo } from '../../data/navigation';
import styles from './Contact.module.css';

const Contact = () => {
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

  const getSocialIcon = (icon: string) => {
    switch (icon) {
      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'mail':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      {/* Background effects */}
      <div className={styles.bgEffects}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gridPattern} />
      </div>

      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.sectionNumber}>04.</span>
          <h2 className={styles.title}>Get In Touch</h2>
        </div>

        {/* Main content */}
        <div className={styles.content}>
          <p className={styles.description}>
            I'm always excited to connect with fellow developers, potential
            collaborators, or anyone who wants to say hello. Whether you have a
            project in mind, a question, or just want to chat about tessellations
            and code — my inbox is always open.
          </p>

          {/* CTA button */}
          <a
            href={`mailto:${personalInfo.email}`}
            className={styles.ctaButton}
          >
            <span>Say Hello</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </a>

          {/* Social links */}
          <div className={styles.socialSection}>
            <span className={styles.socialLabel}>Find me on</span>
            <div className={styles.socialLinks}>
              {socialLinks.map((link, index) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={link.platform}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {getSocialIcon(link.icon)}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative triangle */}
        <div className={styles.decorTriangle}>
          <svg viewBox="0 0 200 174" fill="none">
            <defs>
              <linearGradient id="contactTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <polygon
              points="100,0 200,174 0,174"
              fill="url(#contactTriangleGrad)"
            />
            <polygon
              points="100,0 200,174 0,174"
              fill="none"
              stroke="url(#contactTriangleGrad)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Designed & Built by <span>{personalInfo.name}</span>
          </p>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
