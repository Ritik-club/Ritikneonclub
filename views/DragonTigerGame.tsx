
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface DragonTigerGameProps {
  balance: number;
  adminOverride: 'Dragon' | 'Tiger' | 'Tie' | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
}

const DragonTigerGame: React.FC<DragonTigerGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab, onSound }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDrawPhase, setIsDrawPhase] = useState(false);
  const [result, setResult] = useState<{ d: number, t: number, winner: string } | null>(null);
  const [bet, setBet] = useState(10);
  const [myBet, setMyBet] = useState<{ side: string, amount: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const bettingTime = 22000;

      if (cycleTime < bettingTime) {
        setIsDrawPhase(false);
        setTimeLeft(Math.ceil((bettingTime - cycleTime) / 1000));
        if (cycleTime < 1000) {
          setResult(null);
          setMyBet(null);
        }
      } else {
        if (!isDrawPhase) {
          let d = Math.floor(Math.random() * 13) + 1;
          let t = Math.floor(Math.random() * 13) + 1;
          
          if (adminOverride === 'Dragon') { d = 13; t = 1; onClearOverride(); }
          else if (adminOverride === 'Tiger') { d = 1; t = 13; onClearOverride(); }
          else if (adminOverride === 'Tie') { d = 7; t = 7; onClearOverride(); }

          const winner = d > t ? 'Dragon' : t > d ? 'Tiger' : 'Tie';
          setResult({ d, t, winner });

          if (myBet && myBet.side === winner) {
            const mult = winner === 'Tie' ? 9 : 2;
            onUpdateBalance(myBet.amount * mult);
          }
        }
        setIsDrawPhase(true);
        setTimeLeft(Math.ceil((periodDuration - cycleTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDrawPhase, myBet, adminOverride]);

  const placeBet = (side: string) => {
    if (!hasAccess || isDrawPhase || myBet || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setMyBet({ side, amount: bet });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="h-64 bg-gradient-to-br from-red-900 to-amber-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col">
        <div className="flex-1 flex items-center justify-around px-4">
           {/* Dragon Card */}
           <div className="flex flex-col items-center gap-2">
              <div className={`w-24 h-36 rounded-xl border-2 flex items-center justify-center text-4xl font-black card-flip ${result ? 'flipped bg-white text-red-600 border-red-400' : 'bg-red-800/40 border-red-500/20 text-red-500/20'}`} style={{ perspective: '1000px' }}>
                <span className="drop-shadow-lg">{result ? result.d : '?'}</span>
              </div>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Dragon</p>
           </div>

           <div className="text-center">
              <p className="text-2xl font-black text-yellow-500 font-orbitron italic drop-shadow-lg">VS</p>
              <p className={`text-[10px] font-black transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white/30'}`}>{timeLeft}s</p>
           </div>

           {/* Tiger Card */}
           <div className="flex flex-col items-center gap-2">
              <div className={`w-24 h-36 rounded-xl border-2 flex items-center justify-center text-4xl font-black card-flip ${result ? 'flipped bg-white text-orange-600 border-orange-400' : 'bg-orange-800/40 border-orange-500/20 text-orange-500/20'}`} style={{ perspective: '1000px' }}>
                <span className="drop-shadow-lg">{result ? result.t : '?'}</span>
              </div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Tiger</p>
           </div>
        </div>
        {result && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 animate-in zoom-in">
              <p className="text-4xl font-black font-orbitron text-yellow-500 uppercase italic tracking-tighter drop-shadow-2xl win-glow px-6 py-2 rounded-2xl">{result.winner} Wins!</p>
           </div>
        )}
      </div>

      <div className="bg-[#1e2330] p-6 rounded-[2.5rem] border border-white/5 space-y-6">
        {!hasAccess ? (
           <button onClick={() => { onSound('click'); setTab(Tab.WALLET); }} className="w-full py-4 bg-red-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 for Card Battles</button>
        ) : (
           <>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => placeBet('Dragon')} className={`py-4 rounded-xl font-black text-xs uppercase border active:scale-95 transition-all ${myBet?.side === 'Dragon' ? 'bg-red-600 border-white win-glow' : 'bg-red-600/10 border-red-500/20 text-red-500'}`}>Dragon (2x)</button>
                <button onClick={() => placeBet('Tie')} className={`py-4 rounded-xl font-black text-xs uppercase border active:scale-95 transition-all ${myBet?.side === 'Tie' ? 'bg-amber-600 border-white win-glow' : 'bg-amber-600/10 border-amber-500/20 text-amber-500'}`}>Tie (9x)</button>
                <button onClick={() => placeBet('Tiger')} className={`py-4 rounded-xl font-black text-xs uppercase border active:scale-95 transition-all ${myBet?.side === 'Tiger' ? 'bg-orange-600 border-white win-glow' : 'bg-orange-600/10 border-orange-500/20 text-orange-500'}`}>Tiger (2x)</button>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                <button onClick={() => { onSound('click'); setBet(Math.max(10, bet-10)); }} className="w-10 h-10 bg-white/5 rounded-xl font-black active:scale-75 transition-transform">-</button>
                <div className="text-center"><p className="text-[8px] text-gray-600 font-black">STAKE</p><p className="text-lg font-black font-orbitron">🪙 {bet}</p></div>
                <button onClick={() => { onSound('click'); setBet(bet+10); }} className="w-10 h-10 bg-white/5 rounded-xl font-black active:scale-75 transition-transform">+</button>
              </div>
           </>
        )}
      </div>
    </div>
  );
};

export default DragonTigerGame;
