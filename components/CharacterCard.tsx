
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
  onQuickRoll?: (name: string) => void;
  onMoveStatus?: (id: string, direction: 'up' | 'down') => void;
  onBossReveal?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, isEditable, isMaster, isOccupiedBy, onSelect, onUpdateStatus, onQuickRoll, onMoveStatus, onBossReveal 
}) => {
  const hpPct = (character.currentVida / character.maxVida) * 100;
  const sanPct = (character.currentSanidade / character.maxSanidade) * 100;
  const enePct = (character.currentEnergia / character.maxEnergia) * 100;

  const config = character.statusConfig || { showVida: true, showSanidade: true, showEnergia: true };

  const getHpStatus = () => {
    if (hpPct <= 0) return { label: "Inconsciente", color: "border-red-900", text: "text-red-900", shadow: "shadow-red-900/50" };
    if (hpPct <= 25) return { label: "Moribundo", color: "border-red-700", text: "text-red-700", shadow: "shadow-red-700/50" };
    if (hpPct <= 50) return { label: "Ferido", color: "border-orange-600", text: "text-orange-600", shadow: "shadow-orange-600/50" };
    return { label: "Íntegro", color: "border-emerald-500", text: "text-emerald-500", shadow: "shadow-emerald-500/50" };
  };

  const getSanStatus = () => {
    if (sanPct <= 0) return { label: "Colapso", color: "text-purple-500" };
    if (sanPct <= 30) return { label: "Estressado", color: "text-pink-500" };
    if (sanPct <= 60) return { label: "Abalado", color: "text-cyan-400" };
    return { label: "Lúcido", color: "text-emerald-400" };
  };

  const getEneStatus = () => {
    if (enePct <= 20) return { label: "Exausto", color: "text-amber-700" };
    if (enePct <= 50) return { label: "Fatigado", color: "text-amber-500" };
    return { label: "Pronto", color: "text-amber-300" };
  };

  const hpInfo = getHpStatus();
  const sanInfo = getSanStatus();
  const eneInfo = getEneStatus();

  let cardStyle = "relative group transition-all duration-300 ";
  if (character.isDeleted) {
    cardStyle += "grayscale opacity-40 scale-90 blur-[1px]";
  } else if (character.isNpc && !character.isActive) {
    cardStyle += "opacity-60 grayscale scale-95";
  }

  return (
    <div className={cardStyle}>
      <div className="absolute -top-2 -left-2 z-30 bg-slate-950 border border-temor-gold px-2 py-0.5 rounded shadow-lg">
        <span className="text-[9px] font-black text-temor-gold uppercase tracking-tighter">
          {character.isDeleted ? 'BAIXA' : (character.class || 'ALVO')}
        </span>
      </div>

      {isOccupiedBy && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-emerald-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded shadow-xl uppercase tracking-widest border border-emerald-400 whitespace-nowrap">
            {isOccupiedBy} - ONLINE
          </div>
        </div>
      )}
      
      <div className={`bg-slate-900 border-2 rounded-xl overflow-hidden shadow-2xl transition-all w-full ${isOccupiedBy ? 'border-emerald-500 ring-4 ring-emerald-500/20' : `${hpInfo.color} ${hpInfo.shadow}`}`}>
        <div className="h-80 relative cursor-pointer" onClick={onSelect}>
          <img 
            src={character.imageUrl} 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            alt={character.codename} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
            {isEditable && !character.isDeleted && (
              <button onClick={(e) => { e.stopPropagation(); onQuickRoll?.(character.codename); }} className="bg-slate-950/80 hover:bg-temor-crimson text-white p-2.5 rounded-full border border-slate-700 transition-all shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
            )}
            
            {isMaster && (
              <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {character.isNpc && !character.isDeleted && (
                  <button title="Entrada Triunfal (Boss)" onClick={(e) => { e.stopPropagation(); onBossReveal?.(); }} className="bg-slate-950/90 hover:text-temor-gold text-slate-300 p-2 rounded-lg border border-slate-700 transition-colors">
                    <span className="text-xs">👁️</span>
                  </button>
                )}
                <button title="Subir (Campo/Agir)" onClick={(e) => { e.stopPropagation(); onMoveStatus?.(character.id, 'up'); }} className="bg-slate-950/90 hover:text-emerald-500 text-slate-300 p-2 rounded-lg border border-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button title="Descer (Reserva/Baixa)" onClick={(e) => { e.stopPropagation(); onMoveStatus?.(character.id, 'down'); }} className="bg-slate-950/90 hover:text-red-500 text-slate-300 p-2 rounded-lg border border-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-4xl font-cinzel font-bold text-white uppercase leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">{character.codename}</h2>
            <div className="flex justify-between items-end mt-2">
              <span className="text-[12px] text-temor-gold font-bold uppercase tracking-widest">{character.name}</span>
              <span className={`text-[11px] font-black uppercase ${hpInfo.text}`}>{hpInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {(isMaster || config.showVida) && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-500 uppercase px-1">Integridade Física</span>
              <StatusBar current={character.currentVida} max={character.maxVida} color="bg-red-600" isEditable={isEditable || isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentVida', v)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {(isMaster || config.showSanidade) && (
              <div className="space-y-1.5">
                <div className="flex justify-between px-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Sanidade</span>
                  <span className={`text-[8px] font-black uppercase ${sanInfo.color}`}>{sanInfo.label}</span>
                </div>
                <StatusBar current={character.currentSanidade} max={character.maxSanidade} color="bg-cyan-600" isEditable={isEditable || isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentSanidade', v)} />
              </div>
            )}
            {(isMaster || config.showEnergia) && (
              <div className="space-y-1.5">
                <div className="flex justify-between px-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Energia</span>
                  <span className={`text-[8px] font-black uppercase ${eneInfo.color}`}>{eneInfo.label}</span>
                </div>
                <StatusBar current={character.currentEnergia} max={character.maxEnergia} color="bg-amber-500" isEditable={isEditable || isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentEnergia', v)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
