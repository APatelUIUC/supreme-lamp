import { useState, useEffect } from 'react';
import OpeningAnimation from './components/OpeningAnimation';
import TessellationBackground from './components/TessellationBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Work from './sections/Work';
import Contact from './sections/Contact';
import './styles/variables.css';
import './styles/global.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Lock scroll during intro
    if (showIntro) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    // Short delay before hiding intro
    setTimeout(() => {
      setShowIntro(false);
      // Slight delay before showing content for smooth transition
      setTimeout(() => {
        setContentVisible(true);
      }, 200);
    }, 200);
  };

  return (
    <div className="app">
      {/* Opening Animation */}
      {showIntro && <OpeningAnimation onComplete={handleIntroComplete} />}

      {/* Background with tessellation */}
      {!showIntro && <TessellationBackground interactive={true} />}

      {/* Navigation */}
      <Navigation visible={contentVisible} />

      {/* Main Content */}
      <main
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Hero visible={contentVisible} />
        <About />
        <Projects />
        <Work />
        <Contact />
      </main>
    </div>
  );
}

export default App;
