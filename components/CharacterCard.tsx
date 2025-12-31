
import React from 'react';
import { Character, Attribute } from '../types';
import StatusBar from './StatusBar';

interface CharacterCardProps {
  character: Character;
  isPlayerCharacter: boolean;
  isMaster: boolean;
  onSelect: () => void;
  onUpdateStatus: (id: string, field: keyof Character, value: number) => void;
  onQuickRoll?: (name: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isPlayerCharacter, isMaster, onSelect, onUpdateStatus, onQuickRoll }) => {
  const hpPercent = character.maxVida > 0 ? (character.currentVida / character.maxVida) * 100 : 100;
  const sanPercent = character.maxSanidade > 0 ? (character.currentSanidade / character.maxSanidade) * 100 : 100;

  const getHpLabel = () => {
    if (hpPercent <= 0) return "Inconsciente";
    if (hpPercent <= 25) return "Gravemente Ferido";
    if (hpPercent <= 50) return "Ferido";
    return "Íntegro";
  };

  const getSanLabel = () => {
    if (sanPercent <= 0) return "Em Colapso";
    if (sanPercent <= 25) return "Estressado";
    if (sanPercent <= 50) return "Abalado";
    return "Lúcido";
  };

  const getStatusColor = (val: number) => {
    if (val <= 25) return 'text-red-500';
    if (val <= 50) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  // Se o campo for undefined (como nos agentes iniciais), tratamos como true se max > 0
  const showHp = character.useVida !== false && character.maxVida > 0;
  const showSanity = character.useSanidade !== false && character.maxSanidade > 0;
  const showEnergy = character.useEnergia !== false && character.maxEnergia > 0;

  const canRoll = isMaster || isPlayerCharacter;

  return (
    <div className={`bg-slate-900 border rounded-lg overflow-hidden flex flex-col shadow-lg transition-transform hover:scale-[1.01] ${isPlayerCharacter ? 'border-temor-gold shadow-[0_0_15px_rgba(161,98,7,0.15)]' : 'border-slate-800'}`}>
      <div 
        className="h-44 bg-cover bg-center relative cursor-pointer group"
        style={{ backgroundImage: `url(${character.imageUrl})` }}
        onClick={onSelect}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3">
          <h2 className="text-lg font-cinzel font-bold text-white drop-shadow-md leading-tight">{character.codename}</h2>
          <p className="text-[10px] text-temor-gold font-semibold drop-shadow-md uppercase tracking-widest">{character.name}</p>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {canRoll && (
            <button 
              onClick={(e) => { e.stopPropagation(); onQuickRoll?.(character.codename); }}
              className="bg-slate-950/90 text-temor-gold p-1.5 rounded-full border border-temor-gold hover:bg-temor-gold hover:text-slate-950 transition-all flex items-center justify-center shadow-lg"
              title="Rolar Dados (1D20)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276l-4 2a1 1 0 000 1.788l4 2A1 1 0 0016.658 11.236l4-2a1 1 0 000-1.788l-4-2a1 1 0 00-1.447 0zM7 10a1 1 0 00-1.447-.894l-4 2A1 1 0 001 13v5.764a1 1 0 001.447.894l4-2A1 1 0 007 17v-7z" />
              </svg>
            </button>
          )}
          <span className="bg-slate-950/80 px-2 py-1 rounded text-[9px] border border-slate-700 font-bold uppercase text-slate-300">
            {character.class}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Atributos Compactos */}
        <div className="grid grid-cols-6 gap-1 mb-1">
          {/* Fix: Explicitly cast entries to [string, number][] to avoid 'val' being inferred as 'unknown' */}
          {(Object.entries(character.attributes) as [string, number][]).map(([attr, val]) => (
            <div key={attr} className="bg-slate-950/50 border border-slate-800 rounded p-1 text-center" title={attr}>
              <span className="block text-[7px] uppercase text-slate-500 font-bold tracking-tighter">{attr.substring(0, 3)}</span>
              <span className="text-[10px] font-bold text-temor-gold">{val >= 0 ? `+${val}` : val}</span>
            </div>
          ))}
        </div>

        {showHp ? (
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vida</span>
              <span className={`text-[8px] font-bold uppercase ${getStatusColor(hpPercent)}`}>{getHpLabel()}</span>
            </div>
            <StatusBar 
              current={character.currentVida} 
              max={character.maxVida} 
              color="bg-red-600" 
              onValueChange={(val) => onUpdateStatus(character.id, 'currentVida', val)}
            />
          </div>
        ) : null}

        {showSanity ? (
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sanidade</span>
              <span className={`text-[8px] font-bold uppercase ${getStatusColor(sanPercent)}`}>{getSanLabel()}</span>
            </div>
            <StatusBar 
              current={character.currentSanidade} 
              max={character.maxSanidade} 
              color="bg-blue-600" 
              onValueChange={(val) => onUpdateStatus(character.id, 'currentSanidade', val)}
            />
          </div>
        ) : null}

        {showEnergy ? (
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Energia</span>
            </div>
            <StatusBar 
              current={character.currentEnergia} 
              max={character.maxEnergia} 
              color="bg-amber-500" 
              onValueChange={(val) => onUpdateStatus(character.id, 'currentEnergia', val)}
            />
          </div>
        ) : null}

        <button 
          onClick={onSelect}
          className="mt-1 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded border border-slate-700 transition-colors"
        >
          Ficha Completa
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;
