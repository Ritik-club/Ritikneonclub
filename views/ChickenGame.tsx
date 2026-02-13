
import React, { useState, useEffect } from 'react';
import { Tab } from '../types.ts';

interface ChickenGameProps {
  balance: number;
  adminOverride: any;
  onUpdateBalance: (a: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
}

const ChickenGame: React.FC<ChickenGameProps> = ({ balance, onUpdateBalance, hasAccess, setTab }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState({ x: 2, y: 4 });
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const startGame = () => {
    if (!hasAccess || balance < bet) return;
    onUpdateBalance(-bet);
    setIsPlaying(true); setGameOver(false); setWon(false); setPos({ x: 2, y: 4 });
    const obs = Array(7).fill(0).map(() => Math.floor(Math.random()*25)).filter(o => o !== 22);
    setObstacles(obs);
  };

  const move = (dx: number, dy: number) => {
    if (!isPlaying || gameOver || won) return;
    const newX = Math.max(0, Math.min(4, pos.x + dx));
    const newY = Math.max(0, Math.min(4, pos.y + dy));
    const idx = newY * 5 + newX;
    if (obstacles.includes(idx)) { setGameOver(true); setIsPlaying(false); }
    else {
      setPos({ x: newX, y: newY });
      if (newY === 0) { setWon(true); setIsPlaying(false); onUpdateBalance(bet * 5); }
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-5 gap-2 bg-[#0a0c10] p-4 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
        {Array(25).fill(null).map((_, i) => {
          const x = i % 5; const y = Math.floor(i / 5);
          const isPlayer = pos.x === x && pos.y === y;
          return <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center text-2xl relative border ${y === 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-[#1e2330] border-white/5'}`}>{isPlayer && '🍗'}</div>;
        })}
      </div>
      <div className="bg-[#1e2330] rounded-[3rem] p-6 border border-white/5 space-y-4">
        {!hasAccess ? (
           <button onClick={() => setTab(Tab.WALLET)} className="w-full py-4 bg-orange-600 rounded-2xl font-black text-[10px] uppercase">Deposit ₹20 to Pathfind</button>
        ) : (
           <>
              <div className="grid grid-cols-3 gap-3">
                <div/><button onClick={()=>move(0,-1)} disabled={!isPlaying} className="bg-white/5 aspect-square rounded-xl flex items-center justify-center border border-white/10">▲</button><div/>
                <button onClick={()=>move(-1,0)} disabled={!isPlaying} className="bg-white/5 aspect-square rounded-xl flex items-center justify-center border border-white/10">◀</button>
                <button onClick={()=>move(0,1)} disabled={!isPlaying} className="bg-white/5 aspect-square rounded-xl flex items-center justify-center border border-white/10">▼</button>
                <button onClick={()=>move(1,0)} disabled={!isPlaying} className="bg-white/5 aspect-square rounded-xl flex items-center justify-center border border-white/10">▶</button>
              </div>
              <button onClick={startGame} disabled={isPlaying} className="w-full py-5 bg-orange-600 rounded-2xl font-black uppercase shadow-xl mt-4">{isPlaying ? 'Moving...' : 'Start Path'}</button>
           </>
        )}
      </div>
    </div>
  );
};

export default ChickenGame;
