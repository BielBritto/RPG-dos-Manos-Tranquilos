
import React from 'react';
import { Character } from '../types';
import StatusBar from './StatusBar';

interface CharacterCardProps {
  character: Character;
  isEditable: boolean;
  isMaster: boolean;
  isOccupiedBy?: string;
  onSelect: () => void;
  onUpdateStatus: (id: string, field: string, value: any) => void;
  onBossReveal?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, isEditable, isMaster, isOccupiedBy, onSelect, onUpdateStatus, onBossReveal 
}) => {
  const hpPct = (character.currentVida / character.maxVida) * 100;
  const config = character.statusConfig || { showVida: true, showSanidade: true, showEnergia: true };

  const getStatusColor = () => {
    if (hpPct <= 0) return "border-red-900 grayscale shadow-none";
    if (hpPct <= 25) return "border-red-600 shadow-red-900/40";
    if (hpPct <= 50) return "border-orange-500 shadow-orange-900/20";
    return "border-emerald-500 shadow-emerald-900/20";
  };

  return (
    <div className={`relative group animate-fadeIn transition-all ${!character.isActive ? 'opacity-40' : ''}`}>
      {isOccupiedBy && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
          {isOccupiedBy.toUpperCase()} ONLINE
        </div>
      )}
      
      <div className={`bg-slate-900 border-2 rounded-xl overflow-hidden shadow-2xl transition-all ${getStatusColor()}`}>
        <div className="h-64 relative cursor-pointer overflow-hidden" onClick={onSelect}>
          <img src={character.imageUrl} className="w-full h-full object-cover object-top transition-transform group-hover:scale-110" alt={character.codename} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {isMaster && character.isNpc && (
            <button 
              onClick={(e) => { e.stopPropagation(); onBossReveal?.(); }}
              className="absolute top-2 right-2 bg-temor-gold text-slate-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              title="Entrada Triunfal de Boss"
            >
              🔥
            </button>
          )}

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-3xl font-cinzel font-bold text-white uppercase drop-shadow-md">{character.codename}</h2>
            <p className="text-[10px] text-temor-gold font-bold tracking-widest uppercase">{character.class}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {(isMaster || config.showVida) && (
            <StatusBar label="Integridade" current={character.currentVida} max={character.maxVida} color="bg-red-600" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentVida', v)} />
          )}
          <div className="grid grid-cols-2 gap-4">
            {(isMaster || config.showSanidade) && (
              <StatusBar label="Sanidade" current={character.currentSanidade} max={character.maxSanidade} color="bg-blue-500" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentSanidade', v)} />
            )}
            {(isMaster || config.showEnergia) && (
              <StatusBar label="Energia" current={character.currentEnergia} max={character.maxEnergia} color="bg-emerald-500" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentEnergia', v)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
