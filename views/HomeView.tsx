
import React from 'react';
import { GameType, UserState, CustomGame } from '../types.ts';

interface HomeViewProps {
  user: UserState;
  onSelectGame: (game: GameType) => void;
  customGames: CustomGame[];
}

const HomeView: React.FC<HomeViewProps> = ({ user, onSelectGame, customGames }) => {
  const categories = ["Lottery", "Crash", "Mini", "Casino", "Sports"];
  
  const defaultGames = [
    { id: GameType.WINGO, name: 'Win Go', icon: '🎰', color: 'from-blue-600 to-indigo-600', sub: '8.92x Multiplier' },
    { id: GameType.AVIATOR, name: 'Aviator', icon: '✈️', color: 'from-red-600 to-rose-700', sub: 'Infinite Flight' },
    { id: GameType.MINES, name: 'Mines', icon: '💣', color: 'from-yellow-600 to-amber-700', sub: 'Diamond Hunt' },
    { id: GameType.K3, name: 'K3 Lotre', icon: '🎲', color: 'from-purple-600 to-pink-700', sub: 'Dice Prediction' },
    { id: GameType.D5, name: '5D Lotre', icon: '🔢', color: 'from-green-600 to-emerald-700', sub: 'Quick Pick' },
    { id: GameType.DRAGON_TIGER, name: 'Dragon Tiger', icon: '🐉', color: 'from-orange-600 to-red-700', sub: 'Casino Table' },
  ];

  const handleCustomGame = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 px-4 py-4 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="h-44 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 flex flex-col justify-center relative overflow-hidden border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-black font-orbitron mb-2 relative z-10 leading-tight text-yellow-500 uppercase">New User Reward<br/>🪙 25 Coins</h2>
        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] relative z-10">Smart House House Advantage: ON</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c, i) => (
          <button key={i} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${i === 0 ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {defaultGames.map((g) => (
          <button 
            key={g.id}
            onClick={() => onSelectGame(g.id)}
            className={`bg-gradient-to-br ${g.color} p-4 rounded-3xl text-left border border-white/10 shadow-xl active:scale-95 transition-all group relative overflow-hidden h-36 flex flex-col justify-end`}
          >
            <div className="absolute top-4 right-4 text-3xl opacity-50">{g.icon}</div>
            <div className="relative z-10">
              <p className="text-xs font-black font-orbitron uppercase leading-none">{g.name}</p>
              <p className="text-[7px] font-bold text-white/60 uppercase mt-1">{g.sub}</p>
            </div>
          </button>
        ))}

        {customGames.map((g) => (
          <button 
            key={g.id}
            onClick={() => handleCustomGame(g.url)}
            className={`bg-gradient-to-br ${g.color} p-4 rounded-3xl text-left border border-white/10 shadow-xl active:scale-95 transition-all group relative overflow-hidden h-36 flex flex-col justify-end`}
          >
            <div className="absolute top-4 right-4 text-3xl opacity-50">{g.icon || '🎮'}</div>
            <div className="relative z-10">
              <p className="text-xs font-black font-orbitron uppercase leading-none">{g.name}</p>
              <p className="text-[7px] font-bold text-white/60 uppercase mt-1">Official Partner</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
