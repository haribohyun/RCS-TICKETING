import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white/80 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default ScrollToTop;