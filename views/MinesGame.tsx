
import React, { useState, useEffect } from 'react';
import { Tab, GameType } from '../types.ts';

interface MinesGameProps {
  balance: number;
  adminOverride: number[] | null;
  onUpdateBalance: (amount: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  userBets: any[];
}

const MinesGame: React.FC<MinesGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab, onSound, userBets }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(3);

  const startGame = () => {
    if (!hasAccess || balance < bet) return;
    onSound('bet');
    onUpdateBalance(-bet);
    
    let newMines: number[] = [];
    if (adminOverride && Array.isArray(adminOverride)) {
      newMines = adminOverride;
      onClearOverride();
    } else {
      while (newMines.length < mineCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!newMines.includes(pos)) newMines.push(pos);
      }
    }
    setMines(newMines); setRevealed([]); setGameOver(false); setIsPlaying(true);
  };

  const handleTile = (idx: number) => {
    if (!isPlaying || revealed.includes(idx) || gameOver) return;
    if (mines.includes(idx)) { 
      onSound('crash');
      setGameOver(true); 
      setIsPlaying(false); 
    } else {
      onSound('click');
      setRevealed(prev => [...prev, idx]);
    }
  };

  const cashOut = () => {
    if (!isPlaying) return;
    onSound('win');
    const multiplier = 1 + (revealed.length * (0.2 + (mineCount * 0.1)));
    onUpdateBalance(bet * multiplier); setIsPlaying(false);
  };

  const myGameBets = userBets.filter(b => b.game === GameType.MINES).slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-[#11131a] overflow-y-auto no-scrollbar pb-24">
      <div className={`p-4 space-y-6 ${gameOver ? 'animate-shake' : ''}`}>
        <div className="grid grid-cols-5 gap-2 bg-[#0a0c10] p-4 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {Array(25).fill(null).map((_, i) => (
            <button 
              key={i} onClick={() => handleTile(i)}
              className={`aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center text-xl relative ${
                revealed.includes(i) ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg win-glow' : 
                gameOver && mines.includes(i) ? 'bg-red-600 scale-110 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 
                'bg-[#1e2330] border border-white/5 active:scale-90'
              }`}
            >
              {revealed.includes(i) && <div className="sparkle-effect">✨</div>}
              {revealed.includes(i) ? '💎' : (gameOver && mines.includes(i)) ? '💣' : ''}
            </button>
          ))}
        </div>

        <div className="bg-[#1e2330] rounded-[2.5rem] p-6 border border-white/5 space-y-6">
          {!hasAccess ? (
             <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-yellow-600 text-black rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Unblock</button>
          ) : (
             <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-black mb-1">Bet</p><p className="text-lg font-black font-orbitron text-yellow-500">🪙 {bet}</p></div>
                  <select disabled={isPlaying} value={mineCount} onChange={(e) => { onSound('click'); setMineCount(Number(e.target.value)); }} className="bg-black/40 p-3 rounded-xl border border-white/5 text-lg font-black font-orbitron text-white outline-none">
                    {[1, 3, 5, 10, 20].map(m => <option key={m} value={m}>{m} Mines</option>)}
                  </select>
                </div>
                {isPlaying ? (
                  <button onClick={cashOut} className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black rounded-3xl font-black text-lg uppercase shadow-2xl active:scale-95 transition-all">Cash Out {(bet * (1 + revealed.length * (0.2 + (mineCount * 0.1)))).toFixed(1)}</button>
                ) : (
                  <button onClick={startGame} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg uppercase shadow-2xl active:scale-95 transition-all">Start Game</button>
                )}
             </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
         <h3 className="text-xs font-black font-orbitron text-gray-600 uppercase tracking-widest px-2">Mine Field Records</h3>
         <div className="bg-[#1e2330] rounded-2xl overflow-hidden border border-white/5">
            {myGameBets.map(b => (
              <div key={b.id} className="p-4 border-b border-white/5 flex justify-between items-center text-[10px] font-black">
                 <div><p className="text-gray-400">{b.id}</p><p className="text-[8px] text-gray-600 uppercase">{new Date(b.timestamp).toLocaleTimeString()}</p></div>
                 <div className="text-right">
                    <p className={b.status === 'Win' ? 'text-green-500' : 'text-red-500'}>{b.status === 'Win' ? `+${b.payout}` : 'LOSS'}</p>
                 </div>
              </div>
            ))}
            {myGameBets.length === 0 && <p className="p-10 text-center text-[9px] text-gray-700 uppercase font-black">Clear of Mines</p>}
         </div>
      </div>
    </div>
  );
};

export default MinesGame;
