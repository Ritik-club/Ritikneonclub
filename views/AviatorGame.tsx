
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface AviatorGameProps {
  balance: number;
  adminOverride: number | null;
  onUpdateBalance: (amount: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const AviatorGame: React.FC<AviatorGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab }) => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [liveBets, setLiveBets] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const waitTime = 10000;
      const currentPeriod = Math.floor(now / periodDuration).toString();

      if (cycleTime < waitTime) {
        setIsFlying(false);
        setIsCrashed(false);
        setTimeLeft(Math.ceil((waitTime - cycleTime) / 1000));
        setMultiplier(1.00);
        if (cycleTime < 500) { 
           setHasBet(false);
           setCashedOut(false);
           setLiveBets(Array(15).fill(0).map((_, i) => ({ id: i, name: `User_${Math.floor(100+Math.random()*900)}`, amount: [10, 50, 100][Math.floor(Math.random()*3)], win: null })));
        }
      } else {
        if (!isFlying) {
          let targetCrash: number;
          if (adminOverride !== null) {
            targetCrash = adminOverride;
            onClearOverride();
          } else {
            let hash = 0;
            const seed = currentPeriod + "aviator_v4";
            for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            targetCrash = 1 + (Math.abs(hash) % 400) / 100;
          }
          setCrashPoint(targetCrash);
          setIsFlying(true);
        }

        const elapsedFlight = (cycleTime - waitTime) / 1000;
        const currentMult = Math.pow(1.08, elapsedFlight);
        
        if (currentMult >= crashPoint) {
          setIsCrashed(true);
          setMultiplier(crashPoint);
        } else {
          setMultiplier(currentMult);
          if (Math.random() > 0.95) {
            setLiveBets(p => p.map(lb => lb.win === null && Math.random() > 0.5 ? { ...lb, win: lb.amount * currentMult } : lb));
          }
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isFlying, adminOverride, crashPoint]);

  const handlePlaceBet = () => {
    if (!hasAccess) return;
    if (!isFlying && !hasBet && balance >= betAmount) {
      onUpdateBalance(-betAmount);
      setHasBet(true);
    }
  };

  const handleCashOut = () => {
    if (isFlying && !isCrashed && hasBet && !cashedOut) {
      const win = betAmount * multiplier;
      onUpdateBalance(win);
      setCashedOut(true);
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      <div className="h-64 bg-[#0a0c10] rounded-[2rem] border border-red-500/20 relative overflow-hidden flex flex-col items-center justify-center">
        {!isFlying ? (
          <div className="text-center z-10">
            <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] mb-2">Next Flight Starts</p>
            <p className="text-6xl font-black font-orbitron text-white">{timeLeft}s</p>
          </div>
        ) : (
          <div className="text-center z-10">
            <p className={`text-7xl font-black font-orbitron transition-all ${isCrashed ? 'text-red-600 scale-90' : 'text-white scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}>
              {multiplier.toFixed(2)}x
            </p>
          </div>
        )}
      </div>

      <div className="bg-[#1e2330] p-5 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl">
        {!hasAccess ? (
           <div className="text-center py-4 space-y-3">
              <p className="text-[10px] text-gray-500 font-black uppercase">Flight Restricted</p>
              <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-red-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Fly</button>
           </div>
        ) : (
           <>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                 <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="w-10 h-10 bg-white/5 rounded-xl font-black text-xl">-</button>
                 <span className="text-lg font-black font-orbitron">🪙 {betAmount}</span>
                 <button onClick={() => setBetAmount(betAmount + 10)} className="w-10 h-10 bg-white/5 rounded-xl font-black text-xl">+</button>
              </div>
              {!isFlying ? (
                <button disabled={hasBet} onClick={handlePlaceBet} className={`w-full py-5 rounded-2xl font-black text-lg uppercase shadow-2xl ${hasBet ? 'bg-gray-800 text-gray-500' : 'bg-red-600 text-white'}`}>{hasBet ? 'Waiting...' : 'Bet'}</button>
              ) : (
                <button disabled={isCrashed || cashedOut || !hasBet} onClick={handleCashOut} className={`w-full py-5 rounded-2xl font-black text-lg uppercase shadow-2xl ${isCrashed || cashedOut || !hasBet ? 'bg-gray-800 text-gray-500' : 'bg-orange-500 text-black'}`}>{cashedOut ? 'Won!' : isCrashed ? 'Lost' : `Cash Out ${(betAmount * multiplier).toFixed(1)}`}</button>
              )}
           </>
        )}
      </div>

      <div className="bg-[#1e2330] rounded-3xl p-4 border border-white/5 h-40 overflow-hidden relative">
         <h4 className="text-[10px] font-black text-gray-600 uppercase mb-3 px-2 tracking-widest">Live Activity</h4>
         <div className="space-y-2">
            {liveBets.map(lb => (
              <div key={lb.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg text-[9px]">
                <span className="text-gray-400 font-bold">{lb.name}</span>
                <span className="text-white font-black">🪙 {lb.amount}</span>
                {lb.win ? <span className="text-green-500 font-black">+{lb.win.toFixed(1)}</span> : <span className="text-gray-700 font-bold">Betting...</span>}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AviatorGame;
