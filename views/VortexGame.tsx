
import React, { useState, useEffect } from 'react';
import { Tab, GameType } from '../types.ts';

interface VortexGameProps {
  balance: number;
  adminOverride: number | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  userBets: any[];
}

const VortexGame: React.FC<VortexGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab, userBets }) => {
  const [bet, setBet] = useState(5.00);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [payout, setPayout] = useState(0);
  const [checking, setChecking] = useState(false);

  // Multipliers limited to 5x with 0x segments
  const multipliers = [0, 1.2, 0, 1.8, 0, 2.5, 0, 3.2, 5.0];

  const handleSpin = () => {
    if (balance < bet || isSpinning) return;
    onUpdateBalance(-bet);
    setIsSpinning(true);
    setPayout(0);
    setChecking(true);

    const targetIdx = adminOverride !== null ? adminOverride : Math.floor(Math.random() * multipliers.length);
    const newRotation = rotation + (360 * 8) + (targetIdx * (360 / multipliers.length));
    setRotation(newRotation);
    if (adminOverride !== null) onClearOverride();

    setTimeout(() => {
      setIsSpinning(false);
      setChecking(false);
      const win = bet * multipliers[targetIdx];
      setPayout(win);
      if (win > 0) onUpdateBalance(win);
    }, 4000);
  };

  const myGameBets = userBets.filter(b => b.game === GameType.VORTEX).slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] overflow-y-auto no-scrollbar pb-24">
      {/* Vortex Header */}
      <div className="flex justify-between p-4 border-b border-white/5 items-center bg-[#11131a]">
         <span className="font-orbitron font-black text-xs text-yellow-500 tracking-tighter">🪙 {balance.toFixed(2)} INR</span>
         <div className="flex gap-4 text-gray-500">
            <span className="text-xl">🛡️</span>
            <span className="text-xl">🔊</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 relative">
         <div className="text-center">
            <h1 className="font-orbitron font-black text-3xl tracking-[0.2em] text-purple-600 drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]">VORTEX</h1>
            <p className="text-[7px] font-black text-gray-600 uppercase tracking-[0.5em] mt-1">PRO SERIES V2</p>
         </div>

         {/* Spin-Check Icon */}
         <div className={`text-4xl transition-all duration-500 ${checking ? 'animate-bounce opacity-100' : 'opacity-20'}`}>
            ⬇️
         </div>

         {/* Concentric Dark Boards */}
         <div className="relative w-72 h-72 rounded-full border-[12px] border-[#1e2330] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent"></div>
            
            <div 
              className="w-full h-full rounded-full transition-all duration-[4s] cubic-bezier(0.15, 0, 0.15, 1) flex items-center justify-center"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
               {multipliers.map((m, i) => (
                 <div key={i} className="absolute top-0 h-1/2 origin-bottom font-black text-[10px] pt-4" style={{ transform: `rotate(${i * (360/multipliers.length)}deg)` }}>
                   <span className={m === 0 ? 'text-red-500 opacity-80' : 'text-purple-400'}>{m}x</span>
                 </div>
               ))}
               
               {/* Decorative Inner Rings */}
               <div className="w-[85%] h-[85%] border border-white/5 rounded-full absolute"></div>
               <div className="w-[65%] h-[65%] border border-white/5 rounded-full absolute"></div>
               
               <div className="w-20 h-20 bg-[#1e2330] rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/10 z-10">
                  <span className="text-3xl animate-pulse">🌀</span>
               </div>
            </div>
         </div>
      </div>

      {/* Control Deck */}
      <div className="p-6 bg-[#11131a] rounded-t-[3rem] border-t border-white/5 space-y-6">
         <div className="flex justify-center items-center gap-6">
            <button onClick={() => setBet(Math.max(1, bet-5))} className="w-12 h-12 bg-[#1e2330] rounded-full flex items-center justify-center text-xl font-black text-gray-400 active:scale-90 transition-transform">－</button>
            <div className="text-center min-w-[120px]">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Stake</p>
               <p className="text-xl font-black font-orbitron text-white">{bet.toFixed(2)}</p>
            </div>
            <button onClick={() => setBet(bet+5)} className="w-12 h-12 bg-[#1e2330] rounded-full flex items-center justify-center text-xl font-black text-gray-400 active:scale-90 transition-transform">＋</button>
         </div>

         <div className="grid grid-cols-3 gap-4 items-center">
            <button className="flex flex-col items-center gap-1 opacity-40">
               <span className="text-xl">💰</span>
               <span className="text-[7px] font-black uppercase">Auto Cash</span>
            </button>
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`h-20 w-20 mx-auto rounded-full bg-gradient-to-b from-purple-500 to-indigo-700 p-1 shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all ${isSpinning ? 'grayscale' : ''}`}
            >
               <div className="w-full h-full rounded-full bg-[#1e2330] flex items-center justify-center border border-white/10">
                  <span className="text-2xl">{isSpinning ? '⏳' : 'SPIN'}</span>
               </div>
            </button>
            <button className="flex flex-col items-center gap-1 opacity-40">
               <span className="text-xl">📊</span>
               <span className="text-[7px] font-black uppercase">Stats</span>
            </button>
         </div>

         <div className="flex justify-between items-center px-4 py-3 bg-black/20 rounded-2xl border border-white/5">
            <div><p className="text-[8px] font-black text-gray-600 uppercase">Last Win</p><p className="text-sm font-black font-orbitron text-green-500">{payout > 0 ? `+${payout.toFixed(2)}` : '0.00'}</p></div>
            <div className="text-right"><p className="text-[8px] font-black text-gray-600 uppercase">Mode</p><p className="text-xs font-black text-purple-500 uppercase">Standard</p></div>
         </div>
      </div>

      {/* Embedded Ledger */}
      <div className="p-4 space-y-4">
         <h3 className="text-xs font-black font-orbitron text-gray-600 uppercase tracking-widest px-2">Vortex Records</h3>
         <div className="bg-[#1e2330] rounded-2xl overflow-hidden border border-white/5">
            {myGameBets.map(b => (
              <div key={b.id} className="p-4 border-b border-white/5 flex justify-between items-center text-[10px] font-black">
                 <div><p className="text-gray-400">{b.id}</p><p className="text-[8px] text-gray-600 uppercase">{new Date(b.timestamp).toLocaleTimeString()}</p></div>
                 <div className="text-right">
                    <p className={b.status === 'Win' ? 'text-green-500' : 'text-red-500'}>{b.status === 'Win' ? `+${b.payout}` : 'LOSS'}</p>
                 </div>
              </div>
            ))}
            {myGameBets.length === 0 && <p className="p-8 text-center text-[9px] text-gray-600 uppercase font-black">No Recent Records</p>}
         </div>
      </div>
    </div>
  );
};

export default VortexGame;
