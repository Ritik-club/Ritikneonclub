
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface VortexGameProps {
  balance: number;
  adminOverride: number | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const VortexGame: React.FC<VortexGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [period, setPeriod] = useState("");
  const [myBet, setMyBet] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const spinTime = 25000;
      const currentPeriod = Math.floor(now / periodDuration).toString();
      
      setPeriod(currentPeriod);

      if (cycleTime < spinTime) {
        setIsSpinning(false);
        setTimeLeft(Math.ceil((spinTime - cycleTime) / 1000));
        if (cycleTime < 1000) setMyBet(false);
      } else {
        if (!isSpinning) {
          let resultIdx: number;
          if (adminOverride !== null) {
            resultIdx = adminOverride;
            onClearOverride();
          } else {
            let hash = 0;
            const seed = currentPeriod + "vortex_v1";
            for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            resultIdx = Math.abs(hash) % 10;
          }
          
          const targetAngle = (360 * 10) + (resultIdx * 36);
          setAngle(prev => prev + targetAngle);
          
          if (myBet && resultIdx > 7) {
            onUpdateBalance(10 * (resultIdx/2));
          }
        }
        setIsSpinning(true);
        setTimeLeft(Math.ceil((periodDuration - cycleTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSpinning, myBet, adminOverride]);

  const initiateShift = () => {
    if (!hasAccess) return;
    if (!isSpinning && !myBet && balance >= 10) {
      onUpdateBalance(-10);
      setMyBet(true);
    }
  };

  return (
    <div className="p-4 space-y-8 flex flex-col items-center animate-in fade-in duration-500">
      <div className="text-center">
         <p className="text-[10px] text-purple-500 font-black uppercase tracking-[0.3em] mb-1">Vortex Cycle</p>
         <p className="text-xl font-black font-orbitron"># {period.slice(-6)}</p>
      </div>

      <div className="w-64 h-64 rounded-full border-[12px] border-purple-500/10 flex items-center justify-center relative shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="w-full h-full flex items-center justify-center transition-all duration-[4s] ease-out" style={{ transform: `rotate(${angle}deg)` }}>
           <span className="text-7xl">🌀</span>
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-white rounded-full shadow-lg z-20"></div>
      </div>

      <div className="bg-[#1e2330] p-8 rounded-[3rem] border border-white/5 w-full text-center space-y-6 shadow-2xl">
        {!hasAccess ? (
           <div className="space-y-3">
              <p className="text-[10px] text-gray-500 font-black uppercase">Service Restricted</p>
              <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-purple-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Start Vortex</button>
           </div>
        ) : (
           <>
              <div className="flex justify-between items-center mb-2">
                 <div className="text-left"><p className="text-[9px] text-gray-500 font-black uppercase">Entry</p><p className="text-lg font-black font-orbitron">🪙 10</p></div>
                 <div className="text-right"><p className="text-[9px] text-gray-500 font-black uppercase">Next Shift</p><p className="text-lg font-black font-orbitron text-purple-500">{timeLeft}s</p></div>
              </div>
              <button onClick={initiateShift} disabled={isSpinning || myBet} className={`w-full py-6 rounded-3xl font-black text-xl uppercase shadow-2xl transition-all ${isSpinning || myBet ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
                {myBet ? 'Bet Locked' : isSpinning ? 'Shifting...' : 'Initiate Shift'}
              </button>
           </>
        )}
      </div>
    </div>
  );
};

export default VortexGame;
