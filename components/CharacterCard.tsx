
import React from 'react';
import { Character, Attribute } from '../types';
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
  // Cálculos de Porcentagem
  const hpPct = (character.currentVida / character.maxVida) * 100;
  const sanPct = (character.currentSanidade / character.maxSanidade) * 100;
  const enPct = (character.currentEnergia / character.maxEnergia) * 100;

  const config = character.statusConfig || { showAttributes: true, showVida: true, showSanidade: true, showEnergia: true };

  // Lógica de Cores baseada nas regras
  const getHpColor = () => {
    if (character.currentVida === 0) return "bg-slate-700"; // Inconsciente
    if (hpPct <= 25) return "bg-red-600"; // Gravemente Ferido
    if (hpPct <= 50) return "bg-yellow-500"; // Ferido
    return "bg-emerald-600"; // Íntegro
  };

  const getSanColor = () => {
    if (character.currentSanidade === 0) return "bg-slate-900"; // Em Colapso
    if (sanPct <= 25) return "bg-rose-900"; // Estressado
    if (sanPct <= 50) return "bg-purple-600"; // Abalado
    return "bg-blue-600"; // Lúcido
  };

  const getEnColor = () => {
    if (character.currentEnergia === 0) return "bg-slate-600"; // Crítico
    if (enPct <= 25) return "bg-red-700"; // Exausto
    if (enPct <= 50) return "bg-orange-500"; // Fatigado
    return "bg-amber-500"; // Pleno
  };

  const getStatusBorder = () => {
    if (!character.isActive) return "border-slate-700 grayscale opacity-60";
    if (character.currentVida === 0) return "border-slate-800 grayscale";
    if (hpPct <= 25) return "border-red-600 shadow-red-900/40";
    if (hpPct <= 50) return "border-yellow-500 shadow-yellow-900/20";
    return "border-emerald-600 shadow-emerald-900/20";
  };

  // Cálculo de Penalidades para Atributos
  const getPenalty = (current: number, max: number) => {
     if (max === 0) return 0;
     const pct = (current / max) * 100;
     if (current === 0) return 0; 
     if (pct <= 25) return -2;
     if (pct <= 50) return -1;
     return 0;
  };

  const physicalPenalty = getPenalty(character.currentVida, character.maxVida) + getPenalty(character.currentEnergia, character.maxEnergia);
  const mentalPenalty = getPenalty(character.currentSanidade, character.maxSanidade) + getPenalty(character.currentEnergia, character.maxEnergia);

  const physicalAttrs = [Attribute.Forca, Attribute.Destreza, Attribute.Resistencia];
  // Ordem de exibição: Físicos primeiro, depois Mentais
  const orderedAttrs = [
    Attribute.Forca, Attribute.Destreza, Attribute.Resistencia,
    Attribute.Inteligencia, Attribute.Sabedoria, Attribute.Carisma
  ];

  return (
    <div className="relative group animate-fadeIn">
      {isOccupiedBy && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
          {isOccupiedBy.toUpperCase()} ONLINE
        </div>
      )}
      
      <div className={`bg-slate-900 border-2 rounded-xl overflow-hidden shadow-2xl transition-all ${getStatusBorder()}`}>
        <div className="h-64 relative cursor-pointer overflow-hidden" onClick={onSelect}>
          <img src={character.imageUrl} className="w-full h-full object-cover object-top transition-transform group-hover:scale-110" alt={character.codename} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {/* Controls Overlay for Master */}
          {isMaster && character.isNpc && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(character.id, 'isActive', !character.isActive); }}
                className={`p-2 rounded-full shadow-lg hover:scale-110 transition-transform ${character.isActive ? 'bg-slate-800 text-slate-400' : 'bg-emerald-600 text-white'}`}
                title={character.isActive ? "Mover para Inativos" : "Reativar NPC"}
              >
                {character.isActive ? '✕' : '↺'}
              </button>
              
              {character.isActive && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onBossReveal?.(); }}
                  className="bg-temor-gold text-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Entrada Triunfal de Boss"
                >
                  🔥
                </button>
              )}
            </div>
          )}

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-3xl font-cinzel font-bold text-white uppercase drop-shadow-md">{character.codename}</h2>
            <p className="text-[10px] text-temor-gold font-bold tracking-widest uppercase">{character.class}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {(isMaster || config.showVida) && (
            <StatusBar label="Integridade" current={character.currentVida} max={character.maxVida} color={getHpColor()} isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentVida', v)} />
          )}
          <div className="grid grid-cols-2 gap-4">
            {(isMaster || config.showSanidade) && (
              <StatusBar label="Sanidade" current={character.currentSanidade} max={character.maxSanidade} color={getSanColor()} isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentSanidade', v)} />
            )}
            {(isMaster || config.showEnergia) && (
              <StatusBar label="Energia" current={character.currentEnergia} max={character.maxEnergia} color={getEnColor()} isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentEnergia', v)} />
            )}
          </div>

          {/* Attributes Section */}
          {(isMaster || config.showAttributes) && (
             <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
               {orderedAttrs.map(attrKey => {
                 const value = character.attributes[attrKey] || 0;
                 const isPhysical = physicalAttrs.includes(attrKey);
                 const penalty = isPhysical ? physicalPenalty : mentalPenalty;
                 const finalVal = value + penalty;
                 const hasPenalty = penalty < 0;

                 return (
                   <div key={attrKey} className="flex flex-col items-center bg-slate-950/50 p-1.5 rounded border border-slate-800/50">
                     <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider mb-1">{attrKey.substring(0, 3)}</span>
                     <span className={`text-sm font-black font-cinzel ${hasPenalty ? 'text-red-500' : 'text-slate-300'}`}>
                       {finalVal}
                     </span>
                   </div>
                 );
               })}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
