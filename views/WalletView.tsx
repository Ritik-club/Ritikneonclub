
import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../types.ts';

interface WalletViewProps {
  balance: number;
  onDeposit: (data: { utr: string, upiId: string, screenshot: string, amount: number }) => void;
  onWithdraw: (data: { amount: number, upiId: string }) => void;
  transactions: Transaction[];
}

const WalletView: React.FC<WalletViewProps> = ({ balance, onDeposit, onWithdraw, transactions }) => {
  const [view, setView] = useState<'Main' | 'Deposit' | 'Withdraw'>('Main');
  const [utr, setUtr] = useState('');
  const [userUpi, setUserUpi] = useState('');
  const [amount, setAmount] = useState('20');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  // Calculate total successful deposits in INR
  const totalApprovedDepositsInr = transactions
    .filter(t => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const canWithdraw = totalApprovedDepositsInr >= 20;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getStatusDisplay = (status: TransactionStatus) => {
    switch (status) {
      case 'Pending': return <span className="text-yellow-500 text-[9px] font-black uppercase">Pending Review</span>;
      case 'Completed': return <span className="text-green-500 text-[9px] font-black uppercase">Approved</span>;
      case 'Rejected': return <span className="text-red-500 text-[9px] font-black uppercase">Declined</span>;
      default: return null;
    }
  };

  if (view === 'Deposit') {
    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('Main')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">❮</button>
          <h2 className="text-xl font-bold font-orbitron">Add Funds</h2>
        </div>

        <div className="bg-[#1e2330] rounded-3xl p-6 border border-white/5 text-center space-y-4">
           <div className="w-48 h-48 bg-white p-2 mx-auto rounded-xl">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=6207559408@naviaxis&pn=Rishi%20Kumar" alt="QR" className="w-full" />
           </div>
           <div>
             <p className="text-[12px] text-white font-black uppercase tracking-widest">RISHI KUMAR</p>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">UPI ID: 6207559408@naviaxis</p>
           </div>
           <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest border-t border-white/5 pt-4">Rate: 1 ₹ = 10 Coins</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] text-gray-500 font-black uppercase ml-1">Deposit Amount (₹) - Min ₹20</label>
            <input type="number" placeholder="Min ₹20" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-[#1e2330] border border-white/5 rounded-2xl p-4 text-sm font-bold" />
            <p className="text-[8px] text-blue-500/60 font-black uppercase ml-1">You will get: {Number(amount) * 10} Coins</p>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-gray-500 font-black uppercase ml-1">Your UPI ID</label>
            <input type="text" placeholder="UPI ID from which you paid" value={userUpi} onChange={e=>setUserUpi(e.target.value)} className="w-full bg-[#1e2330] border border-white/5 rounded-2xl p-4 text-sm font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-gray-500 font-black uppercase ml-1">UTR Number (12 Digits)</label>
            <input type="text" placeholder="12-digit Transaction UTR" value={utr} onChange={e=>setUtr(e.target.value)} className="w-full bg-[#1e2330] border border-white/5 rounded-2xl p-4 text-sm font-mono" />
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 font-black uppercase ml-1">Upload Payment Screenshot</p>
            <label className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
               {screenshot ? <img src={screenshot} className="h-full object-contain p-2" alt="Preview" /> : <span className="text-xs font-bold text-blue-500">+ Click to Select Proof</span>}
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <button onClick={() => {
            if (Number(amount) < 20) return alert("Minimum deposit is ₹20");
            if (!utr || !userUpi || !screenshot) return alert("Fill all details and upload proof!");
            onDeposit({ utr, upiId: userUpi, screenshot, amount: Number(amount) });
            setView('Main');
          }} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Submit Deposit Request</button>
        </div>
      </div>
    );
  }

  if (view === 'Withdraw') {
    if (!canWithdraw) {
      return (
        <div className="p-4 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('Main')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">❮</button>
            <h2 className="text-xl font-bold font-orbitron">Withdrawal</h2>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-10 text-center space-y-6 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-3xl shadow-xl border border-red-500/20 mb-2">🔒</div>
             <h3 className="text-lg font-black font-orbitron text-red-500 uppercase">Withdrawal Locked</h3>
             <div className="space-y-2">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Requirement Not Met</p>
               <p className="text-xs font-bold text-white leading-relaxed">
                 To activate withdrawal features, you must deposit a minimum of <span className="text-yellow-500">20 ₹</span>.
               </p>
               <div className="bg-white/5 rounded-xl p-3 mt-4 border border-white/5">
                 <p className="text-[9px] text-gray-500 uppercase font-black">Your Progress</p>
                 <div className="h-2 w-full bg-black/40 rounded-full mt-2 overflow-hidden border border-white/5">
                    <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (totalApprovedDepositsInr / 20) * 100)}%` }}></div>
                 </div>
                 <p className="text-[10px] text-white font-black mt-2 font-orbitron">₹ {totalApprovedDepositsInr.toFixed(2)} / ₹ 20.00</p>
               </div>
             </div>
             <button onClick={() => setView('Deposit')} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4">Deposit Now to Unlock</button>
          </div>
        </div>
      );
    }

    const coinAmt = Number(amount) || 0;
    const rawInr = coinAmt / 10;
    const tds = rawInr * 0.10;
    const finalReceive = Math.max(0, rawInr - tds);

    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('Main')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">❮</button>
          <h2 className="text-xl font-bold font-orbitron">Withdrawal</h2>
        </div>

        <div className="bg-[#1e2330] rounded-[2.5rem] p-8 border border-white/5 space-y-6 text-center shadow-xl">
           <p className="text-[10px] text-gray-500 font-black uppercase">Available for Withdrawal</p>
           <p className="text-3xl font-black font-orbitron text-yellow-500">🪙 {balance.toLocaleString()}</p>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 space-y-2">
           <div className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Important Withdrawal Policy</p>
           </div>
           <ul className="space-y-1">
              <li className="text-[11px] text-gray-300 font-bold">• 10% TDS will be deducted from your amount.</li>
              <li className="text-[11px] text-gray-300 font-bold">• Conversion Rate: 10 Coins = 1 ₹</li>
           </ul>
        </div>

        <div className="space-y-4">
           <div className="space-y-1">
             <label className="text-[9px] text-gray-500 font-black uppercase ml-1">Amount to Withdraw (In Coins) - Min 200</label>
             <input 
               type="number" 
               placeholder="Min 200 Coins (₹20)" 
               value={amount} 
               onChange={e=>setAmount(e.target.value)} 
               className="w-full bg-[#1e2330] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-1 focus:ring-yellow-500 outline-none" 
             />
           </div>

           {coinAmt > 0 && (
             <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                   <span>Value in INR:</span>
                   <span>₹ {rawInr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-red-400">
                   <span>TDS (10%):</span>
                   <span>- ₹ {tds.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between">
                   <span className="text-[10px] font-black uppercase text-white">You will receive:</span>
                   <span className="text-sm font-black text-green-500">₹ {finalReceive.toFixed(2)}</span>
                </div>
             </div>
           )}

           <div className="space-y-1">
             <label className="text-[9px] text-gray-500 font-black uppercase ml-1">Receiver UPI ID</label>
             <input 
               type="text" 
               placeholder="UPI ID to receive funds" 
               value={userUpi} 
               onChange={e=>setUserUpi(e.target.value)} 
               className="w-full bg-[#1e2330] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-1 focus:ring-yellow-500 outline-none" 
             />
           </div>
           
           <button onClick={() => {
             const coinVal = Number(amount);
             if (coinVal < 200) return alert("Minimum withdrawal is 200 coins (₹20)");
             if (!amount || !userUpi) return alert("Enter amount and UPI ID");
             onWithdraw({ amount: coinVal, upiId: userUpi });
             setView('Main');
           }} className="w-full bg-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Request Withdrawal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-[#1e2330] rounded-[2.5rem] p-8 text-center border border-white/5 shadow-2xl">
         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Total Wallet Assets</p>
         <h2 className="text-4xl font-black font-orbitron mb-8 flex items-center justify-center gap-2">
            <span className="text-yellow-500">🪙</span> {balance.toLocaleString()}
         </h2>
         <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setView('Deposit')} className="bg-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-900/20 active:scale-95 transition-all">Deposit</button>
            <button 
              onClick={() => setView('Withdraw')} 
              className={`py-4 rounded-2xl font-black text-[10px] uppercase border active:scale-95 transition-all ${
                canWithdraw 
                ? 'bg-red-600/10 text-red-500 border-red-500/20' 
                : 'bg-gray-500/10 text-gray-500 border-gray-500/20 grayscale'
              }`}
            >
              {canWithdraw ? 'Withdraw' : 'Locked 🔒'}
            </button>
         </div>
      </div>

      <div className="bg-[#1e2330] rounded-3xl p-6 border border-white/5">
         <h3 className="text-xs font-black font-orbitron text-gray-400 mb-4 uppercase">Financial History</h3>
         <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-[#11131a] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase">{tx.type} (₹{tx.amount})</p>
                    <p className="text-[8px] text-gray-600 font-bold">{new Date(tx.timestamp).toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className={`text-xs font-black ${tx.type === 'Deposit' ? 'text-green-500' : 'text-red-500'}`}>
                       {tx.type === 'Deposit' ? '+' : '-'} {tx.coins}
                    </p>
                    {getStatusDisplay(tx.status)}
                 </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-10 opacity-20">
                <p className="text-4xl mb-2">💸</p>
                <p className="text-[10px] font-black uppercase tracking-widest">No transactions yet</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default WalletView;
