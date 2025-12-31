
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

  const rollDice = (formula: string) => {
    const regex = /^(\d*)d(\d+)([\+\-]\d+)?$/i;
    const match = formula.trim().match(regex);

    if (!match) {
      alert("Formato inválido! Use algo como 1d20+2 ou 2d6");
      return;
    }

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const bonus = match[3] ? parseInt(match[3]) : 0;

    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((a, b) => a + b, 0) + bonus;

    const isCriticalSuccess = sides === 20 && rolls.includes(20);
    const isCriticalFailure = sides === 20 && rolls.includes(1);

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUsername,
      formula: formula.toUpperCase(),
      rolls,
      bonus,
      total,
      timestamp: new Date(),
      isCriticalSuccess,
      isCriticalFailure
    };

    onSendMessage(newMessage);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    rollDice(input);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-temor-gold/30 shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h3 className="text-sm font-cinzel font-bold text-temor-gold tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          CANAL DE ROLAGEM
        </h3>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-30">
            <p className="text-xs uppercase tracking-tighter">Aguardando rolagens...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fadeIn">
            <div className="flex justify-between items-baseline mb-1 px-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${msg.sender === currentUsername ? 'text-temor-gold' : 'text-slate-400'}`}>
                {msg.sender}
              </span>
              <span className="text-[8px] text-slate-600">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className={`p-3 rounded border ${msg.isCriticalSuccess ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : msg.isCriticalFailure ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-mono">{msg.formula}</span>
                  <span className="text-[11px] text-slate-300">
                    ({msg.rolls.join(' + ')}){msg.bonus !== 0 ? ` ${msg.bonus > 0 ? '+' : ''}${msg.bonus}` : ''}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-cinzel font-bold leading-none ${msg.isCriticalSuccess ? 'text-emerald-400' : msg.isCriticalFailure ? 'text-red-500' : 'text-white'}`}>
                    {msg.total}
                  </div>
                  {msg.isCriticalSuccess && <div className="text-[8px] font-bold text-emerald-500 uppercase mt-1">Crítico</div>}
                  {msg.isCriticalFailure && <div className="text-[8px] font-bold text-red-500 uppercase mt-1">Falha</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: 1d20+2"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-temor-gold transition-colors font-mono"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1.5 p-1 text-temor-gold hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {['1d20', '2d20', '1d20+2', '2d6', '1d4'].map(btn => (
            <button 
              key={btn}
              type="button"
              onClick={() => setInput(btn)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-400 rounded border border-slate-700 uppercase whitespace-nowrap"
            >
              {btn}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default DiceChat;
