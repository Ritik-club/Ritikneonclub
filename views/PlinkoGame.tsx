
import React, { useState } from 'react';
import { Tab, GameType } from '../types.ts';

interface PlinkoGameProps {
  balance: number;
  onUpdateBalance: (a: number) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  adminOverride: number | null;
  onClearOverride: () => void;
  userBets: any[];
}

const PlinkoGame: React.FC<PlinkoGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab, onSound, adminOverride, onClearOverride, userBets }) => {
  const [bet, setBet] = useState(10);
  const [isDropping, setIsDropping] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  // PROFIT CAP: Range 0.2x to 5.0x
  const multipliers = [5.0, 4.0, 3.0, 2.0, 1.5, 0.5, 0.2, 0.5, 1.5, 2.0, 3.0, 4.0, 5.0];

  const handleDrop = () => {
    if (!hasAccess || isDropping || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setIsDropping(true);
    setResult(null);

    const finalBucket = adminOverride !== null ? adminOverride : Math.floor(Math.random() * multipliers.length);
    if (adminOverride !== null) onClearOverride();

    setTimeout(() => {
      const win = bet * multipliers[finalBucket];
      onUpdateBalance(win);
      setResult(multipliers[finalBucket]);
      setIsDropping(false);
      onSound(win >= bet ? 'win' : 'loss');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-24">
      <div className="p-4 space-y-6">
        <div className="h-96 bg-gray-50 rounded-[2.5rem] relative overflow-hidden border border-gray-100 shadow-inner flex flex-col items-center p-4">
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 relative">
             <div className={`w-6 h-6 bg-blue-600 rounded-full shadow-lg ${isDropping ? 'animate-bounce' : ''}`}></div>
             <div className="grid grid-cols-13 gap-1 w-full mt-auto">
                {multipliers.map((m, i) => (
                  <div key={i} className={`h-12 flex flex-col items-center justify-center rounded-lg text-[7px] font-black border transition-all ${m >= 2 ? 'bg-blue-600 text-white border-blue-400' : 'bg-white text-gray-400 border-gray-100'}`}>
                     <span>{m}x</span>
                  </div>
                ))}
             </div>
          </div>
          {result !== null && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in zoom-in">
               <p className={`text-6xl font-black font-orbitron ${result >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>{result}x</p>
               <button onClick={() => setResult(null)} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase shadow-lg shadow-blue-100">Drop Again</button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-xl">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <button disabled={isDropping} onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black">-</button>
            <div className="text-center"><p className="text-[8px] text-gray-400 font-black uppercase">Bet</p><p className="text-lg font-black font-orbitron text-blue-600">🪙 {bet}</p></div>
            <button disabled={isDropping} onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black">+</button>
          </div>
          <button onClick={handleDrop} disabled={isDropping} className="w-full py-5 rounded-3xl font-black text-lg uppercase bg-blue-600 text-white shadow-xl shadow-blue-100 active:scale-95 transition-all">Drop Ball</button>
        </div>
      </div>
      <style>{`.grid-cols-13 { grid-template-columns: repeat(13, minmax(0, 1fr)); }`}</style>
    </div>
  );
};

export default PlinkoGame;
