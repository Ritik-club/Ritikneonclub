
import React, { useState } from 'react';
import { Tab, GameType } from '../types.ts';

interface PenaltyGameProps {
  balance: number;
  onUpdateBalance: (a: number) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  adminOverride: 'Goal' | 'Save' | null;
  onClearOverride: () => void;
  userBets: any[];
}

const PenaltyGame: React.FC<PenaltyGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab, onSound, adminOverride, onClearOverride, userBets }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<'GOAL' | 'SAVE' | null>(null);
  const [target, setTarget] = useState<number | null>(null);

  const handleShoot = (idx: number) => {
    if (!hasAccess || isPlaying || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setIsPlaying(true);
    setTarget(idx);
    setResult(null);

    setTimeout(() => {
      let isGoal: boolean;
      if (adminOverride === 'Goal') { isGoal = true; onClearOverride(); }
      else if (adminOverride === 'Save') { isGoal = false; onClearOverride(); }
      else { isGoal = Math.random() < 0.15; }

      if (isGoal) {
        onSound('win');
        onUpdateBalance(bet * 3.8);
        setResult('GOAL');
      } else {
        onSound('loss');
        setResult('SAVE');
      }
      setIsPlaying(false);
    }, 1000);
  };

  const myGameBets = userBets.filter(b => b.game === GameType.PENALTY).slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-[#11131a] overflow-y-auto no-scrollbar pb-24">
      <div className="p-4 space-y-6">
        <div className="h-72 bg-gradient-to-b from-blue-900 to-emerald-900 rounded-[2.5rem] relative overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
          <div className="w-64 h-48 border-4 border-white border-b-0 rounded-t-lg relative">
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <button 
                    key={i} onClick={() => handleShoot(i)}
                    disabled={isPlaying}
                    className={`flex items-center justify-center transition-all ${isPlaying && target === i ? 'scale-125' : 'hover:bg-white/5'}`}
                  >
                     {target === i && <span className="text-3xl animate-bounce">⚽</span>}
                  </button>
                ))}
             </div>
          </div>
          {result && (
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 animate-in zoom-in">
                <p className={`text-6xl font-black font-orbitron uppercase italic tracking-tighter ${result === 'GOAL' ? 'text-green-500 win-glow' : 'text-red-500 animate-shake'}`}>{result}!</p>
                <button onClick={() => { setResult(null); setTarget(null); }} className="mt-6 bg-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase">Try Again</button>
             </div>
          )}
        </div>

        <div className="bg-[#1e2330] p-6 rounded-[2.5rem] border border-white/5 space-y-6">
          {!hasAccess ? (
             <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Kick</button>
          ) : (
             <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                <button onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white/5 rounded-xl font-black">-</button>
                <div className="text-center"><p className="text-[8px] text-gray-600 font-black">BET</p><p className="text-lg font-black font-orbitron">🪙 {bet}</p></div>
                <button onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white/5 rounded-xl font-black">+</button>
             </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
         <h3 className="text-xs font-black font-orbitron text-gray-600 uppercase tracking-widest px-2">Shootout History</h3>
         <div className="bg-[#1e2330] rounded-2xl overflow-hidden border border-white/5">
            {myGameBets.map(b => (
              <div key={b.id} className="p-4 border-b border-white/5 flex justify-between items-center text-[10px] font-black">
                 <div><p className="text-gray-400">{b.id}</p><p className="text-[8px] text-gray-600 uppercase">{new Date(b.timestamp).toLocaleTimeString()}</p></div>
                 <div className="text-right">
                    <p className={b.status === 'Win' ? 'text-green-500' : 'text-red-500'}>{b.status === 'Win' ? `GOAL (+${b.payout})` : 'SAVED'}</p>
                 </div>
              </div>
            ))}
            {myGameBets.length === 0 && <p className="p-10 text-center text-[9px] text-gray-700 uppercase font-black">Stadium Empty</p>}
         </div>
      </div>
    </div>
  );
};

export default PenaltyGame;
