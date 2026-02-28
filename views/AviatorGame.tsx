
import React, { useState, useEffect, useRef } from 'react';
import { Tab, GameType } from '../types.ts';

interface AviatorGameProps {
  balance: number;
  adminOverride: number | null;
  onUpdateBalance: (amount: number) => void;
  onClearOverride: () => void;
  hasAccess: boolean;
  setTab: (t: Tab) => void;
  onSound: (k: any) => void;
  userBets: any[];
}

const AviatorGame: React.FC<AviatorGameProps> = ({ balance, adminOverride, onUpdateBalance, onClearOverride, hasAccess, setTab, onSound, userBets }) => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(1.00);
  const [bet1, setBet1] = useState({ amount: 10, active: false, cashed: false });
  const [bet2, setBet2] = useState({ amount: 10, active: false, cashed: false });
  const [history, setHistory] = useState([1.08, 1.00, 2.90, 1.23, 3.31, 1.71]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const periodDuration = 25000;
      const cycleTime = now % periodDuration;
      const waitTime = 8000;

      if (cycleTime < waitTime) {
        setIsFlying(false);
        setIsCrashed(false);
        setMultiplier(1.00);
        if (cycleTime < 500) {
           setBet1(p => ({ ...p, active: false, cashed: false }));
           setBet2(p => ({ ...p, active: false, cashed: false }));
        }
      } else {
        if (!isFlying) {
          // PROFIT CAP: Target is between 1 and 5 (rarely reaching 5)
          const roll = Math.random();
          let target: number;
          if (adminOverride !== null) {
            target = adminOverride;
            onClearOverride();
          } else if (roll > 0.98) {
            target = 4.0 + Math.random(); // Rare 4-5x
          } else if (roll > 0.8) {
            target = 2.0 + Math.random() * 2; // Medium 2-4x
          } else {
            target = 1.0 + Math.random() * 1.5; // Frequent 1-2.5x
          }
          setCrashPoint(Math.min(target, 5.0)); // Strict 5.0 Cap
          setIsFlying(true);
        }
        const elapsed = (cycleTime - waitTime) / 1000;
        const currentMult = Math.pow(1.08, elapsed);
        if (currentMult >= crashPoint) {
          if (!isCrashed) {
             onSound('crash');
             setHistory(prev => [crashPoint, ...prev].slice(0, 10));
          }
          setIsCrashed(true);
          setMultiplier(crashPoint);
        } else {
          setMultiplier(currentMult);
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isFlying, adminOverride, crashPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    const particles: {x: number, y: number, s: number}[] = Array.from({length: 20}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      s: Math.random() * 2 + 1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for(let i=0; i<canvas.height; i+=40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Draw Particles (Clouds/Stars effect)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      particles.forEach(p => {
        p.x -= isFlying && !isCrashed ? multiplier * 0.5 : 0.2;
        if (p.x < 0) p.x = canvas.width;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isFlying) {
        ctx.beginPath();
        ctx.strokeStyle = isCrashed ? '#ef4444' : '#ef4444';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.moveTo(0, canvas.height);
        
        const progress = Math.min((multiplier - 1) / 4, 1);
        const targetX = progress * (canvas.width * 0.8);
        const targetY = canvas.height - (Math.pow(multiplier, 1.5) * 15);
        
        ctx.quadraticCurveTo(targetX / 2, canvas.height, targetX, targetY);
        ctx.stroke();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = isCrashed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.5)';
        
        // Draw Plane
        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.rotate(isCrashed ? 0.5 : -0.2);
        ctx.font = '32px serif';
        ctx.fillText('✈️', -16, 10);
        ctx.restore();
        
        ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [multiplier, isFlying, isCrashed]);

  const handleBet = (panel: 1 | 2) => {
    const bet = panel === 1 ? bet1 : bet2;
    if (balance < bet.amount) return;
    onUpdateBalance(-bet.amount);
    if (panel === 1) setBet1({ ...bet1, active: true });
    else setBet2({ ...bet2, active: true });
    onSound('bet');
  };

  const handleCashout = (panel: 1 | 2) => {
    const bet = panel === 1 ? bet1 : bet2;
    if (!isFlying || isCrashed || !bet.active || bet.cashed) return;
    const win = bet.amount * multiplier;
    onUpdateBalance(win);
    if (panel === 1) setBet1({ ...bet1, cashed: true });
    else setBet2({ ...bet2, cashed: true });
    onSound('win');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-24">
      <div className="flex gap-2 p-2 bg-gray-50 overflow-x-auto no-scrollbar border-b border-gray-100">
        {history.map((h, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-[9px] font-black border bg-white ${h > 3 ? 'text-red-600 border-red-200 shadow-sm' : 'text-gray-400 border-gray-200'}`}>{h.toFixed(2)}x</span>
        ))}
      </div>

      <div className="relative h-72 bg-gray-50 m-2 rounded-3xl border border-gray-100 overflow-hidden flex flex-col items-center justify-center shadow-inner">
         <canvas ref={canvasRef} width={400} height={300} className="absolute inset-0 w-full h-full opacity-60" />
         <div className="z-10 text-center">
            {isCrashed ? (
              <div className="space-y-2">
                <p className="text-5xl font-black font-orbitron text-red-500">FLEW AWAY!</p>
                <p className="text-2xl font-black font-orbitron text-gray-400">{multiplier.toFixed(2)}x</p>
              </div>
            ) : isFlying ? (
              <p className="text-7xl font-black font-orbitron text-red-600">{multiplier.toFixed(2)}x</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-black text-red-600 uppercase tracking-widest">Place your bets</p>
                <p className="text-4xl font-black font-orbitron text-red-600">{Math.max(0, Math.ceil((8000 - (Date.now() % 25000)) / 1000))}s</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600 transition-all duration-100" style={{ width: `${((Date.now() % 25000) / 8000) * 100}%` }}></div>
                </div>
              </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-2">
         {[1, 2].map((p: any) => {
           const b = p === 1 ? bet1 : bet2;
           const sB = p === 1 ? setBet1 : setBet2;
           const isLocked = b.active && !b.cashed && !isCrashed;
           return (
             <div key={p} className="bg-white p-4 rounded-3xl border border-gray-100 flex gap-4 items-center shadow-sm">
                <div className="flex-1 space-y-2">
                   <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                      <button disabled={b.active} onClick={() => sB({...b, amount: Math.max(10, b.amount-10)})} className="text-xl font-black text-red-600">-</button>
                      <span className="font-orbitron font-black text-sm">{b.amount}.00</span>
                      <button disabled={b.active} onClick={() => sB({...b, amount: b.amount+10})} className="text-xl font-black text-red-600">+</button>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      {[10, 50].map(v => <button key={v} disabled={b.active} onClick={() => sB({...b, amount: v})} className="bg-gray-50 py-1 rounded-lg text-[10px] font-black text-gray-500 border border-gray-100">INR {v}</button>)}
                   </div>
                </div>
                {!b.active ? (
                  <button onClick={() => handleBet(p)} className="flex-1 h-full bg-red-600 text-white rounded-2xl font-black text-xl uppercase py-4 shadow-lg shadow-red-100 active:scale-95">BET</button>
                ) : (
                  <button onClick={() => handleCashout(p)} disabled={isCrashed || b.cashed} className={`flex-1 h-full rounded-2xl font-black text-sm uppercase py-4 text-white shadow-lg transition-all ${b.cashed ? 'bg-green-500 shadow-green-100' : isCrashed ? 'bg-gray-400' : 'bg-red-600'}`}>
                    {b.cashed ? 'CASHED' : isCrashed ? 'CRASHED' : `OUT ${(b.amount * multiplier).toFixed(1)}`}
                  </button>
                )}
             </div>
           );
         })}
      </div>
      <p className="text-center text-[8px] font-black text-gray-300 uppercase mt-2">Maximum Safe Multiplier: 5.0x Protocol Capped</p>
    </div>
  );
};

export default AviatorGame;
