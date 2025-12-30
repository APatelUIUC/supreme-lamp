import { useState, useEffect } from 'react';
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
  const [contentVisible, setContentVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Lock scroll during intro animation
    if (!animationComplete) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [animationComplete]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    // Slight delay before showing content for smooth overlap
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  return (
    <div className="app">
      {/* Tessellation background - always present, handles its own animation */}
      <TessellationBackground
        interactive={animationComplete}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Navigation */}
      <Navigation visible={contentVisible} />

      {/* Main Content */}
      <main
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
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
