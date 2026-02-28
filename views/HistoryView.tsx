
import React, { useState } from 'react';
import { GameResult, UserBet, ColorType } from '../types.ts';
import { COLOR_CONFIG } from '../constants.tsx';

interface HistoryViewProps {
  results: GameResult[];
  userBets: UserBet[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ results, userBets }) => {
  const [activeTab, setActiveTab] = useState<'GameHistory' | 'MyBets'>('GameHistory');

  const getSelectionDisplay = (selection: UserBet['selection']) => {
    if (typeof selection === 'number') {
      return (
        <span className="bg-white/10 px-2.5 py-1 rounded-lg text-xs font-black font-orbitron border border-white/10">
          {selection}
        </span>
      );
    }
    if (selection === 'Big' || selection === 'Small') {
      return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          selection === 'Big' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {selection}
        </span>
      );
    }
    // ColorType
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-3 h-3 rounded-full ${COLOR_CONFIG[selection as keyof typeof COLOR_CONFIG].bg}`} />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selection}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4 py-2">
      {/* View Switcher Tabs */}
      <div className="flex gap-2 p-1.5 glass-morphism rounded-2xl">
        <button 
          onClick={() => setActiveTab('GameHistory')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'GameHistory' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Game History
        </button>
        <button 
          onClick={() => setActiveTab('MyBets')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'MyBets' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          My Bets
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-orbitron tracking-tight">
          {activeTab === 'GameHistory' ? 'Draw Ledger' : 'My Stakes'}
        </h2>
        <div className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 font-bold uppercase tracking-widest">
          {activeTab === 'GameHistory' ? 'Live Results' : `${userBets.length} Rounds`}
        </div>
      </div>

      <div className="glass-morphism rounded-[2rem] overflow-hidden border border-white/5">
        {activeTab === 'GameHistory' ? (
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-5 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Period</th>
                <th className="px-5 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Num</th>
                <th className="px-5 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.length > 0 ? results.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-5 font-mono text-xs text-gray-400">{res.period}</td>
                  <td className="px-5 py-5">
                    <span className="font-orbitron font-black text-lg text-white">{res.number}</span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-center gap-1.5">
                      {res.colors.map(color => (
                        <div 
                          key={color} 
                          className={`w-4 h-4 rounded-full ${COLOR_CONFIG[color as keyof typeof COLOR_CONFIG].bg} shadow-lg ring-1 ring-white/10`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center opacity-30">
                     <p className="text-3xl mb-2">📜</p>
                     <p className="text-[10px] font-black uppercase tracking-widest">No draw data found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="divide-y divide-white/5">
            {userBets.length > 0 ? userBets.map((bet) => (
              <div key={bet.id} className="p-5 hover:bg-white/[0.02] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Period: <span className="text-gray-300 font-mono">{bet.period}</span></p>
                    <div className="flex items-center gap-2">
                      {getSelectionDisplay(bet.selection)}
                      <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-md text-gray-600 font-mono">{bet.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black font-orbitron text-white">🪙 {bet.amount.toLocaleString()}</p>
                    {bet.status === 'Pending' ? (
                       <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest animate-pulse">Pending...</span>
                    ) : bet.status === 'Win' ? (
                       <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">+🪙 {bet.payout?.toLocaleString()}</p>
                    ) : (
                       <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Lost</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-[8px] text-gray-600 font-bold uppercase">{new Date(bet.timestamp).toLocaleTimeString()}</p>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    bet.status === 'Win' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    bet.status === 'Loss' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {bet.status}
                  </div>
                </div>
              </div>
            )) : (
              <div className="px-6 py-20 text-center opacity-30">
                 <p className="text-3xl mb-2">💸</p>
                 <p className="text-[10px] font-black uppercase tracking-widest">No bets placed yet</p>
                 <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Stakes you place will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
