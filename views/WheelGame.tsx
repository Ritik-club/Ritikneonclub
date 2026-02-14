
import React, { useState } from 'react';
import { Tab, GameType } from '../types.ts';

interface WheelGameProps {
  balance: number;
  onUpdateBalance: (a: number) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  adminOverride: number | null;
  onClearOverride: () => void;
  userBets: any[];
}

const WheelGame: React.FC<WheelGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab, onSound, adminOverride, onClearOverride, userBets }) => {
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  // PROFIT CAP: Max 5x
  const segments = [0, 0, 1.2, 0, 2.0, 3.5, 0, 5.0]; 

  const handleSpin = () => {
    if (!hasAccess || isSpinning || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setIsSpinning(true);
    setResult(null);

    const targetIdx = adminOverride !== null ? adminOverride : Math.floor(Math.random() * segments.length);
    const newRotation = rotation + (360 * 5) + (targetIdx * 45);
    setRotation(newRotation);
    if (adminOverride !== null) onClearOverride();

    setTimeout(() => {
      const win = bet * segments[targetIdx];
      onUpdateBalance(win);
      setResult(segments[targetIdx]);
      setIsSpinning(false);
      onSound(win >= bet ? 'win' : 'loss');
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-24">
      <div className="h-80 bg-gray-50 m-2 rounded-[2.5rem] relative overflow-hidden border border-gray-100 shadow-inner flex items-center justify-center">
        <div className="relative w-64 h-64">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-blue-600 rounded-full shadow-lg z-20 -mt-2"></div>
           <div 
             className="w-full h-full rounded-full border-8 border-white transition-all duration-[4s] ease-out relative shadow-xl"
             style={{ 
               transform: `rotate(${rotation}deg)`, 
               background: 'conic-gradient(#3b82f6 0deg 45deg, #f1f5f9 45deg 90deg, #3b82f6 90deg 135deg, #f1f5f9 135deg 180deg, #ef4444 180deg 225deg, #f1f5f9 225deg 270deg, #eab308 270deg 315deg, #f1f5f9 315deg 360deg)' 
             }}
           >
              {segments.map((s, i) => (
                <div key={i} className={`absolute top-0 left-1/2 -translate-x-1/2 h-1/2 pt-4 origin-bottom font-black text-[10px] ${s === 0 ? 'text-red-500' : 'text-blue-900'}`} style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}>
                   {s === 0 ? '0x' : s+'x'}
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="p-6 bg-white mx-2 rounded-3xl space-y-4 shadow-xl border border-gray-100 mt-4">
         <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <button disabled={isSpinning} onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black text-blue-600">－</button>
            <span className="text-xl font-orbitron font-black text-blue-600">🪙 {bet}</span>
            <button disabled={isSpinning} onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black text-blue-600">＋</button>
         </div>
         <button onClick={handleSpin} disabled={isSpinning} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all">Spin Lucky Wheel</button>
      </div>
    </div>
  );
};

export default WheelGame;
