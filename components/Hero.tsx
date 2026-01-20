import React, { useEffect, useState } from 'react';

interface HeroProps {
  dateText?: string;
  messageText?: string;
  onImageClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ dateText = "2026 . 02 . 14 . sat", messageText = "", onImageClick }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      
      // 스크롤이 발생하면 투명도를 조절하여 제자리에서 사라지게 함 (화면 높이의 40% 지점에서 완전히 사라짐)
      const fadeOutThreshold = winHeight * 0.4;
      const newOpacity = Math.max(0, 1 - scrollY / fadeOutThreshold);
      
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 초기 실행
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // 높이 공간을 차지하기 위한 컨테이너 (스크롤 영역 확보)
    <div className="relative w-full min-h-screen pointer-events-none">
      
      {/* 
        Fixed Content Layer
        브라우저 리사이징/스크롤 시 위치 고정 및 투명도 변화 적용 
      */}
      <div 
        className="fixed inset-0 w-full h-full flex flex-col justify-center items-center z-0"
        style={{ 
            opacity: opacity,
            // 투명도가 0이면 클릭 등 이벤트 방지
            visibility: opacity <= 0 ? 'hidden' : 'visible'
        }}
      >
        {/* 
            Center Group: Main Content
            기존 레이아웃 유지를 위한 위치 조정 (-translate-y-24 등)
        */}
        <div className="flex flex-col items-center gap-4 transform -translate-y-24 md:-translate-y-20 pointer-events-auto">
            
            {/* Dynamic Easter Egg Message - Moved to top */}
            <div className="h-4 flex items-center justify-center">
                 <p className="text-[10px] md:text-xs font-medium tracking-widest text-[#C85E53] whitespace-nowrap animate-pulse drop-shadow-sm">
                    {messageText}
                </p>
            </div>

            {/* Static Text */}
            <div className="flex flex-col items-center justify-end gap-1 mb-2">
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] md:text-xs font-medium tracking-widest text-[#D8B4FE]/80">
                        밸런타인데이 저녁
                    </p>
                    <p className="text-[10px] md:text-xs font-medium tracking-widest text-[#D8B4FE]/80">
                        초콜릿 공장에 당신을 초대합니다!
                    </p>
                </div>
            </div>

            {/* Main Visual Image replacing Text Content */}
            <div className="relative flex flex-col items-center justify-center">
                <img 
                    src="https://i.postimg.cc/2jstJbq3/Gemini-Generated-Image-vvlvyyvvlvyyvvlv-removebg-preview.png"
                    alt="Main Visual"
                    onClick={onImageClick}
                    className="w-full max-w-[260px] md:max-w-[420px] object-contain drop-shadow-sm opacity-95 animate-float-slow select-none cursor-pointer"
                />
            </div>

        </div>
      </div>

    </div>
  );
};

export default Hero;