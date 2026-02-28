
import React from 'react';
import { Tab } from '../types.ts';
import { 
  HomeIcon, 
  HistoryIcon, 
  WalletIcon, 
  UserIcon, 
  InboxIcon,
  AdminIcon
} from './Icons.tsx';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  userPhone?: string;
  unreadCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, userPhone, unreadCount = 0 }) => {
  const isAdmin = userPhone === '6207559408';

  const tabs = [
    { id: Tab.HOME, label: 'Game', icon: <HomeIcon /> },
    { id: Tab.HISTORY, label: 'History', icon: <HistoryIcon /> },
    ...(isAdmin ? [{ id: Tab.ADMIN, label: 'Admin', icon: <AdminIcon /> }] : []),
    { id: Tab.WALLET, label: 'Wallet', icon: <WalletIcon /> },
    { id: Tab.INBOX, label: 'Inbox', icon: <InboxIcon />, badge: unreadCount },
    { id: Tab.PROFILE, label: 'Me', icon: <UserIcon /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 glass-morphism border-t border-white/10 flex justify-around items-center px-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center transition-all relative ${
            activeTab === tab.id ? 'text-red-600 scale-110' : 'text-gray-400'
          }`}
        >
          <div className="w-6 h-6">
            {tab.icon}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
