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
    <div className="fixed inset-0 z-0 w-full h-full bg-[#F7F5F0] overflow-hidden pointer-events-none">
      
      {/* Texture Layer - Modified for Ivory Theme (Warm Multiply blend) */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          filter: 'contrast(120%) brightness(100%) sepia(20%)', /* Added sepia for warmth */
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
          opacity: textureOpacity * 0.3
        }}
      />

      {/* Bottom Sheet Card Style UI */}
      <div 
        className={`absolute bottom-0 w-full transition-transform duration-500 ease-out ${playerOpacity <= 0.05 ? 'translate-y-full' : 'translate-y-0'}`}
        style={{ opacity: playerOpacity > 0.05 ? 1 : 0, pointerEvents: playerOpacity <= 0.05 ? 'none' : 'auto' }}
      >
        {/* Card Container - Warm White Background */}
        <div className="w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] max-w-2xl mx-auto bg-[#FFFEFA] border-t border-x border-stone-200 rounded-t-[36px] px-8 pt-8 pb-10 shadow-2xl relative overflow-hidden">
            
            {/* Inner Top Highlight - Warm hint */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-900/5 to-transparent opacity-70" />
            
            <div className="relative z-10 flex flex-col gap-6">
                 
                 {/* Title / Info Row */}
                 <div className="flex flex-col gap-1 items-center text-center">
                     <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#1A1A1A]/60 uppercase">
                        2026.02.14 | 16:00
                     </span>
                     <h3 className="text-xl font-bold text-[#1A1A1A]/60">
                        赤玉春 VOL.2
                     </h3>
                 </div>

                 {/* Buttons Group */}
                 <div className="flex flex-col gap-3 w-full">
                    
                    {/* Performance Info Button - Warm gray bg */}
                    <button 
                        onClick={onMoreClick}
                        className="w-full py-4 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                    >
                        공연 정보 확인하기
                    </button>

                    {/* Reservation Start Button */}
                    <button 
                        onClick={onPlayClick}
                        className="w-full py-4 bg-stone-900 text-[#F7F5F0] text-sm font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 active:scale-[0.98]"
                    >
                        예매 시작하기
                    </button>

                 </div>
            </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-[#F7F5F0] transition-opacity duration-100 ease-linear pointer-events-none"
        style={{
          opacity: Math.max(0, -0.1 + (scrollProgress * 1.1))
        }}
      />
    </div>
  );
};

export default UnicornBackground;