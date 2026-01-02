
import React, { useState } from 'react';
import { Character, Attribute, InventoryItem, VestuarioItem, Skills } from '../types';
import StatusBar from './StatusBar';

interface CharacterDetailProps {
  character: Character;
  isEditable: boolean;
  isMaster: boolean;
  onBack: () => void;
  onUpdateStatus: (id: string, field: string, value: any) => void;
}

// Definição das penalidades e estados
const getLifeState = (current: number, max: number) => {
  const pct = (current / max) * 100;
  if (current === 0) return { label: 'INCONSCIENTE', penalty: 0, color: 'text-slate-500', barColor: 'bg-slate-700' };
  if (pct <= 25) return { label: 'GRAVEMENTE FERIDO', penalty: -2, color: 'text-red-500', barColor: 'bg-red-600' };
  if (pct <= 50) return { label: 'FERIDO', penalty: -1, color: 'text-yellow-500', barColor: 'bg-yellow-500' };
  return { label: 'ÍNTEGRO', penalty: 0, color: 'text-emerald-500', barColor: 'bg-emerald-600' };
};

const getSanityState = (current: number, max: number) => {
  const pct = (current / max) * 100;
  if (current === 0) return { label: 'EM COLAPSO', penalty: 0, color: 'text-slate-400', barColor: 'bg-slate-950' };
  if (pct <= 25) return { label: 'ESTRESSADO', penalty: -2, color: 'text-rose-500', barColor: 'bg-rose-900' };
  if (pct <= 50) return { label: 'ABALADO', penalty: -1, color: 'text-purple-400', barColor: 'bg-purple-600' };
  return { label: 'LÚCIDO', penalty: 0, color: 'text-blue-400', barColor: 'bg-blue-600' };
};

const getEnergyState = (current: number, max: number) => {
  const pct = (current / max) * 100;
  if (current === 0) return { label: 'CRÍTICO', penalty: 0, color: 'text-slate-500', barColor: 'bg-slate-600' };
  if (pct <= 25) return { label: 'EXAUSTO', penalty: -2, color: 'text-red-400', barColor: 'bg-red-700' };
  if (pct <= 50) return { label: 'FATIGADO', penalty: -1, color: 'text-orange-400', barColor: 'bg-orange-500' };
  return { label: 'PLENO', penalty: 0, color: 'text-amber-400', barColor: 'bg-amber-500' };
};

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, isEditable, isMaster, onBack, onUpdateStatus }) => {
  const [newItem, setNewItem] = useState({ name: '', slots: 1, damage: '', desc: '' });
  const [newVest, setNewVest] = useState({ name: '', weight: 1, description: '' });

  const usedSlots = (character.inventoryItems || []).reduce((acc, item) => acc + item.slots, 0);
  const currentWeight = (character.vestuarioItems || []).reduce((acc, item) => acc + item.weight, 0);

  // Calcular Estados Atuais
  const lifeState = getLifeState(character.currentVida, character.maxVida);
  const sanState = getSanityState(character.currentSanidade, character.maxSanidade);
  const energyState = getEnergyState(character.currentEnergia, character.maxEnergia);

  // Calcular Penalidades Cumulativas
  // Físicos: Vida + Energia
  // Mentais: Sanidade + Energia
  const physicalPenalty = lifeState.penalty + energyState.penalty;
  const mentalPenalty = sanState.penalty + energyState.penalty;

  // Lista de atributos Físicos vs Mentais
  const physicalAttrs = [Attribute.Forca, Attribute.Destreza, Attribute.Resistencia];
  const mentalAttrs = [Attribute.Inteligencia, Attribute.Sabedoria, Attribute.Carisma];

  const handleAddItem = () => {
    if (!newItem.name.trim() || usedSlots + newItem.slots > 8) return;
    const items = [...(character.inventoryItems || []), { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    onUpdateStatus(character.id, 'inventoryItems', items);
    setNewItem({ name: '', slots: 1, damage: '', desc: '' });
  };

  const handleRemoveItem = (id: string) => {
    onUpdateStatus(character.id, 'inventoryItems', character.inventoryItems.filter(i => i.id !== id));
  };

  const handleAddVest = () => {
    if (!newVest.name.trim()) return;
    const items = [...(character.vestuarioItems || []), { ...newVest, id: Math.random().toString(36).substr(2, 9) }];
    onUpdateStatus(character.id, 'vestuarioItems', items);
    setNewVest({ name: '', weight: 1, description: '' });
  };

  const handleRemoveVest = (id: string) => {
    onUpdateStatus(character.id, 'vestuarioItems', character.vestuarioItems.filter(i => i.id !== id));
  };

  const updateSkill = (skillKey: keyof Skills, delta: number) => {
    const currentVal = character.skills[skillKey] || 0;
    const newSkills = { ...character.skills, [skillKey]: currentVal + delta };
    onUpdateStatus(character.id, 'skills', newSkills);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-temor-gold flex items-center gap-2">
          ← Voltar ao Dashboard
        </button>
        <div className="flex gap-4">
           <span className="bg-slate-800 text-[10px] px-3 py-1 rounded border border-slate-700 font-bold uppercase tracking-widest text-slate-400">Classe: {character.class}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-2xl">
            <img src={character.imageUrl} className="w-full aspect-[3/4] object-cover object-top" alt={character.codename} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-4xl font-cinzel font-bold text-white uppercase tracking-tighter leading-none">{character.codename}</h2>
              <p className="text-xs text-temor-gold font-black uppercase tracking-[0.3em] mt-2">{character.name}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Registros Vitais</h3>
            <div className="space-y-6">
              
              {/* VIDA */}
              <div>
                <div className="flex justify-between text-[9px] uppercase font-black mb-1">
                  <span className="text-slate-400">Integridade</span>
                  <span className={`${lifeState.color} animate-pulse`}>{lifeState.label} {lifeState.penalty < 0 ? `(${lifeState.penalty})` : ''}</span>
                </div>
                <StatusBar current={character.currentVida} max={character.maxVida} color={lifeState.barColor} isEditable={isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentVida', v)} />
              </div>

              {/* SANIDADE */}
              <div>
                <div className="flex justify-between text-[9px] uppercase font-black mb-1">
                  <span className="text-slate-400">Sanidade</span>
                  <span className={`${sanState.color} animate-pulse`}>{sanState.label} {sanState.penalty < 0 ? `(${sanState.penalty})` : ''}</span>
                </div>
                <StatusBar current={character.currentSanidade} max={character.maxSanidade} color={sanState.barColor} isEditable={isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentSanidade', v)} />
              </div>

              {/* ENERGIA */}
              <div>
                <div className="flex justify-between text-[9px] uppercase font-black mb-1">
                  <span className="text-slate-400">Energia</span>
                  <span className={`${energyState.color} animate-pulse`}>{energyState.label} {energyState.penalty < 0 ? `(${energyState.penalty})` : ''}</span>
                </div>
                <StatusBar current={character.currentEnergia} max={character.maxEnergia} color={energyState.barColor} isEditable={isMaster} onValueChange={(v) => onUpdateStatus(character.id, 'currentEnergia', v)} />
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Attributes and Inventory Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
               <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 flex justify-between">
                 <span>Atributos</span>
                 <span className="text-[8px] text-slate-600 normal-case tracking-normal">Penalidades Auto-Aplicadas</span>
               </h3>
               <div className="space-y-2">
                  {Object.entries(character.attributes).map(([attr, baseVal]) => {
                    const isPhysical = physicalAttrs.includes(attr as Attribute);
                    const penalty = isPhysical ? physicalPenalty : mentalPenalty;
                    const finalVal = baseVal + penalty;
                    const hasPenalty = penalty < 0;

                    return (
                      <div key={attr} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center group">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-500">{attr}</span>
                          <span className="text-[8px] text-slate-700 uppercase tracking-wider">{isPhysical ? 'Físico' : 'Mental'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {isMaster && <button onClick={() => onUpdateStatus(character.id, 'attributes', {...character.attributes, [attr]: baseVal - 1})} className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">-</button>}
                          <div className="flex flex-col items-end">
                            <span className={`text-xl font-cinzel font-bold ${hasPenalty ? 'text-red-500' : 'text-temor-gold'}`}>
                              {finalVal >= 0 ? `+${finalVal}` : finalVal}
                            </span>
                            {hasPenalty && (
                              <span className="text-[8px] text-red-700 font-mono">
                                (Base {baseVal >= 0 ? `+${baseVal}` : baseVal} {penalty})
                              </span>
                            )}
                          </div>
                          {isMaster && <button onClick={() => onUpdateStatus(character.id, 'attributes', {...character.attributes, [attr]: baseVal + 1})} className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">+</button>}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* MOCHILA */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
                <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Mochila Operacional</span>
                  <span className="text-slate-500">{usedSlots}/8</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide max-h-[250px]">
                  {character.inventoryItems.map(item => (
                    <div key={item.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-200 uppercase">{item.name}</span>
                        {isEditable && <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 text-xs">×</button>}
                      </div>
                      <div className="text-[8px] text-slate-500 font-black uppercase mt-1">Peso: {item.slots} | {item.damage ? `Dano: ${item.damage}` : 'Utilitário'}</div>
                    </div>
                  ))}
                  {character.inventoryItems.length === 0 && <p className="text-[9px] text-slate-600 italic">Mochila vazia.</p>}
                </div>
                {isEditable && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Nome do Equipamento" className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                    <div className="flex gap-2">
                      <input type="number" value={newItem.slots} onChange={e => setNewItem({...newItem, slots: parseInt(e.target.value)||1})} className="w-12 bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white text-center" title="Peso" />
                      <input value={newItem.damage} onChange={e => setNewItem({...newItem, damage: e.target.value})} placeholder="Dano (ex: 1d6)" className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                    </div>
                    <button onClick={handleAddItem} className="w-full bg-temor-crimson text-white py-2 rounded text-[9px] font-black uppercase hover:bg-red-800 transition-colors">Adicionar Item</button>
                  </div>
                )}
              </div>

              {/* VESTUARIO */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
                <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Vestuário & Acessórios</span>
                  <span className="text-slate-500">{currentWeight} P</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide max-h-[250px]">
                  {character.vestuarioItems.map(item => (
                    <div key={item.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-200 uppercase">{item.name}</span>
                        {isEditable && <button onClick={() => handleRemoveVest(item.id)} className="text-red-500 text-xs">×</button>}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-[8px] text-slate-500 font-black uppercase">Peso: {item.weight}</span>
                         {item.description && <span className="text-[8px] text-slate-400 italic max-w-[150px] truncate">{item.description}</span>}
                      </div>
                    </div>
                  ))}
                  {character.vestuarioItems.length === 0 && <p className="text-[9px] text-slate-600 italic">Sem vestuário registrado.</p>}
                </div>
                {isEditable && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <input value={newVest.name} onChange={e => setNewVest({...newVest, name: e.target.value})} placeholder="Nome da Peça" className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                    <div className="flex gap-2">
                      <input type="number" value={newVest.weight} onChange={e => setNewVest({...newVest, weight: parseInt(e.target.value)||1})} className="w-12 bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white text-center" title="Peso" />
                      <input value={newVest.description} onChange={e => setNewVest({...newVest, description: e.target.value})} placeholder="Descrição / Efeito" className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                    </div>
                    <button onClick={handleAddVest} className="w-full bg-slate-700 text-white py-2 rounded text-[9px] font-black uppercase hover:bg-slate-600 transition-colors">Adicionar Vestuário</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* SKILLS SECTION */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Perícias Operacionais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.entries(character.skills).map(([key, val]) => (
                <div key={key} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-colors">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{key}</span>
                  <div className="flex items-center gap-2">
                    {isMaster && (
                      <button 
                        onClick={() => updateSkill(key as keyof Skills, -1)} 
                        className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >-</button>
                    )}
                    <span className={`text-xs font-cinzel font-bold ${val === 0 ? 'text-slate-600' : val > 0 ? 'text-temor-gold' : 'text-red-500'}`}>
                      {val > 0 ? `+${val}` : val}
                    </span>
                    {isMaster && (
                      <button 
                        onClick={() => updateSkill(key as keyof Skills, 1)} 
                        className="text-slate-600 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >+</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FICHA DE CAMPO - COMPLETA */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Ficha de Campo</h3>
            <div className="space-y-6 text-xs">
              
              {/* Row 1: Identity */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Raça</label>
                  <input value={character.race} onChange={e => onUpdateStatus(character.id, 'race', e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200" disabled={!isEditable} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Idade</label>
                  <input value={character.age} onChange={e => onUpdateStatus(character.id, 'age', e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200" disabled={!isEditable} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Patente / Exp</label>
                  <input value={character.rank || ''} onChange={e => onUpdateStatus(character.id, 'rank', e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200" disabled={!isEditable} placeholder="Ex: Novato - Soldado" />
                </div>
              </div>

              {/* Row 2: Appearance */}
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Aparência</label>
                <textarea 
                  value={character.appearance} 
                  onChange={e => onUpdateStatus(character.id, 'appearance', e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 min-h-[60px] scrollbar-hide" 
                  disabled={!isEditable} 
                />
              </div>

              {/* Row 3: Personality & Faults */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Personalidade e Ideais</label>
                    <textarea 
                      value={character.personality} 
                      onChange={e => onUpdateStatus(character.id, 'personality', e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 min-h-[60px] scrollbar-hide" 
                      disabled={!isEditable} 
                    />
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Falhas e Defeitos</label>
                    <textarea 
                      value={character.faults} 
                      onChange={e => onUpdateStatus(character.id, 'faults', e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 min-h-[60px] scrollbar-hide" 
                      disabled={!isEditable} 
                    />
                 </div>
              </div>

               {/* Row 4: Talents & History */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Talentos e Qualidades</label>
                    <textarea 
                      value={character.talents} 
                      onChange={e => onUpdateStatus(character.id, 'talents', e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 min-h-[60px] scrollbar-hide" 
                      disabled={!isEditable} 
                    />
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Dossiê e Antecedentes</label>
                    <textarea 
                      value={character.history} 
                      onChange={e => onUpdateStatus(character.id, 'history', e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-400 italic min-h-[60px] scrollbar-hide" 
                      disabled={!isEditable} 
                    />
                 </div>
              </div>

              {/* Row 5: Habilidade */}
              <div>
                <label className="text-[9px] font-black text-temor-crimson uppercase block mb-1">Habilidade Especial</label>
                <input 
                  value={character.ability || 'NÃO DESBLOQUEADA'} 
                  onChange={e => onUpdateStatus(character.id, 'ability', e.target.value)} 
                  className={`w-full bg-slate-950 border border-slate-800 p-2 rounded font-bold uppercase tracking-widest ${character.ability && character.ability !== 'NÃO DESBLOQUEADA' ? 'text-temor-gold' : 'text-red-700'}`} 
                  disabled={!isEditable} 
                />
              </div>

              {/* Row 6: Combat Gear */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Arsenal Ativo</label>
                  <input value={character.armas} onChange={e => onUpdateStatus(character.id, 'armas', e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200" disabled={!isEditable} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Proteção Balística</label>
                  <input value={character.armadura} onChange={e => onUpdateStatus(character.id, 'armadura', e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200" disabled={!isEditable} />
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
