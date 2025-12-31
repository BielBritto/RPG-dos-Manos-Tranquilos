
import React from 'react';
import { Character, Attribute } from '../types';
import StatusBar from './StatusBar';

interface CharacterDetailProps {
  character: Character;
  isPlayerCharacter: boolean;
  onBack: () => void;
  onUpdateStatus: (id: string, field: keyof Character, value: number) => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, isPlayerCharacter, onBack, onUpdateStatus }) => {
  const attributes = Object.entries(character.attributes) as [Attribute, number][];
  const skills = Object.entries(character.skills) as [string, number][];

  const getPenaltyLabel = (field: 'vida' | 'sanidade' | 'energia') => {
    let current, max;
    if (field === 'vida') { current = character.currentVida; max = character.maxVida; }
    else if (field === 'sanidade') { current = character.currentSanidade; max = character.maxSanidade; }
    else { current = character.currentEnergia; max = character.maxEnergia; }

    if (max === 0) return "Normal";
    const pct = (current / max) * 100;
    if (pct <= 25) return "-2 Penalidade";
    if (pct <= 50) return "-1 Penalidade";
    return "Normal";
  };

  const showHp = character.useVida !== false && character.maxVida > 0;
  const showSanity = character.useSanidade !== false && character.maxSanidade > 0;
  const showEnergy = character.useEnergia !== false && character.maxEnergia > 0;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <button 
        onClick={onBack}
        className="self-start text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-temor-gold transition-colors flex items-center gap-2"
      >
        ← Voltar para Equipe
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Image and Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className={`relative rounded-2xl overflow-hidden border-2 shadow-2xl ${isPlayerCharacter ? 'border-temor-gold' : 'border-slate-800'}`}>
            <img src={character.imageUrl} alt={character.name} className="w-full aspect-[4/5] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-temor-gold text-xs font-bold uppercase tracking-[0.2em]">{character.class}</span>
                {isPlayerCharacter && <span className="bg-temor-gold text-slate-950 px-1.5 py-0.5 rounded text-[8px] font-bold">SEU AGENTE</span>}
              </div>
              <h2 className="text-3xl font-cinzel font-bold text-white">{character.codename}</h2>
              <p className="text-sm text-slate-300">{character.name}, {character.age > 0 ? character.age + ' anos' : 'Idade Desconhecida'}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            {showHp && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Vida</span>
                  <span className="text-[10px] text-red-500 font-bold uppercase">{getPenaltyLabel('vida')}</span>
                </div>
                <StatusBar 
                  current={character.currentVida} 
                  max={character.maxVida} 
                  color="bg-red-600" 
                  onValueChange={(val) => onUpdateStatus(character.id, 'currentVida', val)}
                />
              </div>
            )}
            {showSanity && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sanidade</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase">{getPenaltyLabel('sanidade')}</span>
                </div>
                <StatusBar 
                  current={character.currentSanidade} 
                  max={character.maxSanidade} 
                  color="bg-blue-600" 
                  onValueChange={(val) => onUpdateStatus(character.id, 'currentSanidade', val)}
                />
              </div>
            )}
            {showEnergy && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Energia</span>
                  <span className="text-[10px] text-amber-500 font-bold uppercase">{getPenaltyLabel('energia')}</span>
                </div>
                <StatusBar 
                  current={character.currentEnergia} 
                  max={character.maxEnergia} 
                  color="bg-amber-500" 
                  onValueChange={(val) => onUpdateStatus(character.id, 'currentEnergia', val)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Attributes, Skills, Lore */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Attributes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {attributes.map(([attr, val]) => (
              <div key={attr} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center group hover:border-temor-gold/50 transition-colors">
                <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-tighter mb-1">{attr}</span>
                <span className="text-3xl font-cinzel font-bold text-temor-gold">{val >= 0 ? `+${val}` : val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Perícias</h3>
              <div className="grid grid-cols-1 gap-1 h-64 overflow-y-auto pr-2 scrollbar-hide">
                {skills.map(([skill, val]) => (
                  <div key={skill} className="flex justify-between items-center py-1 border-b border-slate-800/30 hover:bg-slate-800/50 px-2 rounded">
                    <span className="text-xs uppercase text-slate-300 font-medium">{skill.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-xs font-bold text-temor-gold">{val >= 0 ? `+${val}` : val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment & Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Equipamento</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Armas Ativas</span>
                    <p className="text-sm text-slate-200">{character.armas}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Armadura</span>
                    <p className="text-sm text-slate-200">{character.armadura}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1">
                <h3 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Perfil Operacional</h3>
                <p className="text-sm text-slate-400 italic leading-relaxed">
                  "{character.appearance}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-tight">Registro TEMOR ID: {character.id.toUpperCase()}-00X</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
