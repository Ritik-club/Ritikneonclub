
import React, { useState } from 'react';

interface AuthModalProps {
  onAuth: (phone: string, password: string, isRegistering: boolean, referralCode?: string) => void;
}

export default function AuthModal({ onAuth }: AuthModalProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Invalid phone number!");
    if (password.length < 6) return alert("Password must be at least 6 characters!");
    onAuth(phone, password, isRegistering, refCode);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] rotate-3">
            <span className="text-4xl font-bold font-orbitron text-white">R</span>
          </div>
          <h1 className="text-4xl font-bold font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Ritik Club
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Predict • Win • Dominate</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {isRegistering && (
            <div className="space-y-1 animate-in fade-in duration-300">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Referral Code</label>
              <input 
                type="text" 
                placeholder="Optional invite code"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 active:scale-95 transition-all text-white border border-white/10 uppercase tracking-widest"
          >
            {isRegistering ? 'Create Account' : 'Login Securely'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-[9px] text-gray-500 text-center leading-relaxed font-bold uppercase tracking-tighter">
          🛡️ Safe & Secure Platform • Support: +91 6207559408
        </div>
      </div>
    </div>
  );
}
