
import React, { useState, useEffect } from 'react';

interface AdOverlayProps {
  onClose: () => void;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#1e2330] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="p-4 bg-blue-600/10 border-b border-white/5 flex justify-between items-center">
           <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Sponsored Advertisement</span>
           <button 
             disabled={timeLeft > 0}
             onClick={onClose}
             className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
               timeLeft > 0 ? 'bg-white/5 text-gray-500' : 'bg-white/20 text-white hover:bg-white/30'
             }`}
           >
             {timeLeft > 0 ? timeLeft : '×'}
           </button>
        </div>

        <div className="aspect-video bg-neutral-900 flex items-center justify-center relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
           <div className="text-center space-y-4 p-6 z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg border border-white/5">
                🎰
              </div>
              <div>
                <h3 className="text-lg font-bold font-orbitron">Win Big at Ritik!</h3>
                <p className="text-xs text-gray-400">Join 100k+ players predicting now.</p>
              </div>
              <button className="bg-blue-600 px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-900/40">Install Now</button>
           </div>
        </div>

        <div className="p-6 space-y-3">
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${(5 - timeLeft) * 20}%` }}
              ></div>
           </div>
           <p className="text-[9px] text-gray-500 text-center uppercase font-bold tracking-widest">Ad supports Ritik Club Demo Server</p>
        </div>
      </div>
    </div>
  );
};

export default AdOverlay;
