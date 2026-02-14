
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface D5GameProps {
  balance: number;
  adminOverride: number[] | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
}

const D5Game: React.FC<D5GameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab, onSound }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDrawPhase, setIsDrawPhase] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [bet, setBet] = useState(10);
  const [myBet, setMyBet] = useState<{ type: string, amount: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const bettingTime = 20000;

      if (cycleTime < bettingTime) {
        setIsDrawPhase(false);
        setTimeLeft(Math.ceil((bettingTime - cycleTime) / 1000));
        if (cycleTime < 1000) setMyBet(null);
      } else {
        if (!isDrawPhase) {
          let n: number[];
          if (adminOverride) { n = adminOverride; onClearOverride(); }
          else { n = Array(5).fill(0).map(() => Math.floor(Math.random() * 10)); }
          
          setNumbers(n);
          onSound('win');
          const sum = n.reduce((a, b) => a + b, 0);
          const isBig = sum >= 23;
          const isOdd = sum % 2 !== 0;

          if (myBet) {
             if ((myBet.type === 'Big' && isBig) || (myBet.type === 'Small' && !isBig) || (myBet.type === 'Odd' && isOdd) || (myBet.type === 'Even' && !isOdd)) {
               onUpdateBalance(myBet.amount * 1.96);
             }
          }
        }
        setIsDrawPhase(true);
        setTimeLeft(Math.ceil((periodDuration - cycleTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDrawPhase, myBet, adminOverride, onSound]);

  const placeBet = (type: string) => {
    if (!hasAccess || isDrawPhase || myBet || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    setMyBet({ type, amount: bet });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-cyan-900 to-blue-950 p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between gap-2 mb-6">
          {numbers.map((n, i) => (
            <div key={i} className={`flex-1 aspect-[2/3] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl font-black font-orbitron transition-all duration-700 ${isDrawPhase ? 'text-cyan-400 scale-110' : 'text-white/20'}`}>
              {isDrawPhase ? n : '?'}
            </div>
          ))}
        </div>
        <div className="text-center">
           <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-1">{isDrawPhase ? 'TOTAL SUM' : 'NEXT DRAW'}</p>
           <p className="text-4xl font-black font-orbitron">{isDrawPhase ? numbers.reduce((a,b)=>a+b,0) : timeLeft+'s'}</p>
        </div>
      </div>

      <div className="bg-[#1e2330] p-6 rounded-[2.5rem] border border-white/5 space-y-6">
        {!hasAccess ? (
           <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-cyan-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 for 5D Lottery</button>
        ) : (
           <>
              <div className="grid grid-cols-2 gap-3">
                {['Big', 'Small', 'Odd', 'Even'].map(t => (
                  <button key={t} onClick={() => placeBet(t)} className={`py-4 rounded-xl font-black text-xs uppercase border transition-all active:scale-95 ${myBet?.type === t ? 'bg-cyan-600 border-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>{t}</button>
                ))}
              </div>
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                <button onClick={() => { onSound('click'); setBet(Math.max(10, bet-10)); }} className="w-10 h-10 bg-white/5 rounded-xl font-black active:scale-75">-</button>
                <div className="text-center"><p className="text-[8px] text-gray-600 font-black">STAKE</p><p className="text-lg font-black font-orbitron">🪙 {bet}</p></div>
                <button onClick={() => { onSound('click'); setBet(bet+10); }} className="w-10 h-10 bg-white/5 rounded-xl font-black active:scale-75">+</button>
              </div>
           </>
        )}
      </div>
    </div>
  );
};

export default D5Game;
