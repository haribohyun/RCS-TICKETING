import React, { useState, useRef } from 'react';
import UnicornBackground from './components/UnicornBackground';
import Hero from './components/Hero';
import Features from './components/Features';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  // State for the easter egg message (appears below date)
  const [easterEggMessage, setEasterEggMessage] = useState("");
  
  // Ref for animation state
  const isAnimatingRef = useRef(false);

  // Easter Egg Handler: Click on Star Button
  const handleEasterEggClick = () => {
    if (isAnimatingRef.current) return;
    triggerTypewriterEffect();
  };

  const triggerTypewriterEffect = () => {
    isAnimatingRef.current = true;
    const targetText = "그 순간 우린 누구보다 예술이야";
    let currentLength = 0;

    // Type In
    const typeInInterval = setInterval(() => {
        currentLength++;
        setEasterEggMessage(targetText.slice(0, currentLength));

        if (currentLength === targetText.length) {
          clearInterval(typeInInterval);
          
          // Wait 2 seconds then Delete (Type Out)
          setTimeout(() => {
             const typeOutInterval = setInterval(() => {
                currentLength--;
                setEasterEggMessage(targetText.slice(0, currentLength));

                if (currentLength === 0) {
                    clearInterval(typeOutInterval);
                    isAnimatingRef.current = false;
                }
             }, 50); // Faster deletion speed
          }, 2000);
        }
    }, 100); // Typing speed
  };

  // Generic Scroll Handler
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#0a0a0a] text-[#F2EFE7]">
      {/* Background Layer - Player Controls Navigation */}
      <UnicornBackground 
        onStarClick={handleEasterEggClick} 
        onMoreClick={() => scrollToId('location-card')}
        onPlayClick={() => scrollToId('reserve-card')}
        onPrevClick={() => scrollToId('members-card')}
        onNextClick={() => scrollToId('playlist-card')}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col pointer-events-none">
        <Hero 
          dateText="2026 . 02 . 14 . sat" 
          messageText={easterEggMessage} 
          onImageClick={handleEasterEggClick}
        />
        <Features />
      </div>

      {/* Floating Scroll Top Button */}
      <ScrollToTop />
    </main>
  );
};

export default App;