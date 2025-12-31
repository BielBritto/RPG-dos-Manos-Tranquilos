
import React from 'react';

interface StatusBarProps {
  current: number;
  max: number;
  color: string;
  onValueChange: (val: number) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ current, max, color, onValueChange }) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(Math.max(current - 1, 0));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(Math.min(current + 1, max));
  };

  return (
    <div className="flex items-center gap-2 group">
      <button 
        onClick={handleDecrement}
        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700 transition-colors"
      >
        -
      </button>
      
      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
        <div 
          className={`h-full ${color} transition-all duration-300 shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] uppercase">
            {current} / {max}
          </span>
        </div>
      </div>

      <button 
        onClick={handleIncrement}
        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default StatusBar;
