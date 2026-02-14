
import React, { useState, useEffect } from 'react';
import { Tab, GameType } from '../types.ts';

interface BaccaratGameProps {
  balance: number;
  onUpdateBalance: (a: number) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  adminOverride: 'Player' | 'Banker' | 'Tie' | null;
  onClearOverride: () => void;
  userBets: any[];
}

const BaccaratGame: React.FC<BaccaratGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab, onSound, adminOverride, onClearOverride, userBets }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<{ p: number, b: number, winner: string } | null>(null);
  const [myBet, setMyBet] = useState<{ side: string, amount: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const bettingTime = 20000;

      if (cycleTime < bettingTime) {
        setIsPlaying(false);
        setTimeLeft(Math.ceil((bettingTime - cycleTime) / 1000));
        if (cycleTime < 1000) { setResult(null); setMyBet(null); }
      } else {
        if (!isPlaying) {
          let p = Math.floor(Math.random() * 9) + 1;
          let b = Math.floor(Math.random() * 9) + 1;
          if (adminOverride === 'Player') { p = 9; b = 1; onClearOverride(); }
          else if (adminOverride === 'Banker') { p = 1; b = 9; onClearOverride(); }
          else if (adminOverride === 'Tie') { p = 5; b = 5; onClearOverride(); }

          const winner = p > b ? 'Player' : b > p ? 'Banker' : 'Tie';
          setResult({ p, b, winner });

          if (myBet && myBet.side === winner) {
            // PROFIT CAP: Tie is 5x
            const mult = winner === 'Tie' ? 5 : 2;
            onUpdateBalance(myBet.amount * mult);
            onSound('win');
          } else if (myBet) { onSound('loss'); }
        }
        setIsPlaying(true);
        setTimeLeft(Math.ceil((periodDuration - cycleTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, myBet, adminOverride, onSound, onClearOverride, onUpdateBalance]);

  const placeBet = (side: string) => {
    if (!hasAccess || isPlaying || myBet || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setMyBet({ side, amount: bet });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-24">
      <div className="p-4 space-y-6">
        <div className="h-64 bg-gray-50 rounded-[2.5rem] relative overflow-hidden shadow-inner flex flex-col items-center justify-center border border-gray-100">
          <div className="flex justify-around w-full px-8">
             <div className="text-center space-y-2">
                <div className={`w-20 h-28 bg-white rounded-xl flex items-center justify-center text-3xl font-black text-blue-600 border-2 border-blue-400 shadow-sm ${result ? 'animate-in zoom-in' : 'opacity-20'}`}>{result ? result.p : '?'}</div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Player</p>
             </div>
             <div className="text-center pt-8">
                <p className="text-2xl font-black text-gray-200 font-orbitron">VS</p>
                {!result && <p className="text-xs font-black text-blue-500 animate-pulse mt-2">{timeLeft}s</p>}
             </div>
             <div className="text-center space-y-2">
                <div className={`w-20 h-28 bg-white rounded-xl flex items-center justify-center text-3xl font-black text-red-600 border-2 border-red-400 shadow-sm ${result ? 'animate-in zoom-in' : 'opacity-20'}`}>{result ? result.b : '?'}</div>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Banker</p>
             </div>
          </div>
          {result && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in">
               <p className="text-4xl font-black font-orbitron text-blue-600 uppercase italic shadow-2xl">{result.winner} Wins!</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-xl">
           <div className="grid grid-cols-3 gap-2">
              <button disabled={isPlaying} onClick={() => placeBet('Player')} className={`py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${myBet?.side === 'Player' ? 'bg-blue-600 border-white text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>Player (2x)</button>
              <button disabled={isPlaying} onClick={() => placeBet('Tie')} className={`py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${myBet?.side === 'Tie' ? 'bg-purple-600 border-white text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>Tie (5x)</button>
              <button disabled={isPlaying} onClick={() => placeBet('Banker')} className={`py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${myBet?.side === 'Banker' ? 'bg-red-600 border-white text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>Banker (2x)</button>
           </div>
           <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <button disabled={isPlaying} onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black text-blue-600">-</button>
              <div className="text-center"><p className="text-[8px] text-gray-400 font-black">STAKE</p><p className="text-lg font-black font-orbitron text-blue-600">🪙 {bet}</p></div>
              <button disabled={isPlaying} onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl font-black text-blue-600">+</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BaccaratGame;
