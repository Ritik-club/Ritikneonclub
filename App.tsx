
import React, { useState, useEffect, useCallback } from 'react';
import { Tab, UserState, GameResult, ColorType, UserBet, GameMode, GameType, GiftCode, CustomGame, Transaction, Message } from './types.ts';
import { COLORS_BY_NUMBER } from './constants.tsx';
import Navigation from './components/Navigation.tsx';
import HomeView from './views/HomeView.tsx';
import HistoryView from './views/HistoryView.tsx';
import WalletView from './views/WalletView.tsx';
import ProfileView from './views/ProfileView.tsx';
import AdminView from './views/AdminView.tsx';
import InboxView from './views/InboxView.tsx';
import AuthModal from './components/AuthModal.tsx';
import ResultModal from './components/ResultModal.tsx';
import WinGoGame from './views/WinGoGame.tsx';
import AviatorGame from './views/AviatorGame.tsx';
import MinesGame from './views/MinesGame.tsx';
import CricketGame from './views/CricketGame.tsx';
import VortexGame from './views/VortexGame.tsx';
import ChickenGame from './views/ChickenGame.tsx';
import DragonTigerGame from './views/DragonTigerGame.tsx';
import K3Game from './views/K3Game.tsx';
import D5Game from './views/D5Game.tsx';
import PenaltyGame from './views/PenaltyGame.tsx';
import BaccaratGame from './views/BaccaratGame.tsx';
import PlinkoGame from './views/PlinkoGame.tsx';
import WheelGame from './views/WheelGame.tsx';

const ADMIN_PHONE = "6207559408";
const WELCOME_BONUS = 25;
const MODE_DURATIONS: Record<GameMode, number> = { '30sec': 30, '1min': 60, '3min': 180, '5min': 300 };

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  bet: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  loss: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  crash: 'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [activeMode, setActiveMode] = useState<GameMode>('30sec');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [dbUsers, setDbUsers] = useState<UserState[]>(() => {
    try {
      const saved = localStorage.getItem('rc_users_db');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [user, setUser] = useState<UserState | null>(() => {
    try {
      const saved = localStorage.getItem('rc_current_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [userBets, setUserBets] = useState<UserBet[]>(() => {
    try {
      const saved = localStorage.getItem('rc_bets');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('rc_tx');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('rc_messages');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [giftCodes, setGiftCodes] = useState<GiftCode[]>(() => {
    try {
      const saved = localStorage.getItem('rc_gifts');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [customGames, setCustomGames] = useState<CustomGame[]>(() => {
    try {
      const saved = localStorage.getItem('rc_custom_games');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [adminControls, setAdminControls] = useState<Record<string, any>>({
    wingo: {},
    aviator: null,
    mines: null,
    cricket: null,
    vortex: null,
    chicken: null,
    dragonTiger: null,
    k3: null,
    d5: null,
    penalty: null,
    plinko: null,
    wheel: null,
    baccarat: null
  });

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [lastProcessedPeriod, setLastProcessedPeriod] = useState<Record<string, string>>({});
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [lastProfit, setLastProfit] = useState<number>(0);
  const [results, setResults] = useState<Record<string, GameResult[]>>({
    '30sec': [], '1min': [], '3min': [], '5min': []
  });

  const playSound = (key: keyof typeof SOUNDS) => {
    if (!soundEnabled) return;
    const audio = new Audio(SOUNDS[key]);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    localStorage.setItem('rc_users_db', JSON.stringify(dbUsers || []));
    if (user) localStorage.setItem('rc_current_session', JSON.stringify(user));
  }, [user, dbUsers]);

  useEffect(() => {
    localStorage.setItem('rc_bets', JSON.stringify(userBets || []));
    localStorage.setItem('rc_tx', JSON.stringify(transactions || []));
    localStorage.setItem('rc_messages', JSON.stringify(messages || []));
    localStorage.setItem('rc_gifts', JSON.stringify(giftCodes || []));
    localStorage.setItem('rc_custom_games', JSON.stringify(customGames || []));
  }, [userBets, transactions, messages, giftCodes, customGames]);

  const totalApprovedInr = (transactions || [])
    .filter(t => t.userId === user?.id && t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const hasAccess = totalApprovedInr >= 20;

  const getSyncData = (mode: GameMode) => {
    const now = Date.now();
    const duration = MODE_DURATIONS[mode];
    const periodTimestamp = Math.floor(now / (duration * 1000));
    const timeLeft = duration - (Math.floor(now / 1000) % duration);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return { periodId: `${dateStr}${mode}${periodTimestamp}`, timeLeft };
  };

  const processDraw = useCallback((mode: GameMode, period: string) => {
    const currentBets = (userBets || []).filter(b => b.mode === mode && b.period === period && b.status === 'Pending');
    let winningNum: number = 0;
    const override = adminControls.wingo[mode];
    if (override !== undefined && override !== null) {
      winningNum = override;
      setAdminControls(prev => ({ ...prev, wingo: { ...prev.wingo, [mode]: null } }));
    } else {
      let minPayout = Infinity;
      let candidates: number[] = [];
      for (let n = 0; n <= 9; n++) {
        let totalHousePayout = 0;
        const colors = COLORS_BY_NUMBER[n] as ColorType[];
        const bs = n >= 5 ? 'Big' : 'Small';
        currentBets.forEach(bet => {
          // CAP: Numbers now 4.8x instead of 8.92x
          if (typeof bet.selection === 'number' && bet.selection === n) totalHousePayout += bet.amount * 4.8;
          else if (bet.selection === 'Big' || bet.selection === 'Small') { if (bet.selection === bs) totalHousePayout += bet.amount * 1.96; }
          else if (colors.includes(bet.selection as ColorType)) {
            let mult = 1.96;
            if ((n === 0 || n === 5) && (bet.selection === ColorType.RED || bet.selection === ColorType.GREEN)) mult = 1.5;
            if (bet.selection === ColorType.VIOLET) mult = 4.41;
            totalHousePayout += bet.amount * mult;
          }
        });
        if (totalHousePayout < minPayout) { minPayout = totalHousePayout; candidates = [n]; }
        else if (totalHousePayout === minPayout) candidates.push(n);
      }
      winningNum = candidates[Math.floor(Math.random() * candidates.length)];
    }
    const result: GameResult = { id: "RES" + Math.random().toString(36).substr(2, 5).toUpperCase(), period, number: winningNum, colors: COLORS_BY_NUMBER[winningNum] as ColorType[], bigSmall: winningNum >= 5 ? 'Big' : 'Small', timestamp: Date.now() };
    setResults(prev => ({ ...prev, [mode]: [result, ...(prev[mode] || [])].slice(0, 50) }));
    
    let totalProfit = 0;
    let hadBet = false;
    currentBets.forEach(bet => {
      hadBet = true;
      let win = false;
      let mult = 0;
      if (typeof bet.selection === 'number') { if (bet.selection === winningNum) { win = true; mult = 4.8; } }
      else if (bet.selection === 'Big' || bet.selection === 'Small') { if (bet.selection === result.bigSmall) { win = true; mult = 1.96; } }
      else if (result.colors.includes(bet.selection as ColorType)) {
        win = true; mult = 1.96;
        if ((winningNum === 0 || winningNum === 5) && (bet.selection === ColorType.RED || bet.selection === ColorType.GREEN)) mult = 1.5;
        if (bet.selection === ColorType.VIOLET) mult = 4.41;
      }
      if (win) totalProfit += (bet.amount * mult);
    });
    
    setUserBets(prev => (prev || []).map(bet => {
      if (bet.mode === mode && bet.period === period && bet.status === 'Pending') {
        let win = false;
        let mult = 0;
        if (typeof bet.selection === 'number') { if (bet.selection === winningNum) { win = true; mult = 4.8; } }
        else if (bet.selection === 'Big' || bet.selection === 'Small') { if (bet.selection === result.bigSmall) { win = true; mult = 1.96; } }
        else if (result.colors.includes(bet.selection as ColorType)) { win = true; mult = 1.96; if ((winningNum === 0 || winningNum === 5) && (bet.selection === ColorType.RED || bet.selection === ColorType.GREEN)) mult = 1.5; if (bet.selection === ColorType.VIOLET) mult = 4.41; }
        if (win) return { ...bet, status: 'Win', payout: bet.amount * mult };
        return { ...bet, status: 'Loss', payout: 0 };
      }
      return bet;
    }));
    
    if (totalProfit > 0) {
      setUser(curr => {
        if (!curr) return null;
        const updated = { ...curr, balance: curr.balance + totalProfit };
        setDbUsers(users => (users || []).map(u => u.id === curr.id ? updated : u));
        return updated;
      });
      playSound('win');
    } else if (hadBet) playSound('loss');
    if (activeGame === GameType.WINGO && mode === activeMode && hadBet) { setLastResult(result); setLastProfit(totalProfit); setIsResultModalOpen(true); }
  }, [activeGame, activeMode, userBets, adminControls, soundEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      (Object.keys(MODE_DURATIONS) as GameMode[]).forEach(mode => {
        const { periodId } = getSyncData(mode);
        if (lastProcessedPeriod[mode] && lastProcessedPeriod[mode] !== periodId) processDraw(mode, lastProcessedPeriod[mode]);
        setLastProcessedPeriod(prev => ({ ...prev, [mode]: periodId }));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lastProcessedPeriod, processDraw]);

  const updateBalance = (amount: number) => {
    setUser(curr => {
      if (!curr) return null;
      const updated = { ...curr, balance: curr.balance + amount };
      setDbUsers(users => (users || []).map(u => u.id === curr.id ? updated : u));
      return updated;
    });
  };

  const handleBet = (betData: { selection: any, amount: number, gameOverride?: GameType }) => {
    if (!user) return;
    if (user.balance < betData.amount) { alert("Insufficient balance!"); return; }
    const { periodId } = getSyncData(activeMode);
    const existing = userBets.find(b => b.userId === user.id && b.period === periodId && b.mode === activeMode && b.status === 'Pending');
    if (existing) { alert("Bet locked for this round!"); return; }

    playSound('bet');
    const newBet: UserBet = { 
      id: "BET" + Math.random().toString(36).substr(2, 5).toUpperCase(), 
      userId: user.id,
      game: betData.gameOverride || activeGame || GameType.WINGO, 
      period: periodId, 
      mode: activeMode, 
      amount: betData.amount, 
      selection: betData.selection, 
      status: 'Pending', 
      timestamp: Date.now() 
    };
    setUserBets(prev => [newBet, ...(prev || [])]);
    setUser(curr => {
      if (!curr) return null;
      const updated = { ...curr, balance: curr.balance - betData.amount, totalTurnover: curr.totalTurnover + betData.amount };
      setDbUsers(users => (users || []).map(u => u.id === curr.id ? updated : u));
      return updated;
    });
  };

  const handleProcessTx = (id: string, status: 'Completed' | 'Rejected', adminMessage?: string) => {
    setTransactions(prev => (prev || []).map(tx => {
      if (tx.id === id) {
        if (tx.status !== 'Pending') return tx;
        if (tx.type === 'Deposit' && status === 'Completed') {
          setDbUsers(users => (users || []).map(u => {
            if (u.id === tx.userId) {
              const updated = { ...u, balance: u.balance + tx.coins };
              if (user && user.id === u.id) setUser(updated);
              return updated;
            }
            return u;
          }));
        }
        if (tx.type === 'Withdrawal' && status === 'Rejected') {
          setDbUsers(users => (users || []).map(u => {
            if (u.id === tx.userId) {
              const updated = { ...u, balance: u.balance + tx.coins };
              if (user && user.id === u.id) setUser(updated);
              return updated;
            }
            return u;
          }));
        }
        const title = tx.type === 'Withdrawal' ? `Withdrawal ${status}` : `Deposit ${status}`;
        const content = adminMessage ? `Status Update: ${status}\nNote: ${adminMessage}` : `Status Update: ${status}`;
        const newMsg: Message = { id: "MSG" + Date.now(), userId: tx.userId, title, content, timestamp: Date.now(), isRead: false, type: 'System' };
        setMessages(prevMsgs => [newMsg, ...(prevMsgs || [])]);
        return { ...tx, status };
      }
      return tx;
    }));
  };

  const sync = getSyncData(activeMode);
  const unreadCount = user ? (messages || []).filter(m => m.userId === user.id && !m.isRead).length : 0;

  if (!user) return <AuthModal onAuth={(p, pass, reg, ref) => {
    if (reg) { const newUser: UserState = { id: "U"+Date.now(), phone: p, password: pass, balance: WELCOME_BONUS, referralCode: ref || "RC"+Math.random(), vipLevel: 1, totalTurnover: 0 }; setDbUsers(prev => [...(prev || []), newUser]); setUser(newUser); }
    else { const u = (dbUsers || []).find(x => x.phone === p && x.password === pass); if (u) setUser(u); else alert("Wrong details"); }
  }} />;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex justify-center">
      <div className="w-full max-w-md pb-20 relative bg-white shadow-2xl overflow-x-hidden h-screen flex flex-col">
        {isResultModalOpen && <ResultModal result={lastResult} userProfit={lastProfit} hasBet={true} onClose={() => setIsResultModalOpen(false)} />}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            {activeGame && <button onClick={() => { playSound('click'); setActiveGame(null); }} className="mr-2 text-xl text-blue-600">❮</button>}
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg text-white">R</div>
            <div>
              <h1 className="text-lg font-black font-orbitron tracking-tighter text-blue-600">Ritik Club</h1>
              <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">Safe Prediction v7.2</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 font-black">BALANCE</p><p className="text-sm font-black text-blue-600 font-orbitron">🪙 {user.balance.toFixed(2)}</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
          {activeTab === Tab.HOME && !activeGame && <HomeView user={user} onSelectGame={(g) => { playSound('click'); setActiveGame(g); }} customGames={customGames || []} />}
          {activeTab === Tab.HOME && activeGame === GameType.WINGO && <WinGoGame userBets={userBets} hasAccess={hasAccess} setTab={setActiveTab} activeMode={activeMode} setActiveMode={setActiveMode} timeLeft={sync.timeLeft} period={sync.periodId} results={results[activeMode] || []} balance={user.balance} onBet={handleBet} />}
          {activeTab === Tab.HOME && activeGame === GameType.AVIATOR && <AviatorGame userBets={userBets} hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.aviator} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, aviator: null}))} onSound={playSound} />}
          {activeTab === Tab.HOME && activeGame === GameType.MINES && <MinesGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.mines} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, mines: null}))} onSound={playSound} userBets={userBets} />}
          {activeTab === Tab.HOME && activeGame === GameType.D5 && <D5Game hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.d5} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, d5: null}))} onSound={playSound} />}
          {activeTab === Tab.HOME && activeGame === GameType.PENALTY && <PenaltyGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} onUpdateBalance={updateBalance} onSound={playSound} adminOverride={adminControls.penalty} onClearOverride={() => setAdminControls(p => ({...p, penalty: null}))} userBets={userBets} />}
          {activeTab === Tab.HOME && activeGame === GameType.PLINKO && <PlinkoGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} onUpdateBalance={updateBalance} onSound={playSound} adminOverride={adminControls.plinko} onClearOverride={() => setAdminControls(p => ({...p, plinko: null}))} userBets={userBets} />}
          {activeTab === Tab.HOME && activeGame === GameType.WHEEL && <WheelGame userBets={userBets} hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} onUpdateBalance={updateBalance} onSound={playSound} adminOverride={adminControls.wheel} onClearOverride={() => setAdminControls(p => ({...p, wheel: null}))} />}
          {activeTab === Tab.HOME && activeGame === GameType.BACCARAT && <BaccaratGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} onUpdateBalance={updateBalance} onSound={playSound} adminOverride={adminControls.baccarat} onClearOverride={() => setAdminControls(p => ({...p, baccarat: null}))} userBets={userBets} />}
          {activeTab === Tab.HOME && activeGame === GameType.CRICKET && <CricketGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.cricket} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, cricket: null}))} />}
          {activeTab === Tab.HOME && activeGame === GameType.VORTEX && <VortexGame userBets={userBets} hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.vortex} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, vortex: null}))} />}
          {activeTab === Tab.HOME && activeGame === GameType.CHICKEN && <ChickenGame userBets={userBets} hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.chicken} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, chicken: null}))} />}
          {activeTab === Tab.HOME && activeGame === GameType.DRAGON_TIGER && <DragonTigerGame hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.dragonTiger} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, dragonTiger: null}))} onSound={playSound} />}
          {activeTab === Tab.HOME && activeGame === GameType.K3 && <K3Game hasAccess={hasAccess} setTab={setActiveTab} balance={user.balance} adminOverride={adminControls.k3} onUpdateBalance={updateBalance} onClearOverride={() => setAdminControls(p => ({...p, k3: null}))} />}
          {activeTab === Tab.PROFILE && <ProfileView user={user} setTab={setActiveTab} onUpdateUser={setUser} onRedeemGift={(code) => { const g = (giftCodes || []).find(x => x.code === code); if (g) { updateBalance(g.amount); setGiftCodes(prev => (prev || []).filter(x => x.code !== code)); alert("Success!"); playSound('win'); } }} />}
          {activeTab === Tab.WALLET && <WalletView balance={user.balance} transactions={(transactions || []).filter(t => t.userId === user.id)} onDeposit={(d) => { const newTx: Transaction = { id: "TX"+Date.now(), userId: user.id, type: 'Deposit', amount: d.amount, coins: d.amount*10, status: 'Pending', timestamp: Date.now(), utr: d.utr, userUpiId: d.upiId, screenshotUrl: d.screenshot }; setTransactions(p => [newTx, ...(p || [])]); }} onWithdraw={(d) => { const newTx: Transaction = { id: "TX"+Date.now(), userId: user.id, type: 'Withdrawal', amount: d.amount/10, coins: d.amount, status: 'Pending', timestamp: Date.now(), userUpiId: d.upiId }; setTransactions(p => [newTx, ...(p || [])]); updateBalance(-d.amount); }} />}
          {activeTab === Tab.INBOX && <InboxView messages={(messages || []).filter(m => m.userId === user.id)} onMarkRead={(id) => setMessages(p => (p || []).map(m => m.id === id ? {...m, isRead: true} : m))} onClearAll={() => setMessages(p => (p || []).filter(m => m.userId !== user.id))} />}
          {activeTab === Tab.HISTORY && <HistoryView results={results[activeMode] || []} userBets={userBets || []} />}
          {activeTab === Tab.ADMIN && user.phone === ADMIN_PHONE && (
            <AdminView 
              adminControls={adminControls} onUpdateControls={setAdminControls}
              giftCodes={giftCodes || []} onAddGift={(g) => setGiftCodes(p => [...(p || []), g])} onAddGame={(g) => setCustomGames(p => [...(p || []), g])} onRemoveGame={(id) => setCustomGames(p => (p || []).filter(x => x.id !== id))} customGames={customGames || []}
              pendingTxs={(transactions || []).filter(t => t.status === 'Pending')} onProcessTx={handleProcessTx}
              userBets={userBets}
              dbUsers={dbUsers}
            />
          )}
        </main>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userPhone={user.phone} unreadCount={unreadCount} />
      </div>
    </div>
  );
};

export default App;
