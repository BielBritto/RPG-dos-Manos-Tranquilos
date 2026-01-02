import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface DiceChatProps {
  currentUsername: string;
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
}

const DiceChat: React.FC<DiceChatProps> = ({ currentUsername, messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const regex = /^(\d*)d(\d+)([\+\-]\d+)?$/i;
    const match = input.trim().match(regex);

    if (!match) {
      alert("Use o formato: 1d20 ou 2d6+2");
      return;
    }

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const bonus = match[3] ? parseInt(match[3]) : 0;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0) + bonus;

    onSendMessage({
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUsername,
      formula: input.toUpperCase(),
      rolls,
      bonus,
      total,
      timestamp: new Date(),
      isCriticalSuccess: sides === 20 && rolls.includes(20),
      isCriticalFailure: sides === 20 && rolls.includes(1)
    });
    setInput('');
  };

  const renderTime = (ts: any): string => {
    try {
      const date = ts instanceof Date ? ts : new Date(ts);
      if (isNaN(date.getTime())) return "S/D";
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "S/D";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-temor-gold/20 shadow-2xl">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-[10px] font-cinzel font-bold text-temor-gold tracking-widest uppercase">Canal Operacional</h3>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-950">
        {(messages || []).map((msg) => (
          <div key={msg.id} className="animate-fadeIn">
            <div className="flex justify-between items-baseline mb-1 px-1">
              <span className={`text-[9px] font-black uppercase tracking-widest ${msg.sender === currentUsername ? 'text-temor-gold' : 'text-slate-500'}`}>
                {msg.sender === currentUsername ? 'SINAL PRÓPRIO' : msg.sender}
              </span>
              <span className="text-[7px] text-slate-700 font-mono">
                {renderTime(msg.timestamp)}
              </span>
            </div>
            <div className={`p-3 rounded-lg border transition-all ${msg.isCriticalSuccess ? 'border-emerald-500 bg-emerald-950/20' : msg.isCriticalFailure ? 'border-red-500 bg-red-950/20' : 'border-slate-800 bg-slate-900/50'}`}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 font-mono uppercase tracking-tighter">Fórmula: {msg.formula}</div>
                  <div className="text-[10px] text-slate-400 font-bold bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                    [{(msg.rolls || []).join(' + ')}] {msg.bonus !== 0 ? `${msg.bonus > 0 ? '+' : ''}${msg.bonus}` : ''}
                  </div>
                </div>
                <div className={`text-3xl font-cinzel font-bold text-right ${msg.isCriticalSuccess ? 'text-emerald-400' : msg.isCriticalFailure ? 'text-red-500' : 'text-white'}`}>
                  {msg.total}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        <div className="relative">
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Comando: 1d20+2"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs focus:border-temor-gold outline-none font-mono text-temor-gold"
          />
          <button type="submit" className="absolute right-2 top-2 p-1 text-slate-500 hover:text-temor-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiceChat;