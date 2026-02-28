
import React from 'react';
import { Message } from '../types.ts';

interface InboxViewProps {
  messages: Message[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const InboxView: React.FC<InboxViewProps> = ({ messages, onMarkRead, onClearAll }) => {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold font-orbitron tracking-tight">Notification Center</h2>
        {messages.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/10"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {messages.length > 0 ? messages.map((msg, idx) => (
          <div 
            key={`${msg.id}-${idx}`} 
            onClick={() => onMarkRead(msg.id)}
            className={`glass-morphism rounded-3xl p-5 border transition-all active:scale-[0.98] ${
              msg.isRead ? 'border-white/5 opacity-60' : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  msg.type === 'Wallet' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {msg.type === 'Wallet' ? '💰' : '🔔'}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wide">{msg.title}</h4>
                  <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {!msg.isRead && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>}
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
              {msg.content}
            </p>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6 grayscale">📭</div>
            <p className="text-xs font-black uppercase tracking-[0.2em]">Your inbox is empty</p>
            <p className="text-[9px] font-bold text-gray-600 mt-2 uppercase">Official system alerts will appear here</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-[9px] text-gray-600 text-center font-bold uppercase tracking-widest leading-relaxed">
          Important: We will never ask for your password via messages. <br/>
          Stay safe and secure.
        </p>
      </div>
    </div>
  );
};

export default InboxView;
