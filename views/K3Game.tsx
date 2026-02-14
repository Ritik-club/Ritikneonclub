
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface K3GameProps {
  balance: number;
  adminOverride: number[] | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const K3Game: React.FC<K3GameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDrawPhase, setIsDrawPhase] = useState(false);
  const [dice, setDice] = useState<number[]>([1, 1, 1]);
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
          let d: number[];
          if (adminOverride) { d = adminOverride; onClearOverride(); }
          else { d = [Math.floor(Math.random()*6)+1, Math.floor(Math.random()*6)+1, Math.floor(Math.random()*6)+1]; }
          
          setDice(d);
          const sum = d.reduce((a, b) => a + b, 0);
          const isBig = sum >= 11;
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
  }, [isDrawPhase, myBet, adminOverride]);

  const placeBet = (type: string) => {
    if (!hasAccess || isDrawPhase || myBet || balance < bet) return;
    onUpdateBalance(-bet);
    setMyBet({ type, amount: bet });
  };

  const getDiceIcon = (val: number) => ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][val - 1];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="h-56 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-[2.5rem] border border-purple-500/20 flex flex-col items-center justify-center relative shadow-2xl">
        <div className="flex gap-4 mb-4">
          {dice.map((d, i) => (
            <div key={i} className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-5xl text-purple-600 shadow-xl transition-all duration-500 ${isDrawPhase ? 'rotate-12 scale-110' : 'rotate-0'}`}>
              {getDiceIcon(d)}
            </div>
          ))}
        </div>
        <div className="text-center">
           <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{isDrawPhase ? 'RESULT' : 'TIME REMAINING'}</p>
           <p className="text-4xl font-black font-orbitron text-white">{isDrawPhase ? dice.reduce((a,b)=>a+b,0) : timeLeft+'s'}</p>
        </div>
      </div>

      <div className="bg-[#1e2330] p-6 rounded-[2.5rem] border border-white/5 space-y-4">
        {!hasAccess ? (
           <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-purple-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Roll Dice</button>
        ) : (
           <>
              <div className="grid grid-cols-2 gap-2">
                {['Big', 'Small', 'Odd', 'Even'].map(t => (
                  <button key={t} onClick={() => placeBet(t)} className={`py-4 rounded-xl font-black text-xs uppercase border transition-all ${myBet?.type === t ? 'bg-purple-600 border-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>{t}</button>
                ))}
              </div>
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                <button onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white/5 rounded-xl font-black">-</button>
                <div className="text-center"><p className="text-[8px] text-gray-600 font-black">BET</p><p className="text-lg font-black font-orbitron">🪙 {bet}</p></div>
                <button onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white/5 rounded-xl font-black">+</button>
              </div>
           </>
        )}
      </div>
    </div>
  );
};

export default K3Game;
