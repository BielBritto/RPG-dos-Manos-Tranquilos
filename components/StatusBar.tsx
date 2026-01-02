
import React from 'react';

interface StatusBarProps {
  label?: string; // Added optional label prop
  current: number;
  max: number;
  color: string;
  isEditable?: boolean;
  onValueChange: (val: number) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ label, current, max, color, isEditable = true, onValueChange }) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    onValueChange(Math.max(current - 1, 0));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    onValueChange(Math.min(current + 1, max));
  };

  return (
    <div className="w-full">
      {/* Render label if provided */}
      {label && <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{label}</div>}
      
      <div className="flex items-center gap-2 group">
        <button 
          onClick={handleDecrement}
          disabled={!isEditable}
          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border transition-colors ${isEditable ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700' : 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed'}`}
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
          disabled={!isEditable}
          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border transition-colors ${isEditable ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700' : 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed'}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
