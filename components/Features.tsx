import React, { useState, useEffect } from 'react';
import { Guitar, Users, Music, Play, ChevronRight, User, Phone, Ticket, Copy, Check, Sparkles, ChevronDown, ArrowLeft, ScanBarcode, Loader2, DollarSign, X, QrCode, AlertCircle, Search, Mic, Disc, Drum } from 'lucide-react';

const Features: React.FC = () => {
  // Reservation Stages: 'intro' | 'form' | 'countSelection' | 'confirm' | 'success' | 'finalGuide' | 'lookup' | 'checkLoading' | 'result' | 'duplicateError'
  const [reserveStage, setReserveStage] = useState<'intro' | 'form' | 'countSelection' | 'confirm' | 'success' | 'finalGuide' | 'lookup' | 'checkLoading' | 'result' | 'duplicateError'>('intro');
  
  // Info/Location Card Stage: 'info' | 'map' | 'parking'
  const [infoStage, setInfoStage] = useState<'info' | 'map' | 'parking'>('info');

  // States for animation and logic
  const [isTearing, setIsTearing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // New states for copy enforcement
  const [hasCopied, setHasCopied] = useState(false);
  const [showCopyWarning, setShowCopyWarning] = useState(false);
  
  // Playlist Animation State
  const [isListExpanded, setIsListExpanded] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    referral: '',
    count: 1
  });

  // Lookup Form Data
  const [lookupData, setLookupData] = useState({
    name: '',
    phone: ''
  });

  // Lookup Result State - Updated to handle status: 'success' | 'pending' | 'notFound'
  const [lookupResult, setLookupResult] = useState<{ status: 'success' | 'pending' | 'notFound'; count?: number; name?: string; phone?: string } | null>(null);

  const TICKET_PRICE = 10000;
  // Members List Sorted Alphabetically (Korean)
  const MEMBERS = [
    '강정구', '강정은', '고예은', '공지윤', '김선우', '류보현', '박이다', 
    '안성준', '안소희', '윤태훈', '이서린', '이정대', '이주영', '이혁준', 
    '최영훈', '한지성', '지인 없음/기타'
  ];

  // Validation Logic
  const isNameValid = /^[가-힣]+$/.test(formData.name);
  const isLookupNameValid = /^[가-힣]+$/.test(lookupData.name);
  const isPhoneValid = formData.phone.length === 4;
  const isFormValid = isNameValid && isPhoneValid && formData.referral !== "";

  // Script URL
  const scriptUrl = "https://script.google.com/macros/s/AKfycbxWhpWls-jnRayrb5XTF300WWHVhI2MfLhB19Vgm6xKNlanGQt6RDRiqNvpbvCemyBj4Q/exec";

  useEffect(() => {
    // Playlist animation loop: Expand for 4s, Collapse for 2s (Total 6s cycle)
    const playlistInterval = setInterval(() => {
        setIsListExpanded(prev => !prev);
    }, 4000); 
    
    return () => { clearInterval(playlistInterval); };
  }, []);

  // Effect to handle real data fetching for ticket lookup
  useEffect(() => {
    if (reserveStage === 'checkLoading') {
        const fetchTicketStatus = async () => {
            try {
                // Construct URL with query params
                const queryParams = new URLSearchParams({
                    name: lookupData.name,
                    phone: lookupData.phone,
                    t: String(Date.now()) // Anti-cache
                });

                const response = await fetch(`${scriptUrl}?${queryParams.toString()}`);
                if (!response.ok) throw new Error("Network error");
                
                const data = await response.json();
                
                // Handle response (could be array or single object depending on server logic)
                const list = Array.isArray(data) ? data : (data.data || [data]);
                
                // Find matching user (Robustness: check again client side just in case)
                const user = list.find((item: any) => {
                    const itemName = item.name || item['성함'] || item['입금자성함'];
                    // Update: Support 'phoneSuffix' and '뒷번호' keys as well
                    const itemPhone = item.phoneSuffix || item.phone || item['연락처'] || item['전화번호'] || item['뒷번호'];
                    
                    // Normalize comparison
                    return itemName === lookupData.name && String(itemPhone).trim() === String(lookupData.phone).trim();
                });

                if (user) {
                    // Status Check: 'ㅇ'
                    const status = user.status || user.confirm || user.check || user['확인상태'] || user['상태'];
                    // Quantity Check: E column data (mapped to keys like count, amount, or qty)
                    const count = user.count || user.amount || user['수량'] || user.qty || 1;

                    // Condition: Status must be exactly 'ㅇ'
                    const isApproved = status === 'ㅇ';
                    
                    if (isApproved) {
                        setLookupResult({
                            status: 'success',
                            count: parseInt(String(count), 10) || 1,
                            name: lookupData.name,
                            phone: lookupData.phone
                        });
                    } else {
                        // Pending approval
                        setLookupResult({ status: 'pending' });
                    }
                } else {
                    // User not found
                    setLookupResult({ status: 'notFound' });
                }
            } catch (error) {
                console.error("Lookup failed", error);
                setLookupResult({ status: 'notFound' });
            } finally {
                setReserveStage('result');
            }
        };

        fetchTicketStatus();
    }
  }, [reserveStage, lookupData.name, lookupData.phone]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartTicket = () => {
    if (isTearing) return;
    setIsTearing(true);
    
    // Smooth Press-and-Release Animation Sequence
    // Phase 1: Press In (controlled by isTearing=true)
    
    // Phase 2: Release (controlled by isTearing=false)
    setTimeout(() => {
        setIsTearing(false);
    }, 200); // 200ms press duration for responsive feel

    // Phase 3: Navigate (after release animation completes)
    setTimeout(() => {
        setReserveStage('form');
    }, 500); // 500ms total duration before navigation
  };

  const handleGoToCount = () => {
    setReserveStage('countSelection');
  };

  const handleCheckBeforeConfirm = () => {
    setReserveStage('confirm');
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    // Payload separated by name and phoneSuffix (Updated Key)
    const payload = {
      name: formData.name, 
      phoneSuffix: formData.phone, // KEY CHANGED: phone -> phoneSuffix
      category: formData.referral, 
      count: formData.count, 
      amount: formData.count * TICKET_PRICE, 
      isModified: isEditing ? "수정" : "" 
    };

    fetch(scriptUrl, { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    })
    .then(response => response.json())
    .then(data => {
      // Check for duplicate result from server
      if (data.result === 'duplicate') {
        // CHANGED: Instead of alert, show duplicateError stage
        setReserveStage('duplicateError');
      } else {
        // Reset copy enforcement states
        setHasCopied(false);
        setShowCopyWarning(false);
        
        // Proceed to success (Account Check) only if successful
        setReserveStage('success');
      }
    })
    .catch(() => { alert("전송 오류가 발생했습니다."); })
    .finally(() => setIsSubmitting(false));
  };

  const handleLookup = () => {
    if (!lookupData.name || lookupData.phone.length !== 4) {
      alert("정확한 성함과 뒷번호 4자리를 입력해주세요.");
      return;
    }
    // Go to loading screen first
    setReserveStage('checkLoading');
  };

  // Back button handler
  const handleBack = () => {
      if (reserveStage === 'countSelection') {
          setReserveStage('form');
      } else {
          setReserveStage('intro');
      }
  };

  return (
    <div className="w-full py-24 px-6 md:px-12 lg:px-24 relative z-10 pointer-events-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Ticket Reservation / Lookup */}
        <div id="reserve-card" className="order-1 md:order-2 group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[40px] p-10 overflow-hidden hover:border-white/20 transition-all duration-500 min-h-[640px] flex flex-col shadow-xl">
          
          {/* Header Section */}
          <div className="relative z-10 mb-4 flex justify-between items-start min-h-[48px]">
            <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold text-[#D8B4FE] mb-1">
                    {reserveStage === 'intro' ? '티켓 예매' : 
                     reserveStage === 'form' ? '정보를 알려주세요' :
                     reserveStage === 'countSelection' ? '몇 장을 예매할까요?' :
                     reserveStage === 'confirm' ? '입력한 정보가 맞나요?' :
                     reserveStage === 'success' ? '거의 다 됐어요!' :
                     reserveStage === 'finalGuide' ? '입금을 완료하셨나요?' :
                     reserveStage === 'duplicateError' ? '안내사항' :
                     reserveStage === 'lookup' ? '예매 조회' : 
                     reserveStage === 'checkLoading' ? '조회 중' : '티켓 현황'}
                </h3>
                <p className={`text-sm font-medium transition-colors duration-300 ${reserveStage === 'success' ? 'text-gray-400' : 'text-gray-400'}`}>
                    {reserveStage === 'intro' ? '2026.02.14 SAT | 적옥춘 VOL.2' :
                     reserveStage === 'form' ? '입금 확인을 위해 꼭 필요한 정보예요.' :
                     reserveStage === 'countSelection' ? '예매하실 티켓 수량을 선택해주세요.' :
                     reserveStage === 'confirm' ? '마지막으로 한 번 더 확인해 주세요.' :
                     reserveStage === 'success' ? '아래 계좌로 입금하면 예매가 끝나요.' :
                     reserveStage === 'finalGuide' ? '반드시 아래 내용을 확인해주세요.' :
                     reserveStage === 'duplicateError' ? '반드시 아래 내용을 확인해주세요.' :
                     reserveStage === 'lookup' ? '신청하신 성함과 연락처를 입력해주세요.' :
                     reserveStage === 'checkLoading' ? '입금 내역을 대조하고 있습니다.' :
                     (reserveStage === 'result' && lookupResult?.status === 'notFound') ? '조회 결과 정보 없음.' :
                     (reserveStage === 'result' && lookupResult?.status === 'pending') ? '현재 확인중 입니다.' :
                     '본 화면을 캡쳐해 주세요.'}
                </p>
            </div>
            
            {(reserveStage === 'form' || reserveStage === 'countSelection' || reserveStage === 'lookup' || reserveStage === 'result') && (
                <button 
                  onClick={handleBack}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
            )}
          </div>

          {/* Intro Screen */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'intro' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             
             {/* Ticket Visual */}
             <div className="flex-1 flex items-center justify-center w-full">
                <div className="animate-float-slow">
                    <img 
                        src="https://i.postimg.cc/tTKMPmJ2/Gemini-Generated-Image-g0sjmqg0sjmqg0sj-removebg-preview.png"
                        alt="Ticket Visual"
                        onClick={handleStartTicket}
                        className={`
                            w-full max-w-[300px] md:max-w-[380px] max-h-[280px] object-contain drop-shadow-lg cursor-pointer
                            transition-all duration-300 ease-out select-none
                            ${isTearing ? 'scale-95 opacity-90' : 'hover:scale-105'}
                        `}
                    />
                </div>
             </div>

             {/* Action Buttons */}
             <div className="mt-8 w-full space-y-3">
                <button 
                    onClick={() => setReserveStage('lookup')}
                    className="w-full py-4 bg-zinc-800 text-white border border-white/10 text-sm font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                    이미 예매하셨나요?
                </button>
                <button 
                    onClick={handleStartTicket}
                    className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                    티켓 예매 시작하기
                </button>
             </div>

          </div>

          {/* Form Screen (Info Input) */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'form' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none translate-x-10'}`}>
             <div className="flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 flex items-center gap-2"><User className="w-4 h-4" /> 입금자 성함</label>
                    <input type="text" placeholder="한글 성함 입력" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full bg-white/5 border ${formData.name && !isNameValid ? 'border-red-400' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder-gray-500`} />
                    {formData.name && !isNameValid && (
                        <p className="text-xs text-red-500 font-medium pl-1 mt-1">숫자 및 특수기호는 불가합니다</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 flex items-center gap-2"><Phone className="w-4 h-4" /> 연락처 뒷번호 (4자리)</label>
                    <input type="tel" maxLength={4} placeholder="1234" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-white/10 placeholder-gray-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 flex items-center gap-2"><Users className="w-4 h-4" /> 누구의 지인인가요?</label>
                    <div className="relative">
                        <select value={formData.referral} onChange={(e) => handleInputChange('referral', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/10">
                            <option value="" disabled className="text-black">멤버를 선택하세요</option>
                            {MEMBERS.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
             </div>
             <div className="mt-8 w-full">
                <button 
                    disabled={!isFormValid || isSubmitting} 
                    onClick={handleGoToCount} 
                    className={`w-full py-4 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${isFormValid && !isSubmitting ? 'bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] hover:bg-[#D8B4FE] active:scale-[0.98]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                >
                   다음단계
                </button>
             </div>
          </div>

          {/* Count Selection Screen (Intermediate Stage) */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'countSelection' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none translate-x-10'}`}>
             <div className="flex flex-col gap-5 flex-1 justify-center">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-white/60 flex items-center justify-center gap-2"><Ticket className="w-5 h-5" /> 예매 매수</label>
                    <div className="flex items-center justify-center gap-10 py-4">
                        <button onClick={() => handleInputChange('count', Math.max(1, formData.count - 1))} className="text-4xl font-light text-white hover:opacity-50 transition-opacity w-12 h-12 flex items-center justify-center">-</button>
                        <span className="font-black text-white text-5xl">{formData.count}매</span>
                        <button onClick={() => handleInputChange('count', Math.min(10, formData.count + 1))} className="text-4xl font-light text-white hover:opacity-50 transition-opacity w-12 h-12 flex items-center justify-center">+</button>
                    </div>
                    <div className="text-center">
                         <p className="text-lg font-bold text-white/60 mt-4">
                            총 결제 금액: {(formData.count * TICKET_PRICE).toLocaleString()}원
                         </p>
                    </div>
                </div>
             </div>
             <div className="mt-8 w-full">
                <button 
                    onClick={handleCheckBeforeConfirm} 
                    className={`w-full py-4 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] hover:bg-[#D8B4FE] active:scale-[0.98]`}
                >
                   {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>정보 확인하기 <ChevronRight className="w-4 h-4" /></>
                    )}
                </button>
             </div>
          </div>

          {/* Confirm Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'confirm' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                <div className="text-center space-y-2 mb-8">
                    <h4 className="text-xl font-bold text-white">틀린 곳이 있나요?</h4>
                    <p className="text-sm text-[#C85E53] font-medium leading-relaxed">예매 확정 후에는 정보를 바꾸기 어려워요.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-xs text-gray-400">성함 / 뒷번호</span>
                        <span className="text-sm font-bold text-white">{formData.name} / {formData.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-xs text-gray-400">지인 (카테고리)</span>
                        <span className="text-sm font-bold text-white">{formData.referral}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-xs text-gray-400">예매 수량</span>
                        <span className="text-sm font-bold text-white">{formData.count}매</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-xs text-gray-400">최종 결제 금액</span>
                        <span className="text-lg font-bold text-[#C85E53]">{ (formData.count * TICKET_PRICE).toLocaleString() }원</span>
                    </div>
                </div>
             </div>
             <div className="mt-8 w-full flex gap-3">
                <button 
                  onClick={() => !isSubmitting && setReserveStage('form')} 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-zinc-800 border border-white/10 text-sm font-bold text-white rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 hover:bg-zinc-700"
                >
                  수정
                </button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting} 
                  className={`flex-1 py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl flex items-center justify-center active:scale-[0.98] transition-all relative overflow-hidden shadow-lg hover:bg-[#D8B4FE] ${!isSubmitting ? 'gap-2' : ''}`}
                >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      '확정'
                    )}
                </button>
             </div>
          </div>

          {/* Success Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'success' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center py-4">
                    <h2 className="text-2xl font-bold text-white mb-1">{(formData.count * TICKET_PRICE).toLocaleString()}원</h2>
                    <p className="text-sm text-gray-400 font-medium">1매 10,000원 × {formData.count}매</p>
                </div>
                <div className="w-full border-t border-white/10 my-2"></div>
                <div className="flex flex-col items-center text-center py-5">
                    <p className="text-sm font-bold text-white mb-2">보내는 분 이름을</p>
                    <p className="text-xl font-bold text-[#C85E53] mb-2">'{formData.name}{formData.phone}'</p>
                    <p className="text-sm font-bold text-white mb-2">로 바꿔주세요.</p>
                    <p className="text-[11px] text-gray-400 font-medium">* 위 문구와 다를 시 입금 확인이 지연될 수 있습니다.</p>
                </div>
                <div className="w-full border-t border-white/10 my-2"></div>
                <div className="flex items-center justify-between py-4 px-2">
                    <div className="space-y-1">
                        <span className="bg-[#FAE100] text-[#3B1E1E] text-[10px] font-bold px-1.5 py-0.5 rounded inline-block">국민은행</span>
                        <p className="text-xl font-bold font-mono text-white tracking-tighter mt-1">21490204079748</p>
                        <p className="text-xs text-gray-400 font-medium">예금주: 안성준</p>
                    </div>
                    <button 
                        onClick={() => { 
                            navigator.clipboard.writeText("21490204079748"); 
                            setIsCopied(true);
                            // Set hasCopied to true and hide warning
                            setHasCopied(true);
                            setShowCopyWarning(false);
                            setTimeout(() => setIsCopied(false), 2000); 
                        }}
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 group/copy"
                    >
                        {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400 group-hover/copy:text-white" />}
                    </button>
                </div>
             </div>
             <div className="mt-4 w-full">
                {showCopyWarning && (
                     <p className="text-center text-xs text-[#C85E53] font-bold mb-2 animate-pulse">
                        계좌번호 복사버튼을 먼저 눌러주세요
                     </p>
                )}
                <button onClick={() => {
                    if (hasCopied) {
                        setReserveStage('finalGuide');
                    } else {
                        setShowCopyWarning(true);
                    }
                }} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]">
                    입금 완료했어요
                </button>
             </div>
          </div>

          {/* Final Guide Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'finalGuide' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="flex-1 flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar">
                
                {/* Image Replaces Bank Box */}
                <div className="w-full flex justify-center mb-6">
                    <img 
                        src="https://i.postimg.cc/fTJ0pX42/Gemini-Generated-Image-65evuh65evuh65ev-removebg-preview.png"
                        alt="Confirmation"
                        className="w-40 h-40 object-contain drop-shadow-sm"
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">계좌 입금이 완료되었나요?</h3>
                    <p className="text-sm text-white/70 font-medium leading-relaxed">
                        입금이 확인되면 모바일 티켓을 받을 수 있어요.
                    </p>
                </div>

             </div>
             <div className="mt-8 w-full">
                <button onClick={() => setReserveStage('intro')} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]">
                    내 티켓 발급하러 가기
                </button>
             </div>
          </div>

          {/* Duplicate Error Stage - UPDATED LAYOUT */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'duplicateError' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto custom-scrollbar">
                
                {/* Image */}
                <div className="w-full flex justify-center mb-8 shrink-0">
                    <img 
                        src="https://i.postimg.cc/wMtTfXtc/Gemini-Generated-Image-hzepojhzepojhzep-removebg-preview.png"
                        alt="Notice"
                        className="w-32 h-32 object-contain drop-shadow-sm"
                    />
                </div>

                {/* User Info */}
                <div className="w-full mb-8 space-y-2 shrink-0">
                     <p className="text-xs text-gray-400 font-medium mb-1">입력하신 정보</p>
                     <p className="text-lg font-bold text-white">{formData.name} / {formData.phone} / {formData.count}매</p>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-white/10 mb-8 shrink-0"></div>

                {/* Error Message */}
                <div className="w-full shrink-0">
                    <p className="text-sm text-[#C85E53] font-bold leading-relaxed whitespace-pre-wrap">
                        이미 입력된 정보입니다.<br/>
                        수정이 필요하다면<br/>
                        010-4237-9528 로 문자주세요.
                    </p>
                </div>

             </div>
             <div className="mt-8 w-full shrink-0">
                <button onClick={() => setReserveStage('intro')} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]">
                    내 티켓 발급하러 가기
                </button>
             </div>
          </div>

          {/* Lookup Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'lookup' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none translate-x-10'}`}>
             <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/70">예매자 성함</label>
                        <input type="text" placeholder="홍길동" value={lookupData.name} onChange={(e) => setLookupData(prev => ({...prev, name: e.target.value}))} className={`w-full bg-white/5 border rounded-xl px-4 py-4 text-sm text-white focus:outline-none placeholder-gray-500 ${lookupData.name && !isLookupNameValid ? 'border-red-400' : 'border-white/10'}`} />
                        {lookupData.name && !isLookupNameValid && (
                             <p className="text-xs text-red-500 font-medium pl-1 mt-1">숫자 및 특수기호는 불가합니다</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/70">연락처 뒷번호 4자리</label>
                        <input type="tel" maxLength={4} placeholder="1234" value={lookupData.phone} onChange={(e) => setLookupData(prev => ({...prev, phone: e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white tracking-widest focus:outline-none placeholder-gray-500" />
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">입금 확인은 수동으로 진행되며, 입금 후 최대 24시간이 소요될 수 있습니다.</p>
                </div>
             </div>
             <div className="mt-8 w-full">
                <button onClick={handleLookup} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#D8B4FE] active:scale-[0.98]">
                    정보 확인하기 <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Loading Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'checkLoading' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="flex-1 flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-center gap-2">
                     <p className="text-[10px] text-white/60 font-bold tracking-[0.2em] uppercase">2026.02.14 SAT | 적옥춘 VOL.2</p>
                     <h3 className="text-2xl font-black text-white">{lookupData.name} {lookupData.phone}</h3>
                </div>
                
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>

                <div className="bg-white/5 px-6 py-3 rounded-full">
                    <p className="text-xs font-bold text-gray-400 animate-pulse">데이터를 검색 중입니다</p>
                </div>
             </div>
          </div>

          {/* Result Stage */}
          <div className={`absolute inset-0 top-32 px-10 pb-10 flex flex-col transition-all duration-500 ${reserveStage === 'result' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             {/* ADDED: overflow-y-auto to allow scrolling on small screens if content overflows, preventing button cut-off */}
             <div className="flex-1 flex flex-col items-center justify-center gap-2 overflow-y-auto custom-scrollbar">
                {lookupResult?.status === 'success' ? (
                    <>
                        <div className="w-full flex justify-center mb-1 shrink-0">
                            <img 
                                src="https://i.postimg.cc/bNxns0z7/Gemini-Generated-Image-mkkkzcmkkkzcmkkk-removebg-preview.png"
                                alt="Ticket Visual"
                                className="w-60 h-60 object-contain drop-shadow-xl"
                            />
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 shrink-0 mb-2">
                             <h4 className="text-sm font-bold tracking-widest text-white/60 uppercase">
                                2026.02.14 SAT | 적옥춘 VOL.2
                            </h4>
                            <h4 className="text-sm font-bold tracking-widest text-white/60 uppercase flex gap-3">
                                <span>{lookupResult.name}</span>
                                <span>{lookupResult.phone}</span>
                                <span>{lookupResult.count}매</span>
                            </h4>
                        </div>
                        
                        <div className="text-center shrink-0">
                            <p className="text-xs text-gray-400 font-medium bg-white/5 px-4 py-2 rounded-full">
                                본 페이지를 캡쳐하여 당일 현장 관계자에게 보여주세요
                            </p>
                        </div>
                    </>
                ) : lookupResult?.status === 'notFound' ? (
                    <div className="flex flex-col items-center gap-6 py-10 text-center">
                        <div className="w-48 h-48 flex items-center justify-center">
                            <img 
                                src="https://i.postimg.cc/HxNWBZZM/Gemini-Generated-Image-3giw863giw863giw-removebg-preview.png" 
                                alt="Not Found" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-bold text-white">정보 없음</h4>
                            <p className="text-sm text-gray-400">입력 정보를 다시 확인해주세요.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-10 text-center">
                        <div className="w-48 h-48 flex items-center justify-center">
                            <img 
                                src="https://i.postimg.cc/SRKS39FK/Gemini-Generated-Image-tpmw1stpmw1stpmw-removebg-preview.png" 
                                alt="Pending Verification" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-bold text-white">입금 확인 중입니다</h4>
                            <p className="text-sm text-gray-400">입금 내역을 확인하고 있습니다. <br/>조금만 더 기다려 주세요!</p>
                        </div>
                    </div>
                )}
             </div>
             <div className="mt-3 w-full shrink-0">
                <button onClick={() => setReserveStage('intro')} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]">
                    닫기
                </button>
             </div>
          </div>
        </div>

        {/* Card 2: Combined Info & Location Hub (Info -> Map -> Parking) */}
        {/* UPDATED: min-h increased to 640px to match reserve-card and provide more space */}
        <div id="location-card" className="order-2 md:order-1 group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[40px] p-10 overflow-hidden hover:border-white/20 transition-all duration-500 min-h-[640px] flex flex-col shadow-xl">
           
           {/* Stage 1: Info Details */}
           {/* UPDATED: Added overflow-y-auto to allow scrolling on small screens */}
           <div className={`absolute inset-0 top-0 p-10 flex flex-col transition-all duration-500 overflow-y-auto custom-scrollbar ${infoStage === 'info' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none -translate-x-10'}`}>
                {/* Header - Matches Reserve Card Style */}
                <div className="relative z-10 mb-4 flex justify-between items-start min-h-[48px] shrink-0">
                    <div className="flex-1 pr-4">
                        <h3 className="text-2xl font-bold text-[#D8B4FE] mb-1">공연 정보</h3>
                        <p className="text-sm font-medium text-gray-400">밴드 공연 | 180분</p>
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0">
                    {/* Poster Image */}
                    {/* UPDATED: Removed flex-1 to reduce excessive vertical spacing, adjusted margins */}
                    <div className="relative w-full flex items-center justify-center mb-6 mt-2">
                        <img 
                            src="https://i.postimg.cc/1zmJHPjF/Screenshot-20260120-154217-Gallery.jpg" 
                            alt="Performance Poster"
                            className="max-h-[200px] md:max-h-[260px] w-auto object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                    
                    {/* Detail Table */}
                    {/* UPDATED: Content fields to Title, Place, Date, Time */}
                    <div className="w-full shrink-0 mb-4">
                        <h4 className="text-base font-bold text-white mb-3">관람 정보</h4>
                        <div className="space-y-2 border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium w-20 shrink-0">제목</span>
                                <span className="text-sm text-white font-medium text-right">赤玉春 VOL.2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium w-20 shrink-0">장소</span>
                                <span className="text-sm text-white font-medium text-right">펄스 라이브홀</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium w-20 shrink-0">날짜</span>
                                <span className="text-sm text-white font-medium text-right">02.14 SAT</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium w-20 shrink-0">시간</span>
                                <span className="text-sm text-white font-medium text-right">16:00 - 19:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button - Go to Map */}
                <div className="mt-auto w-full shrink-0">
                    <button 
                        onClick={() => setInfoStage('map')}
                        className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]"
                    >
                        찾아오시는 길
                    </button>
                </div>
           </div>

           {/* Stage 2: Map View */}
           <div className={`absolute inset-0 top-0 p-10 flex flex-col h-full w-full transition-all duration-500 ease-in-out ${infoStage === 'map' ? 'opacity-100 translate-x-0 z-10' : (infoStage === 'info' ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-0 -translate-x-10 pointer-events-none')}`}>
              <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-xl font-bold text-[#D8B4FE]">찾아오시는 길</h3>
                  <button 
                      onClick={() => setInfoStage('info')}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  >
                      <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
              </div>
              
              <div className="relative z-10 shrink-0">
                <p className="text-sm text-white/80 leading-relaxed w-full font-medium whitespace-pre-wrap">
                  {`도로명 주소 : 서울특별시 서초구 주흥길 12 B1\n지번 주소 : 서울특별시 서초구 반포동 741 B1\n강남 교보타워 사거리 인근,\n9호선 신논현역 1번출구 도보 350m`}
                </p>
              </div>
              <div className="flex-1 w-full mt-6 mb-6 rounded-3xl overflow-hidden relative border border-white/10 bg-white/5 shadow-inner min-h-[200px]">
                 <iframe width="100%" height="100%" frameBorder="0" title="Location Map" scrolling="no" src="https://maps.google.com/maps?q=서울특별시+서초구+주흥길+12&hl=ko&z=16&output=embed" className="w-full h-full opacity-70 transition-all duration-500" />
              </div>
              <div className="w-full shrink-0">
                  <button 
                      onClick={() => setInfoStage('parking')}
                      className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                  >
                      주차 위치 확인하기
                  </button>
              </div>
          </div>

          {/* Stage 3: Parking View */}
          <div className={`absolute inset-0 top-0 p-10 flex flex-col h-full w-full transition-all duration-500 ease-in-out ${infoStage === 'parking' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
              <div className="flex items-center justify-between mb-6 shrink-0">
                  <h3 className="text-xl font-bold text-[#D8B4FE]">공영 주차장 안내</h3>
                  <button 
                      onClick={() => setInfoStage('map')}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  >
                      <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                   {/* Parking Item 1 */}
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                       <h4 className="font-bold text-white text-lg mb-1">1. 언구비 공영 주차장</h4>
                       <p className="text-xs text-[#C85E53] font-bold mb-3">공연장과 20M 거리</p>
                       <div className="space-y-1 text-sm text-white/80">
                          <p>강남대로83길 55</p>
                          <div className="flex gap-3 font-medium text-gray-400 mt-2 text-xs">
                              <span>60분 2,000원</span>
                              <div className="w-px h-3 bg-gray-600"></div>
                              <span>120분 4,000원</span>
                          </div>
                       </div>
                   </div>

                   {/* Parking Item 2 */}
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                       <h4 className="font-bold text-white text-lg mb-1">2. 방음언덕형 공영 주차장</h4>
                       <p className="text-xs text-[#C85E53] font-bold mb-3">공연장과 150M 거리</p>
                       <div className="space-y-1 text-sm text-white/80">
                          <p>주흥3길 34</p>
                          <div className="flex gap-3 font-medium text-gray-400 mt-2 text-xs">
                              <span>60분 2,000원</span>
                              <div className="w-px h-3 bg-gray-600"></div>
                              <span>120분 4,000원</span>
                          </div>
                       </div>
                   </div>
              </div>
              
              <div className="mt-6 w-full shrink-0">
                   <button onClick={() => setInfoStage('info')} className="w-full py-4 bg-[#D8B4FE]/80 backdrop-blur-md text-[#1A1A1A] text-sm font-bold rounded-xl hover:bg-[#D8B4FE] transition-all shadow-lg active:scale-[0.98]">
                      돌아가기
                   </button>
              </div>
          </div>
        </div>

        {/* Members Card - UPDATED ANIMATION */}
        <div id="members-card" className="order-4 md:order-4 group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[40px] p-10 overflow-hidden hover:border-white/20 transition-all duration-500 min-h-[500px] flex flex-col shadow-xl">
          <div className="relative z-10 mb-8">
            {/* CHANGED: text-xl -> text-2xl */}
            <h3 className="text-2xl font-bold text-[#D8B4FE] mb-6">밴드 구성원</h3>
            <div className="space-y-2 text-sm text-white/80 font-medium leading-relaxed">
              <div className="flex items-start">
                  <span className="shrink-0">보컬 -&nbsp;</span>
                  <span>강정은,고예은,공지윤,김선우,이정대,이혁준,최영훈</span>
              </div>
              <p>드럼 - 박이다,안성준,윤태훈,한지성</p>
              <p>기타 - 류보현,안성준</p>
              <p>건반 - 안소희,이주영</p>
              <p>베이스 - 강정구,이서린</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center select-none relative w-full">
              <div className="relative w-full h-full max-h-[280px] flex items-center justify-center">
                  <img 
                      src="https://i.postimg.cc/rFHrHjbM/Gemini-Generated-Image-h1kgdih1kgdih1kg-removebg-preview.png" 
                      alt="Band Illustration" 
                      className="relative z-10 w-full h-full object-contain drop-shadow-sm opacity-90 animate-float-slow"
                  />
                  {/* Shadow */}
                  <div className="absolute -bottom-2 w-[60%] h-6 bg-white/10 blur-xl rounded-[100%] z-0"></div>
              </div>
          </div>
        </div>

        {/* Playlist Card - UPDATED COLOR & ANIMATION */}
        <div id="playlist-card" className="order-5 md:order-5 group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[40px] p-10 overflow-hidden hover:border-white/20 transition-all duration-500 min-h-[500px] flex flex-col shadow-xl">
          <div className="relative z-10 w-full mb-10">
            {/* CHANGED: text-xl -> text-2xl */}
            <h3 className="text-2xl font-bold text-[#D8B4FE] mb-8">플레이 리스트</h3>
            <div className="flex flex-col gap-8 text-sm text-white/80 font-medium leading-relaxed">
              <div>
                <span className="text-white font-black text-lg block mb-2">SET.1</span>
                <p>등대</p>
                <p>FIND ME!</p>
              </div>
              <div>
                <span className="text-white font-black text-lg block mb-2">SET.2</span>
                <p>Close to you</p>
                <p>Boulevard of broken dreams</p>
                <p>Valerie</p>
                <p>Don't look back in anger</p>
                <p>타잔</p>
              </div>
              <div>
                <span className="text-white font-black text-lg block mb-2">SET.3</span>
                <p>시퍼런 봄</p>
                <p>꽃에 망령</p>
                <p>계속 웃을 순 없어!</p>
                <p>숙명</p>
              </div>
              <div>
                <span className="text-white font-black text-lg block mb-2">SET.4</span>
                <p>불꽃놀이</p>
                <p>ㅈㅣㅂ</p>
                <p>항해</p>
                <p>Drowning</p>
              </div>
            </div>
          </div>
          
          {/* PLAYER WIDGET AREA - REPLACED WITH IMAGE */}
          <div className="flex-1 flex items-center justify-center select-none relative w-full">
              <img 
                  src="https://i.postimg.cc/g02b6yzv/Gemini-Generated-Image-jg53hojg53hojg53-removebg-preview.png" 
                  alt="Playlist Illustration" 
                  className="w-full h-full object-contain max-h-[280px] drop-shadow-sm opacity-90 animate-float-slow"
              />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;