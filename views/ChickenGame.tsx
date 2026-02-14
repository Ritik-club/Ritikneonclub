
import React, { useState } from 'react';
import { Tab, GameType } from '../types.ts';

interface ChickenGameProps {
  balance: number;
  onUpdateBalance: (a: number) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  adminOverride: number | null;
  onClearOverride: () => void;
  userBets: any[];
}

const ChickenGame: React.FC<ChickenGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab, adminOverride, onClearOverride, userBets }) => {
  const [bet, setBet] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLane, setCurrentLane] = useState(-1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  
  // PROFIT CAP: Max 5x
  const multipliers = [1.20, 1.80, 2.50, 3.80, 5.0];

  const handlePlay = () => {
    if (balance < bet || isPlaying) return;
    onUpdateBalance(-bet);
    setIsPlaying(true);
    setGameOver(false);
    setWon(false);
    setCurrentLane(-1);
  };

  const step = (idx: number) => {
    if (!isPlaying || idx !== currentLane + 1) return;
    
    const isSafe = adminOverride === null ? Math.random() > 0.4 : idx < adminOverride;
    if (adminOverride !== null && idx >= adminOverride) onClearOverride();

    if (isSafe) {
      setCurrentLane(idx);
      if (idx === multipliers.length - 1) {
        onUpdateBalance(bet * multipliers[idx]);
        setWon(true);
        setIsPlaying(false);
      }
    } else {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const cashout = () => {
    if (!isPlaying || currentLane < 0) return;
    onUpdateBalance(bet * multipliers[currentLane]);
    setWon(true);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-24">
      <div className="relative h-96 bg-gray-100 m-2 rounded-3xl border border-gray-200 overflow-hidden flex flex-row items-center p-4 gap-4 shadow-inner">
         <div className="w-20 h-full bg-gray-200 border-r border-gray-300 flex items-center justify-center">
            {currentLane === -1 && <span className="text-4xl animate-bounce">🐥</span>}
         </div>
         <div className="flex-1 flex flex-row justify-around h-full items-center">
            {multipliers.map((m, i) => (
              <button 
                key={i} 
                onClick={() => step(i)}
                disabled={!isPlaying || i !== currentLane + 1}
                className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${
                  currentLane >= i ? 'bg-blue-600 border-blue-400 shadow-md text-white' : i === currentLane+1 ? 'bg-white border-blue-500 border-dashed animate-pulse' : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                 {currentLane === i ? <span className="text-3xl">🐥</span> : <span className="text-[10px] font-black uppercase">{m}x</span>}
              </button>
            ))}
         </div>

         {gameOver && (
           <div className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center animate-in zoom-in text-white">
             <p className="text-4xl font-black font-orbitron">CRASHED!</p>
             <button onClick={() => setGameOver(false)} className="mt-4 bg-white text-red-500 px-6 py-2 rounded-full font-black uppercase text-[10px]">Retry</button>
           </div>
         )}
      </div>

      <div className="p-4 bg-white mx-2 rounded-[2rem] border border-gray-100 space-y-4 shadow-xl mt-4">
         <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <button disabled={isPlaying} onClick={() => setBet(Math.max(1, bet-1))} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black">-</button>
            <div className="flex-1 text-center font-orbitron font-black text-sm text-blue-600">{bet.toFixed(2)} INR</div>
            <button disabled={isPlaying} onClick={() => setBet(bet+1)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black">+</button>
         </div>

         {isPlaying ? (
           <button onClick={cashout} disabled={currentLane < 0} className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-black text-xl uppercase shadow-xl shadow-orange-100">
             Cash Out {(bet * (currentLane >= 0 ? multipliers[currentLane] : 0)).toFixed(2)}
           </button>
         ) : (
           <button onClick={handlePlay} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl uppercase shadow-xl shadow-blue-100">Play Round</button>
         )}
      </div>
    </div>
  );
};

export default ChickenGame;
