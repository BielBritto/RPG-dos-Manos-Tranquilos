
import React, { useState, useRef } from 'react';
import { Character, Attribute } from '../types';

interface MasterPanelProps {
  onAddNpc: (npc: Character) => void;
}

const MasterPanel: React.FC<MasterPanelProps> = ({ onAddNpc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [category, setCategory] = useState('Ameaça');
  const [vida, setVida] = useState(10);
  const [sanidade, setSanidade] = useState(10);
  const [energia, setEnergia] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  
  const [hasVida, setHasVida] = useState(true);
  const [hasSanity, setHasSanity] = useState(false);
  const [hasEnergy, setHasEnergy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Capitão', 'General', 'Ameaça', 'Monstro', 'Desconhecido', 'Soldado', 'Elite', 'Chefe'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!name || !codename) {
      alert("Por favor, preencha o Nome e o Codinome.");
      return;
    }
    
    const finalImageUrl = imageUrl || `https://picsum.photos/seed/${Date.now()}/400/500`;

    const newNpc: Character = {
      id: `npc-${Date.now()}`,
      name,
      codename,
      race: 'NPC/Inimigo',
      age: 0,
      class: category,
      appearance: 'Registro identificado em campo de batalha.',
      attributes: {
        [Attribute.Forca]: 1, [Attribute.Inteligencia]: 1, [Attribute.Resistencia]: 1,
        [Attribute.Destreza]: 1, [Attribute.Carisma]: 1, [Attribute.Sabedoria]: 1
      },
      skills: {
        atletismo: 0, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0,
        agilidade: 0, percepcao: 0, investigacao: 0, animais: 0, atuacao: 0,
        diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
      },
      maxVida: hasVida ? vida : 0,
      currentVida: hasVida ? vida : 0,
      maxSanidade: hasSanity ? sanidade : 0,
      currentSanidade: hasSanity ? sanidade : 0,
      maxEnergia: hasEnergy ? energia : 0,
      currentEnergia: hasEnergy ? energia : 0,
      useVida: hasVida,
      useSanidade: hasSanity,
      useEnergia: hasEnergy,
      imageUrl: finalImageUrl,
      inventory: [],
      armas: 'Ataque Padrão',
      armadura: 'Nenhuma',
      defesaExtra: 0,
      isNpc: true
    };

    onAddNpc(newNpc);
    setIsOpen(false);
    // Reset fields
    setName('');
    setCodename('');
    setCategory('Ameaça');
    setVida(10);
    setSanidade(10);
    setEnergia(10);
    setImageUrl('');
    setHasVida(true);
    setHasSanity(false);
    setHasEnergy(false);
  };

  return (
    <div className="fixed bottom-20 left-8 z-40">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.5)] border border-temor-gold transition-all flex items-center gap-2 group"
          title="Adicionar NPC/Inimigo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-cinzel text-xs font-bold uppercase tracking-widest">Novo Alvo</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-temor-gold rounded-xl p-6 shadow-2xl w-80 max-h-[85vh] overflow-y-auto animate-fadeIn scrollbar-hide">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-900 py-1 border-b border-slate-800 z-10">
            <h3 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest">Configurar Alvo</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          
          <div className="space-y-4">
            {/* Identificação */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase text-slate-500 font-bold">Identificação</label>
              <input 
                type="text" placeholder="Nome Real" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs outline-none focus:border-temor-gold"
              />
              <input 
                type="text" placeholder="Codinome do Alvo" value={codename} onChange={e => setCodename(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs outline-none focus:border-temor-gold font-bold"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Classificação</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs outline-none focus:border-temor-gold"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Foto Upload */}
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Foto do Computador</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors"
                >
                  {imageUrl ? 'Trocar Imagem' : 'Selecionar Arquivo'}
                </button>
                {imageUrl && (
                  <div className="h-20 w-full rounded overflow-hidden border border-slate-800">
                    <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Status: Vida */}
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" id="chkVida" checked={hasVida} onChange={e => setHasVida(e.target.checked)} className="accent-red-500" />
                <label htmlFor="chkVida" className="text-[10px] uppercase text-red-500 font-bold cursor-pointer">Usar Vida?</label>
              </div>
              {hasVida && (
                <div className="flex justify-between items-center">
                   <label className="text-[9px] text-slate-500 uppercase">Pontos:</label>
                   <input type="number" value={vida} onChange={e => setVida(Math.max(1, parseInt(e.target.value) || 0))} className="w-16 bg-slate-900 border border-slate-800 p-1 rounded text-xs text-center font-bold" />
                </div>
              )}
            </div>

            {/* Status: Sanidade */}
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" id="chkSanity" checked={hasSanity} onChange={e => setHasSanity(e.target.checked)} className="accent-blue-500" />
                <label htmlFor="chkSanity" className="text-[10px] uppercase text-blue-400 font-bold cursor-pointer">Usar Sanidade?</label>
              </div>
              {hasSanity && (
                <div className="flex justify-between items-center">
                   <label className="text-[9px] text-slate-500 uppercase">Pontos:</label>
                   <input type="number" value={sanidade} onChange={e => setSanidade(Math.max(1, parseInt(e.target.value) || 0))} className="w-16 bg-slate-900 border border-slate-800 p-1 rounded text-xs text-center font-bold" />
                </div>
              )}
            </div>

            {/* Status: Energia */}
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" id="chkEnergy" checked={hasEnergy} onChange={e => setHasEnergy(e.target.checked)} className="accent-amber-500" />
                <label htmlFor="chkEnergy" className="text-[10px] uppercase text-amber-500 font-bold cursor-pointer">Usar Energia?</label>
              </div>
              {hasEnergy && (
                <div className="flex justify-between items-center">
                   <label className="text-[9px] text-slate-500 uppercase">Pontos:</label>
                   <input type="number" value={energia} onChange={e => setEnergia(Math.max(1, parseInt(e.target.value) || 0))} className="w-16 bg-slate-900 border border-slate-800 p-1 rounded text-xs text-center font-bold" />
                </div>
              )}
            </div>

            <button 
              onClick={handleAdd}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-amber-900/20"
            >
              Implantar no Campo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterPanel;
