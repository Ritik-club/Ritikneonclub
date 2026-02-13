
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface CricketGameProps {
  balance: number;
  adminOverride: number | null;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const CricketGame: React.FC<CricketGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab }) => {
  const [bet, setBet] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDrawPhase, setIsDrawPhase] = useState(false);
  const [lastRun, setLastRun] = useState<number | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [myPrediction, setMyPrediction] = useState<number | null>(null);
  const [myBetAmount, setMyBetAmount] = useState(0);
  const [liveBets, setLiveBets] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 30000;
      const cycleTime = now % periodDuration;
      const bettingTime = 20000;
      const period = Math.floor(now / periodDuration).toString();
      
      setCurrentPeriod(period);

      if (cycleTime < bettingTime) {
        setIsDrawPhase(false);
        setTimeLeft(Math.ceil((bettingTime - cycleTime) / 1000));
        if (cycleTime < 1000) {
           setLiveBets(Array(8).fill(0).map((_, i) => ({
             id: i,
             user: "User_"+Math.floor(100+Math.random()*900),
             predict: [0, 1, 2, 4, 6][Math.floor(Math.random()*5)],
             won: null
           })));
        }
      } else {
        if (!isDrawPhase) {
          let actualRun: number;
          if (adminOverride !== null) {
            actualRun = adminOverride;
            onClearOverride();
          } else {
            let hash = 0;
            const seed = period + "cricket_v1";
            for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            actualRun = [0, 1, 2, 4, 6][Math.abs(hash) % 5];
          }
          setLastRun(actualRun);
          
          if (myPrediction !== null) {
            if (myPrediction === actualRun) {
              const mult = actualRun === 6 ? 6 : actualRun === 4 ? 4 : 2;
              onUpdateBalance(myBetAmount * mult);
            }
            setMyPrediction(null);
            setMyBetAmount(0);
          }
          // Update fake wins
          setLiveBets(p => p.map(b => b.predict === actualRun ? {...b, won: true} : {...b, won: false}));
        }
        setIsDrawPhase(true);
        setTimeLeft(Math.ceil((periodDuration - cycleTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDrawPhase, myPrediction, myBetAmount, adminOverride]);

  const placePrediction = (predict: number) => {
    if (!hasAccess) return;
    if (!isDrawPhase && balance >= bet && myPrediction === null) {
      onUpdateBalance(-bet);
      setMyPrediction(predict);
      setMyBetAmount(bet);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="h-56 bg-gradient-to-br from-green-900 via-emerald-950 to-[#0a0c10] rounded-[2rem] border border-green-500/20 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {isDrawPhase ? (
          <div className="text-center z-10 animate-in zoom-in">
            <span className="text-7xl">🏏</span>
            <p className="text-[10px] font-black uppercase text-green-400 mt-4 tracking-[0.3em]">Ball in Play...</p>
            <p className="text-4xl font-black font-orbitron text-white mt-2">{lastRun} Runs</p>
          </div>
        ) : (
          <div className="text-center z-10">
            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] mb-2">Next Ball Starts In</p>
            <p className="text-6xl font-black font-orbitron text-white">{timeLeft}s</p>
          </div>
        )}
      </div>

      <div className="bg-[#1e2330] p-6 rounded-[2.5rem] border border-white/5 space-y-6">
        {!hasAccess ? (
           <div className="text-center py-6 space-y-3">
              <p className="text-xs font-black text-red-500 uppercase tracking-widest">Locked 🔒</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Deposit ₹20 to Activate Games</p>
              <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 Now</button>
           </div>
        ) : (
           <>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 4, 6].map(run => (
                  <button 
                    key={run} disabled={isDrawPhase || myPrediction !== null}
                    onClick={() => placePrediction(run)}
                    className={`aspect-square rounded-2xl font-black text-xl border transition-all ${myPrediction === run ? 'bg-green-600 border-white scale-110 shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}
                  >
                    {run}
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                <button onClick={() => setBet(Math.max(10, bet-10))} className="w-10 h-10 bg-white/5 rounded-xl font-black">-</button>
                <div className="text-center"><p className="text-[8px] text-gray-600 font-black uppercase">Bet</p><p className="text-lg font-black font-orbitron text-yellow-500">🪙 {bet}</p></div>
                <button onClick={() => setBet(bet+10)} className="w-10 h-10 bg-white/5 rounded-xl font-black">+</button>
              </div>
           </>
        )}
      </div>

      <div className="bg-[#1e2330] rounded-3xl p-4 border border-white/5 h-40 overflow-hidden relative">
         <h4 className="text-[10px] font-black text-gray-600 uppercase mb-3 px-2">Live Turf Activity</h4>
         <div className="space-y-2">
            {liveBets.map(lb => (
              <div key={lb.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg text-[9px]">
                <span className="text-gray-400 font-bold">{lb.user}</span>
                <span className="text-white font-black">{lb.predict} Runs</span>
                <span className={lb.won === true ? 'text-green-500 font-black' : lb.won === false ? 'text-red-500/50' : 'text-gray-600'}>
                  {lb.won === true ? 'WON!' : lb.won === false ? 'MISS' : 'Waiting...'}
                </span>
              </div>
            ))}
         </div>
         <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#1e2330] to-transparent"></div>
      </div>
    </div>
  );
};

export default CricketGame;
