
import React, { useState, useMemo } from 'react';
import { UserState, Tab } from '../types.ts';
import { VIP_LEVELS } from '../constants.tsx';

interface ProfileViewProps { 
  user: UserState; 
  setTab: (tab: Tab) => void; 
  onUpdateUser: (updatedUser: UserState) => void;
  onRedeemGift: (code: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setTab, onUpdateUser, onRedeemGift }) => {
  const [giftCode, setGiftCode] = useState('');

  const vipInfo = useMemo(() => {
    const currentVip = VIP_LEVELS.find(v => v.level === user.vipLevel) || VIP_LEVELS[0];
    const nextVip = VIP_LEVELS.find(v => v.level === user.vipLevel + 1);
    const progress = nextVip ? Math.min(100, (user.totalTurnover / nextVip.expNeeded) * 100) : 100;
    return { currentVip, nextVip, progress };
  }, [user.vipLevel, user.totalTurnover]);

  return (
    <div className="space-y-6 pb-12 px-3 pt-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-5xl border-4 border-white/5 shadow-2xl">
          👤
        </div>
        <h2 className="mt-4 text-xl font-black font-orbitron tracking-tight">{user.phone}</h2>
        <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">VIP {vipInfo.currentVip.label}</p>
      </div>

      {/* Gift Redemption */}
      <div className="bg-[#1e2330] rounded-3xl p-6 border border-white/5">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Gift Code Center</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="CODE-XXXX" 
            className="flex-1 bg-black/40 rounded-xl px-4 py-3 text-xs uppercase" 
            value={giftCode}
            onChange={e => setGiftCode(e.target.value)}
          />
          <button 
            onClick={() => { onRedeemGift(giftCode); setGiftCode(''); }}
            className="bg-yellow-600 px-6 rounded-xl font-black text-[10px] uppercase"
          >
            Redeem
          </button>
        </div>
      </div>

      <div className="bg-[#1e2330] rounded-[2.5rem] p-7 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black uppercase text-gray-500">VIP XP</p>
          <p className="text-xs font-black font-orbitron">{user.totalTurnover.toLocaleString()} / {vipInfo.nextVip?.expNeeded.toLocaleString() || 'MAX'}</p>
        </div>
        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${vipInfo.progress}%` }}></div>
        </div>
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-5 bg-red-500/5 text-red-500 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/10">
        Logout Session
      </button>
    </div>
  );
};

export default ProfileView;
