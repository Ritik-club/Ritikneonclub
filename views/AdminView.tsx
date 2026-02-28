
import React, { useState } from 'react';
import { GameMode, GiftCode, CustomGame, Transaction, UserBet, UserState } from '../types.ts';

interface AdminViewProps {
  adminControls: any;
  onUpdateControls: (controls: any) => void;
  giftCodes: GiftCode[];
  onAddGift: (g: GiftCode) => void;
  onAddGame: (g: CustomGame) => void;
  onRemoveGame: (id: string) => void;
  customGames: CustomGame[];
  pendingTxs: Transaction[];
  onProcessTx: (id: string, status: 'Completed' | 'Rejected', message?: string) => void;
  userBets: UserBet[];
  dbUsers: UserState[];
}

const AdminView: React.FC<AdminViewProps> = ({ 
  adminControls, onUpdateControls, giftCodes, onAddGift, onAddGame, onRemoveGame, customGames, pendingTxs, onProcessTx, userBets, dbUsers
}) => {
  const [selectedWinGoMode, setSelectedWinGoMode] = useState<GameMode>('30sec');
  const [activeImg, setActiveImg] = useState<string | null>(null);

  // Custom Game Form State - Initialized correctly
  const [newGame, setNewGame] = useState({ name: '', url: '', icon: '🎮', color: 'from-red-600 to-red-500' });

  const setWinGoOverride = (num: number) => {
    onUpdateControls({ ...adminControls, wingo: { ...adminControls.wingo, [selectedWinGoMode]: num } });
  };

  const updateSimpleControl = (game: string, value: any) => {
    onUpdateControls({ ...adminControls, [game]: value });
  };

  const getUserPhone = (userId: string) => {
    const found = dbUsers.find(u => u.id === userId);
    const fallback = userId.slice(-6);
    return found ? found.phone : fallback;
  };

  const handleAddCustomGame = () => {
    if (!newGame.name || !newGame.url) {
      alert("Fill Name and URL");
      return;
    }
    const gameId = "CUSTOM_" + Date.now();
    onAddGame({ ...newGame, id: gameId });
    setNewGame({ name: '', url: '', icon: '🎮', color: 'from-red-600 to-red-500' });
    alert("Partner Game Added!");
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-20 overflow-y-auto no-scrollbar max-h-screen">
      {activeImg && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4" onClick={() => setActiveImg(null)}>
           <img src={activeImg} className="max-w-full max-h-full rounded-xl" alt="Proof" />
        </div>
      )}

      {/* MASTER GAMES HUB */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-xl space-y-6">
        <h2 className="text-sm font-black font-orbitron text-red-600 uppercase tracking-widest text-center">RITIK CLUB MASTER CONTROL</h2>
        
        {/* WinGo Grid */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase">WinGo Override - {selectedWinGoMode}</p>
              <select 
                value={selectedWinGoMode} 
                onChange={(e) => setSelectedWinGoMode(e.target.value as GameMode)}
                className="text-[10px] bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 font-black"
              >
                <option value="30sec">30s</option>
                <option value="1min">1m</option>
                <option value="3min">3m</option>
                <option value="5min">5m</option>
              </select>
           </div>
           <div className="grid grid-cols-5 gap-2">
             {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
               <button key={num} onClick={() => setWinGoOverride(num)} className={`aspect-square rounded-xl flex items-center justify-center font-black text-lg border transition-all ${adminControls.wingo[selectedWinGoMode] === num ? 'bg-red-600 border-white text-white shadow-lg shadow-red-200' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>{num}</button>
             ))}
           </div>
        </div>

        {/* Individual Game Controls */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Aviator Crash Point</p>
              <input type="number" step="0.01" placeholder="e.g. 2.50" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onBlur={(e) => updateSimpleControl('aviator', parseFloat(e.target.value))} />
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Mines (Next Mine Idx)</p>
              <input type="number" placeholder="0-24" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onBlur={(e) => updateSimpleControl('mines', parseInt(e.target.value))} />
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Vortex (Idx 0-8)</p>
              <input type="number" placeholder="Target Idx" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onBlur={(e) => updateSimpleControl('vortex', parseInt(e.target.value))} />
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Wheel (Idx 0-7)</p>
              <input type="number" placeholder="Target Idx" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onBlur={(e) => updateSimpleControl('wheel', parseInt(e.target.value))} />
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Penalty (Next Result)</p>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onChange={(e) => updateSimpleControl('penalty', e.target.value || null)}>
                <option value="">Random</option>
                <option value="Goal">Force Goal</option>
                <option value="Save">Force Save</option>
              </select>
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">DragonTiger (Next Win)</p>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onChange={(e) => updateSimpleControl('dragonTiger', e.target.value)}>
                <option value="">Random</option>
                <option value="Dragon">Dragon</option>
                <option value="Tiger">Tiger</option>
                <option value="Tie">Tie</option>
              </select>
           </div>
           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Plinko (Bucket 0-12)</p>
              <input type="number" placeholder="0-12" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" onBlur={(e) => updateSimpleControl('plinko', parseInt(e.target.value))} />
           </div>
        </div>
      </div>

      {/* GIFT CODE GENERATOR */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
         <h3 className="text-xs font-black font-orbitron text-orange-600 uppercase tracking-widest">Gift Code Generator</h3>
         <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
               <input id="gift-code-input" type="text" placeholder="CODE123" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" />
               <input id="gift-amount-input" type="number" placeholder="Amount" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" />
            </div>
            <button 
              onClick={() => {
                const code = (document.getElementById('gift-code-input') as HTMLInputElement).value;
                const amount = parseFloat((document.getElementById('gift-amount-input') as HTMLInputElement).value);
                if (code && amount) {
                  onAddGift({ code, amount });
                  (document.getElementById('gift-code-input') as HTMLInputElement).value = '';
                  (document.getElementById('gift-amount-input') as HTMLInputElement).value = '';
                  alert("Gift Code Created!");
                }
              }}
              className="w-full bg-orange-600 py-4 rounded-2xl font-black text-white text-[10px] uppercase shadow-lg shadow-orange-100"
            >
               Generate Gift Code
            </button>
         </div>
         <div className="pt-4 border-t border-gray-100 space-y-2">
            {giftCodes.map(g => (
               <div key={g.code} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-800">{g.code}</span>
                  <span className="text-[10px] font-black text-orange-600">₹{g.amount}</span>
               </div>
            ))}
         </div>
      </div>

      {/* PARTNER GAME REGISTRY */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4 shadow-xl">
         <h3 className="text-xs font-black font-orbitron text-cyan-600 uppercase tracking-widest">Partner Game Registry</h3>
         
         <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase ml-1">Game Name</label>
                  <input value={newGame.name} onChange={e => setNewGame({...newGame, name: e.target.value})} type="text" placeholder="Mega Win" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase ml-1">Icon</label>
                  <input value={newGame.icon} onChange={e => setNewGame({...newGame, icon: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-center" />
               </div>
            </div>
            
            <input value={newGame.url} onChange={e => setNewGame({...newGame, url: e.target.value})} type="text" placeholder="URL" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" />
            <input value={newGame.color} onChange={e => setNewGame({...newGame, color: e.target.value})} type="text" placeholder="from-red-600 to-red-500" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" />

            <button onClick={handleAddCustomGame} className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-white text-[10px] uppercase shadow-lg shadow-cyan-100">
               Register Partner Game
            </button>
         </div>

         <div className="pt-4 border-t border-gray-100 space-y-2">
            {customGames.map(game => (
               <div key={game.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                     <span className="text-xl">{game.icon}</span>
                     <div>
                        <p className="text-[10px] font-black text-gray-800">{game.name}</p>
                        <p className="text-[7px] text-gray-400 truncate max-w-[150px]">{game.url}</p>
                     </div>
                  </div>
                  <button onClick={() => onRemoveGame(game.id)} className="text-red-500 font-black text-[8px] uppercase bg-red-50 px-3 py-1 rounded-full">Remove</button>
               </div>
            ))}
         </div>
      </div>

      {/* LIVE STAKES MONITORING */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
         <div className="flex justify-between items-center">
            <h3 className="text-xs font-black font-orbitron text-purple-600 uppercase tracking-widest">Live Monitoring</h3>
            <span className="text-[8px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-100 font-black">LIVE</span>
         </div>
         
         <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            {userBets.slice(0, 50).map(bet => (
              <div key={bet.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-[10px] space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="font-black text-red-600">{getUserPhone(bet.userId)}</span>
                    <span className="text-gray-400 font-bold">{new Date(bet.timestamp).toLocaleTimeString()}</span>
                 </div>
                 <div className="flex justify-between items-center font-black">
                    <div className="flex items-center gap-2">
                       <span className="bg-white px-2 py-0.5 rounded text-gray-400 border border-gray-100">{bet.game}</span>
                       <span className="text-gray-800">ON: {String(bet.selection)}</span>
                    </div>
                    <span className="text-yellow-600">🪙 {bet.amount}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* FINANCE MONITOR */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
         <h3 className="text-xs font-black font-orbitron text-green-600 uppercase tracking-widest">Transaction Vault</h3>
         <div className="space-y-3">
            {pendingTxs.map(tx => (
              <div key={tx.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs font-black text-gray-800 uppercase">{tx.type} - ₹{tx.amount}</p>
                       <p className="text-[9px] text-red-500 font-bold">User: {getUserPhone(tx.userId)}</p>
                    </div>
                    {tx.screenshotUrl && <button onClick={() => setActiveImg(tx.screenshotUrl!)} className="w-10 h-10 bg-white rounded-lg text-xs flex items-center justify-center border border-gray-100">📷</button>}
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => onProcessTx(tx.id, 'Completed')} className="flex-1 bg-green-600 py-3 rounded-xl text-white text-[10px] font-black uppercase shadow-lg shadow-green-100">Approve</button>
                    <button onClick={() => onProcessTx(tx.id, 'Rejected')} className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase">Reject</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminView;
