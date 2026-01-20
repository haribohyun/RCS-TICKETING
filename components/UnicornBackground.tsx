import React, { useEffect, useState } from 'react';

interface UnicornBackgroundProps {
  onStarClick?: () => void;
  onMoreClick?: () => void;
  onPlayClick?: () => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

const UnicornBackground: React.FC<UnicornBackgroundProps> = ({ 
  onStarClick, 
  onMoreClick,
  onPlayClick,
  onPrevClick,
  onNextClick 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(scrollY / (winHeight * 1.5), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playerOpacity = Math.max(0, 1 - scrollProgress * 3.5);
  const textureOpacity = Math.max(0, 1 - scrollProgress * 1.2);

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#0a0a0a] overflow-hidden pointer-events-none">
      
      {/* Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          filter: 'contrast(140%) brightness(100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          opacity: textureOpacity * 0.4
        }}
      />

      {/* Apple Music Style Player UI */}
      <div 
        className={`absolute bottom-0 w-full px-6 pb-12 pt-12 md:pb-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent transition-opacity duration-300 ${playerOpacity <= 0.05 ? 'pointer-events-none' : 'pointer-events-auto'}`}
        style={{ opacity: playerOpacity }}
      >
        <div className="max-w-xl mx-auto w-full flex flex-col gap-6 md:gap-8">
            
            {/* Header Section replaced with simple text */}
            <div className="flex flex-col items-center justify-center px-1 gap-1">
                 <span className="text-[10px] md:text-xs font-medium tracking-widest text-[#D8B4FE]/80 uppercase">
                    26.02.14 SAT | 16:00
                 </span>
                 <span className="text-[10px] md:text-xs font-medium tracking-widest text-[#D8B4FE]/80 uppercase">
                    赤玉春 VOL.2
                 </span>
            </div>

            <div className="flex flex-col items-center justify-center pt-4 w-full gap-3">
                
                {/* Performance Info Button - Updated to match 'Already Reserved' button style */}
                <button 
                    onClick={onMoreClick}
                    className="w-full py-4 bg-zinc-800 text-white border border-white/10 text-sm font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                    공연 정보 확인하기
                </button>

                {/* Reservation Start Button */}
                <button 
                    onClick={onPlayClick}
                    className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                    예매 시작하기
                </button>

            </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-black transition-opacity duration-100 ease-linear pointer-events-none"
        style={{
          opacity: Math.max(0, -0.1 + (scrollProgress * 1.1))
        }}
      />
    </div>
  );
};

export default UnicornBackground;