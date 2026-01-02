
import React, { useState } from 'react';
import { Character, InventoryItem, VestuarioItem } from '../types';
import StatusBar from './StatusBar';

interface CharacterDetailProps {
  character: Character;
  isEditable: boolean;
  isMaster: boolean;
  onBack: () => void;
  onUpdateStatus: (id: string, field: string, value: any) => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, isEditable, isMaster, onBack, onUpdateStatus }) => {
  const [newItem, setNewItem] = useState({ name: '', slots: 1, damage: '', desc: '' });
  const [newVest, setNewVest] = useState({ name: '', weight: 1 });

  const usedSlots = (character.inventoryItems || []).reduce((acc, item) => acc + item.slots, 0);

  const handleAddItem = () => {
    if (!newItem.name.trim() || usedSlots + newItem.slots > 8) return;
    const items = [...(character.inventoryItems || []), { ...newItem, id: Math.random().toString(36).substring(2, 11) }];
    onUpdateStatus(character.id, 'inventoryItems', items);
    setNewItem({ name: '', slots: 1, damage: '', desc: '' });
  };

  const handleRemoveItem = (id: string) => {
    onUpdateStatus(character.id, 'inventoryItems', (character.inventoryItems || []).filter(i => i.id !== id));
  };

  const handleAddVest = () => {
    if (!newVest.name.trim()) return;
    const items = [...(character.vestuarioItems || []), { ...newVest, id: Math.random().toString(36).substring(2, 11) }];
    onUpdateStatus(character.id, 'vestuarioItems', items);
    setNewVest({ name: '', weight: 1 });
  };

  const handleRemoveVest = (id: string) => {
    onUpdateStatus(character.id, 'vestuarioItems', (character.vestuarioItems || []).filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-temor-gold flex items-center gap-2">
          ← Voltar
        </button>
        <span className="bg-slate-800 text-[10px] px-3 py-1 rounded border border-slate-700 font-bold uppercase tracking-widest text-slate-400">
          Classe: {character.class}
        </span>
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
            <div className="space-y-4">
              <StatusBar label="Integridade" current={character.currentVida} max={character.maxVida} color="bg-red-600" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentVida', v)} />
              <StatusBar label="Sanidade" current={character.currentSanidade} max={character.maxSanidade} color="bg-blue-500" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentSanidade', v)} />
              <StatusBar label="Energia" current={character.currentEnergia} max={character.maxEnergia} color="bg-emerald-500" isEditable={isEditable} onValueChange={(v) => onUpdateStatus(character.id, 'currentEnergia', v)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
               <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Atributos</h3>
               <div className="space-y-2">
                  {Object.entries(character.attributes || {}).map(([attr, val]) => (
                    <div key={attr} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-500">{attr}</span>
                      <div className="flex items-center gap-4">
                        {isMaster && <button onClick={() => onUpdateStatus(character.id, 'attributes', {...character.attributes, [attr]: val - 1})} className="text-slate-600 hover:text-white">-</button>}
                        <span className="text-xl font-cinzel font-bold text-temor-gold">{val >= 0 ? `+${val}` : val}</span>
                        {isMaster && <button onClick={() => onUpdateStatus(character.id, 'attributes', {...character.attributes, [attr]: val + 1})} className="text-slate-600 hover:text-white">+</button>}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
              <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 flex justify-between">
                <span>Mochila</span>
                <span className="text-slate-500">{usedSlots}/8</span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide max-h-[300px]">
                {(character.inventoryItems || []).map(item => (
                  <div key={item.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-200 uppercase">{item.name}</span>
                      {isEditable && <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 text-xs">×</button>}
                    </div>
                  </div>
                ))}
              </div>
              {isEditable && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Nome do Item" className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                  <button onClick={handleAddItem} className="w-full bg-temor-crimson text-white py-2 rounded text-[9px] font-black uppercase">Adicionar</button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-temor-gold uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Dossiê</h3>
            <p className="text-slate-400 italic text-sm">"{character.history}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
