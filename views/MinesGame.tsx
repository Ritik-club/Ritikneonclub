
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface MinesGameProps {
  balance: number;
  adminOverride: number[] | null;
  onUpdateBalance: (amount: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const MinesGame: React.FC<MinesGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(3);

  const startGame = () => {
    if (!hasAccess || balance < bet) return;
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
    if (mines.includes(idx)) { setGameOver(true); setIsPlaying(false); }
    else setRevealed(prev => [...prev, idx]);
  };

  const cashOut = () => {
    if (!isPlaying) return;
    const multiplier = 1 + (revealed.length * (0.2 + (mineCount * 0.1)));
    onUpdateBalance(bet * multiplier); setIsPlaying(false);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-5 gap-2 bg-[#0a0c10] p-4 rounded-[2.5rem] border border-white/5 shadow-2xl">
        {Array(25).fill(null).map((_, i) => (
          <button 
            key={i} onClick={() => handleTile(i)}
            className={`aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center text-xl ${revealed.includes(i) ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' : gameOver && mines.includes(i) ? 'bg-red-600' : 'bg-[#1e2330] border border-white/5'}`}
          >
            {revealed.includes(i) ? '💎' : (gameOver && mines.includes(i)) ? '💣' : ''}
          </button>
        ))}
      </div>

      <div className="bg-[#1e2330] rounded-[2.5rem] p-6 border border-white/5 space-y-6">
        {!hasAccess ? (
           <div className="text-center py-4 space-y-3">
              <p className="text-[10px] text-gray-500 font-black uppercase">Mines Blocked</p>
              <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-yellow-600 text-black rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Unblock</button>
           </div>
        ) : (
           <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-black mb-1">Bet</p><p className="text-lg font-black font-orbitron text-yellow-500">🪙 {bet}</p></div>
                <select disabled={isPlaying} value={mineCount} onChange={(e) => setMineCount(Number(e.target.value))} className="bg-black/40 p-3 rounded-xl border border-white/5 text-lg font-black font-orbitron text-white outline-none">
                  {[1, 3, 5, 10, 20].map(m => <option key={m} value={m}>{m} Mines</option>)}
                </select>
              </div>
              {isPlaying ? (
                <button onClick={cashOut} className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black rounded-3xl font-black text-lg uppercase shadow-2xl">Cash Out {(bet * (1 + revealed.length * (0.2 + (mineCount * 0.1)))).toFixed(1)}</button>
              ) : (
                <button onClick={startGame} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg uppercase shadow-2xl">Start Game</button>
              )}
           </>
        )}
      </div>
    </div>
  );
};

export default MinesGame;
