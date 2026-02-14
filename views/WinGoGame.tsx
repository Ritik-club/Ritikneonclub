
import React, { useState } from 'react';
import { GameMode, GameResult, ColorType, Tab, UserBet } from '../types.ts';

interface WinGoGameProps {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  timeLeft: number;
  period: string;
  results: GameResult[];
  balance: number;
  onBet: (bet: any) => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  userBets: UserBet[];
}

const WinGoGame: React.FC<WinGoGameProps> = ({ activeMode, setActiveMode, timeLeft, period, results, balance, onBet, hasAccess, setTab, userBets }) => {
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const [betModal, setBetModal] = useState<{type: any, label: string} | null>(null);

  const formatTimer = (s: number) => ({
    m: Math.floor(s / 60).toString().padStart(2, '0'),
    s: (s % 60).toString().padStart(2, '0')
  });

  const timer = formatTimer(timeLeft);
  
  // Check if a bet is already active for this period (BET LOCK)
  const isBetPending = userBets.some(b => b.period === period && b.mode === activeMode && b.status === 'Pending');

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500 bg-gray-50 min-h-full">
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex justify-between items-center">
        <div><p className="text-[10px] font-black text-gray-400 uppercase">Period ID</p><p className="text-lg font-black font-mono tracking-tighter text-blue-600">{period.slice(-8)}</p></div>
        <div className="text-right"><p className="text-[10px] font-black text-gray-400 uppercase">Count Down</p><div className="flex gap-1 text-2xl font-black font-orbitron text-gray-900"><span>{timer.m}</span><span>:</span><span>{timer.s}</span></div></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {['30sec', '1min', '3min', '5min'].map((m: any) => (
          <button key={m} disabled={isBetPending} onClick={() => setActiveMode(m)} className={`py-3 rounded-2xl text-[10px] font-black border transition-all ${activeMode === m ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 shadow-sm'}`}>{m}</button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 space-y-6 shadow-sm border border-gray-100">
        {!hasAccess ? (
           <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl mx-auto">🔒</div>
              <p className="text-xs font-black uppercase text-gray-400">Winning Prediction Locked</p>
              <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg">Open Wallet</button>
           </div>
        ) : (
           <>
              {isBetPending && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                   <p className="text-[10px] font-black text-blue-600 uppercase">Stakes Locked - Waiting Result</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <button disabled={isBetPending} onClick={() => setBetModal({type: ColorType.GREEN, label: 'Green'})} className="bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-md active:scale-95 disabled:opacity-50">Green</button>
                <button disabled={isBetPending} onClick={() => setBetModal({type: ColorType.VIOLET, label: 'Violet'})} className="bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-md active:scale-95 disabled:opacity-50">Violet</button>
                <button disabled={isBetPending} onClick={() => setBetModal({type: ColorType.RED, label: 'Red'})} className="bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-md active:scale-95 disabled:opacity-50">Red</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl grid grid-cols-5 gap-3 border border-gray-100">
                {[0,1,2,3,4,5,6,7,8,9].map(n => (
                  <button 
                    key={n} 
                    disabled={isBetPending}
                    onClick={() => setBetModal({type: n, label: `Number ${n}`})} 
                    className={`aspect-square rounded-2xl flex items-center justify-center font-black text-lg border text-white transition-all active:scale-90 disabled:opacity-50 ${n%2===0 ? 'bg-red-600' : 'bg-green-600'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button disabled={isBetPending} onClick={() => setBetModal({type: 'Big', label: 'Big'})} className="bg-orange-500 text-white py-4 rounded-2xl font-black text-sm uppercase shadow-md active:scale-95 disabled:opacity-50">Big</button>
                <button disabled={isBetPending} onClick={() => setBetModal({type: 'Small', label: 'Small'})} className="bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase shadow-md active:scale-95 disabled:opacity-50">Small</button>
              </div>
              <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-widest">Number Win Multiplier: 4.8x Cap</p>
           </>
        )}
      </div>

      {betModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-[3rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-gray-900">Stake on: <span className="text-blue-600">{betModal.label}</span></h3>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {[1, 5, 10, 50, 100].map(m => (
                <button key={m} onClick={() => setSelectedMultiplier(m)} className={`py-4 rounded-2xl font-black text-xs transition-all ${selectedMultiplier === m ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>{m}x</button>
              ))}
            </div>
            <button onClick={() => { onBet({selection: betModal.type, amount: 10 * selectedMultiplier}); setBetModal(null); }} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg uppercase shadow-xl">Confirm Bet 🪙 {(10 * selectedMultiplier)}</button>
            <button onClick={() => setBetModal(null)} className="w-full mt-4 py-3 text-gray-400 font-bold uppercase text-[10px]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinGoGame;
