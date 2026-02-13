
import React, { useState } from 'react';
import { GameMode, GiftCode, CustomGame, Transaction } from '../types.ts';

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
}

const AdminView: React.FC<AdminViewProps> = ({ 
  adminControls, onUpdateControls, giftCodes, onAddGift, onAddGame, onRemoveGame, customGames, pendingTxs, onProcessTx 
}) => {
  const [selectedWinGoMode, setSelectedWinGoMode] = useState<GameMode>('30sec');
  const [giftInput, setGiftInput] = useState({ code: '', amount: 0 });
  const [txMessages, setTxMessages] = useState<Record<string, string>>({});
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const setWinGoOverride = (num: number) => {
    onUpdateControls({ ...adminControls, wingo: { ...adminControls.wingo, [selectedWinGoMode]: num } });
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-20">
      {activeImg && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4" onClick={() => setActiveImg(null)}>
           <img src={activeImg} className="max-w-full max-h-full rounded-xl" alt="Proof" />
        </div>
      )}

      {/* WIN GO CONTROL */}
      <div className="bg-[#1e2330] rounded-[2.5rem] p-6 border border-white/5 shadow-2xl">
        <h2 className="text-sm font-black font-orbitron flex items-center gap-2 mb-4 text-blue-500 uppercase tracking-widest">🎰 Win Go Core</h2>
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-4">
          {(['30sec', '1min', '3min', '5min'] as GameMode[]).map(mode => (
            <button key={mode} onClick={() => setSelectedWinGoMode(mode)} className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${selectedWinGoMode === mode ? 'bg-blue-600 border-blue-400' : 'bg-[#11131a] border-white/5 text-gray-500'}`}>{mode}</button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => setWinGoOverride(num)} className={`aspect-square rounded-xl flex items-center justify-center font-black text-lg border transition-all ${adminControls.wingo[selectedWinGoMode] === num ? 'bg-blue-600 border-white shadow-lg scale-110' : 'bg-[#11131a] border-white/10 text-gray-500'}`}>{num}</button>
          ))}
        </div>
      </div>

      {/* CRICKET CONTROL */}
      <div className="bg-[#1e2330] rounded-[2.5rem] p-6 border border-white/5 shadow-2xl">
        <h2 className="text-sm font-black font-orbitron flex items-center gap-2 mb-4 text-green-500 uppercase tracking-widest">🏏 Cricket Sync</h2>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 4, 6].map(run => (
            <button key={run} onClick={() => onUpdateControls({...adminControls, cricket: run})} className={`py-3 rounded-xl font-black text-xs border ${adminControls.cricket === run ? 'bg-green-600 border-white' : 'bg-[#11131a] border-white/5'}`}>{run} Runs</button>
          ))}
          <button onClick={() => onUpdateControls({...adminControls, cricket: null})} className="col-span-3 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase">Clear Override</button>
        </div>
      </div>

      {/* AVIATOR & VORTEX */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1e2330] rounded-3xl p-5 border border-white/5">
           <p className="text-[10px] font-black uppercase text-red-500 mb-3">✈️ Aviator</p>
           <input type="number" placeholder="Crash Point" className="w-full bg-black/40 rounded-xl px-4 py-3 text-xs font-bold border border-white/5 mb-2" value={adminControls.aviator || ''} onChange={e => onUpdateControls({...adminControls, aviator: parseFloat(e.target.value)})}/>
           <button onClick={() => onUpdateControls({...adminControls, aviator: 1.00})} className="w-full py-2 bg-red-600 text-[9px] font-black uppercase rounded-lg">Instant Crash</button>
        </div>
        <div className="bg-[#1e2330] rounded-3xl p-5 border border-white/5">
           <p className="text-[10px] font-black uppercase text-purple-500 mb-3">🌀 Vortex</p>
           <div className="grid grid-cols-2 gap-2">
             {[0, 9].map(n => (
               <button key={n} onClick={() => onUpdateControls({...adminControls, vortex: n})} className={`py-2 rounded-lg text-[9px] font-black border ${adminControls.vortex === n ? 'bg-purple-600 border-white' : 'bg-black/20 border-white/5'}`}>Idx {n}</button>
             ))}
             <button onClick={() => onUpdateControls({...adminControls, vortex: null})} className="col-span-2 py-1 bg-white/5 text-[8px] rounded uppercase">Clear</button>
           </div>
        </div>
      </div>

      {/* REQUESTS MONITOR */}
      <div className="bg-[#1e2330] rounded-3xl p-6 border border-white/5 space-y-4">
         <h3 className="text-xs font-black font-orbitron text-green-500 uppercase">Requests Monitor ({pendingTxs.length})</h3>
         <div className="space-y-3">
            {pendingTxs.map(tx => (
              <div key={tx.id} className="bg-[#11131a] p-4 rounded-2xl border border-white/5 space-y-3">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs font-black uppercase tracking-wider">{tx.type} - ₹{tx.amount}</p>
                       <p className="text-[9px] text-blue-500 font-bold">UPI: {tx.userUpiId}</p>
                    </div>
                    {tx.screenshotUrl && <button onClick={() => setActiveImg(tx.screenshotUrl!)} className="w-10 h-10 bg-white/5 rounded-lg text-xs flex items-center justify-center">📷</button>}
                 </div>
                 <textarea placeholder="Reason/Note" value={txMessages[tx.id] || ''} onChange={(e) => setTxMessages(p => ({ ...p, [tx.id]: e.target.value }))} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] h-16"/>
                 <div className="flex gap-2">
                    <button onClick={() => onProcessTx(tx.id, 'Completed', txMessages[tx.id])} className="flex-1 bg-green-600 py-3 rounded-xl text-[10px] font-black uppercase">Approve</button>
                    <button onClick={() => onProcessTx(tx.id, 'Rejected', txMessages[tx.id])} className="flex-1 bg-red-600/20 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase">Reject</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminView;
