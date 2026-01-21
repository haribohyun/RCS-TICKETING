import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Clear any existing timeout to reset the inactivity timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if scrolling up
      if (currentScrollY < lastScrollY.current && currentScrollY > 100) {
        setIsVisible(true);
        
        // Hide after 2 seconds of inactivity
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else if (currentScrollY > lastScrollY.current || currentScrollY <= 100) {
        // Hide immediately if scrolling down or near top
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFEFA]/90 backdrop-blur-md border border-stone-200 shadow-lg hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-stone-600 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default ScrollToTop;