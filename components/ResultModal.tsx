
import React, { useEffect, useState } from 'react';
import { GameResult } from '../types.ts';
import { COLOR_CONFIG } from '../constants.tsx';

interface ResultModalProps {
  result: GameResult | null;
  userProfit: number;
  hasBet: boolean;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, userProfit, hasBet, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (result && hasBet) {
      setShow(true);
      // Changed duration to 3000ms (3 seconds)
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result, hasBet, onClose]);

  if (!result || !hasBet) return null;

  const mainColor = result.colors[0] as keyof typeof COLOR_CONFIG;
  const colorData = COLOR_CONFIG[mainColor];
  const isWin = userProfit > 0;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center px-6 transition-all duration-300 ${show ? 'bg-black/80 backdrop-blur-md opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
      <div className={`w-full max-w-sm bg-[#1e2330] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-500 transform ${show ? 'scale-100 translate-y-0' : 'scale-75 translate-y-20'} ${!isWin ? 'animate-loss-result' : ''}`}>
        
        {/* Header Section */}
        <div className={`py-10 text-center relative ${isWin ? 'bg-gradient-to-b from-green-600/20 to-transparent' : 'bg-gradient-to-b from-red-600/20 to-transparent'}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-9xl font-black italic uppercase">{isWin ? 'WIN' : 'LOSS'}</span>
          </div>
          
          <h2 className={`text-4xl font-black font-orbitron italic tracking-tighter mb-2 ${isWin ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-red-500'}`}>
            {isWin ? 'CONGRATS!' : 'BET FAILED'}
          </h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Period: {result.period}</p>
        </div>

        {/* Draw Result Ball */}
        <div className="flex flex-col items-center pb-10 px-8">
           <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl font-black text-white shadow-2xl mb-8 relative border-4 border-white/20 ${colorData.bg}`}>
              <div className="absolute -inset-4 bg-inherit rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <span className="relative z-10 drop-shadow-2xl">{result.number}</span>
           </div>

           <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Color</p>
                 <div className="flex justify-center gap-1">
                   {result.colors.map(c => (
                     <div key={c} className={`w-4 h-4 rounded-full ${COLOR_CONFIG[c as keyof typeof COLOR_CONFIG].bg}`}></div>
                   ))}
                 </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Size</p>
                 <p className="text-sm font-black text-blue-400 uppercase">{result.bigSmall}</p>
              </div>
           </div>

           {isWin ? (
             <div className="w-full bg-green-500 py-4 rounded-2xl text-center shadow-xl shadow-green-900/40 animate-bounce">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Total Payout</p>
                <p className="text-2xl font-black font-orbitron">🪙 {userProfit.toLocaleString()}</p>
             </div>
           ) : (
             <div className="w-full bg-red-500/10 border border-red-500/20 py-4 rounded-2xl text-center">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Better luck next time</p>
                <p className="text-lg font-black font-orbitron text-white">LOST ROUND</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
