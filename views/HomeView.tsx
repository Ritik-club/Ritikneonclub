
import React from 'react';
import { GameType, UserState, CustomGame } from '../types.ts';

interface HomeViewProps {
  user: UserState;
  onSelectGame: (game: GameType) => void;
  customGames: CustomGame[];
}

const HomeView: React.FC<HomeViewProps> = ({ user, onSelectGame, customGames }) => {
  const categories = ["All Games", "Lottery", "Crash", "Casino", "Mini Games"];
  
  const defaultGames = [
    { id: GameType.WINGO, name: 'Win Go', icon: '🎰', color: 'from-blue-50 to-blue-100 border-blue-200', text: 'text-blue-900', sub: '4.8x Multiplier' },
    { id: GameType.AVIATOR, name: 'Aviator', icon: '✈️', color: 'from-red-50 to-red-100 border-red-200', text: 'text-red-900', sub: 'Instant Cashout' },
    { id: GameType.PLINKO, name: 'Plinko', icon: '🔽', color: 'from-pink-50 to-pink-100 border-pink-200', text: 'text-pink-900', sub: 'Balanced Payout' },
    { id: GameType.D5, name: '5D Lotre', icon: '🔢', color: 'from-cyan-50 to-cyan-100 border-cyan-200', text: 'text-cyan-900', sub: '5-Digit Fortune' },
    { id: GameType.PENALTY, name: 'Penalty', icon: '⚽', color: 'from-emerald-50 to-emerald-100 border-emerald-200', text: 'text-emerald-900', sub: 'Goal Rush' },
    { id: GameType.WHEEL, name: 'Lucky Wheel', icon: '🎡', color: 'from-yellow-50 to-yellow-100 border-yellow-200', text: 'text-yellow-900', sub: 'Spin to Win' },
    { id: GameType.MINES, name: 'Mines', icon: '💣', color: 'from-gray-100 to-gray-200 border-gray-300', text: 'text-gray-900', sub: 'Strategic Wins' },
    { id: GameType.BACCARAT, name: 'Baccarat', icon: '🃏', color: 'from-blue-50 to-blue-100 border-blue-200', text: 'text-blue-900', sub: 'Card Battle' },
    { id: GameType.K3, name: 'K3 Dice', icon: '🎲', color: 'from-purple-50 to-purple-100 border-purple-200', text: 'text-purple-900', sub: 'Triple Sum' },
    { id: GameType.DRAGON_TIGER, name: 'Dragon Tiger', icon: '🐉', color: 'from-orange-50 to-orange-100 border-orange-200', text: 'text-orange-900', sub: 'Dragon vs Tiger' },
  ];

  const handleCustomGame = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 px-4 py-4 animate-in fade-in slide-in-from-bottom duration-500 bg-gray-50 h-full">
      <div className="h-44 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex flex-col justify-center relative overflow-hidden shadow-xl text-white">
        <h2 className="text-2xl font-black font-orbitron mb-2 relative z-10 leading-tight uppercase">Ritik Club<br/>v7.2 Protocol</h2>
        <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] relative z-10">House Edge: Regulated</p>
        <div className="mt-4 flex gap-2 relative z-10">
           <span className="bg-white/20 px-3 py-1 rounded-full text-[8px] font-black border border-white/10">Verified Odds</span>
           <span className="bg-white/20 px-3 py-1 rounded-full text-[8px] font-black border border-white/10">Quick Support</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c, i) => (
          <button key={i} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${i === 0 ? 'bg-blue-600 border-blue-400 shadow-md text-white' : 'bg-white border-gray-200 text-gray-500'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {defaultGames.map((g) => (
          <button 
            key={g.id}
            onClick={() => onSelectGame(g.id)}
            className={`bg-gradient-to-br ${g.color} p-4 rounded-3xl text-left border shadow-sm active:scale-95 transition-all group relative overflow-hidden h-36 flex flex-col justify-end`}
          >
            <div className="absolute top-4 right-4 text-3xl opacity-80 group-hover:scale-110 transition-transform duration-300">{g.icon}</div>
            <div className="relative z-10">
              <p className={`text-xs font-black font-orbitron uppercase leading-none ${g.text}`}>{g.name}</p>
              <p className={`text-[7px] font-bold opacity-60 uppercase mt-1 tracking-widest ${g.text}`}>{g.sub}</p>
            </div>
          </button>
        ))}

        {customGames.map((g) => (
          <button 
            key={g.id}
            onClick={() => handleCustomGame(g.url)}
            className={`bg-white border border-gray-100 p-4 rounded-3xl text-left shadow-sm active:scale-95 transition-all group relative overflow-hidden h-36 flex flex-col justify-end`}
          >
            <div className="absolute top-4 right-4 text-3xl opacity-80">{g.icon || '🎮'}</div>
            <div className="relative z-10">
              <p className="text-xs font-black font-orbitron uppercase leading-none text-gray-800">{g.name}</p>
              <p className="text-[7px] font-bold text-gray-400 uppercase mt-1">Partner Game</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
