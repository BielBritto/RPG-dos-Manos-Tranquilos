import React, { useState, useRef } from 'react';
import { Character, Attribute, MapData, Campaign, VisualEffectType, Skills } from '../types';

interface MasterPanelProps {
  activeCampaign: Campaign;
  onAddNpc: (npc: Character) => void;
  onAddMap: (map: MapData) => void;
  onImportCampaign: (campaign: Campaign) => void;
  onResetCampaign?: () => void;
  onTriggerFX: (effect: VisualEffectType) => void;
}

const MasterPanel: React.FC<MasterPanelProps> = ({ 
  activeCampaign, onAddNpc, onAddMap, onImportCampaign, onResetCampaign, onTriggerFX 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'NPC' | 'MAP' | 'CAMP' | 'FX'>('NPC');

  // NPC State
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [category, setCategory] = useState('Inimigo');
  const [customCategory, setCustomCategory] = useState('');
  const [history, setHistory] = useState('');
  const [talents, setTalents] = useState('');
  const [faults, setFaults] = useState('');
  const [personality, setPersonality] = useState('');
  const [armasText, setArmasText] = useState('');
  const [vida, setVida] = useState(10);
  const [sanidade, setSanidade] = useState(10);
  const [energia, setEnergia] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [isNpc, setIsNpc] = useState(true);

  // Status Visibility State
  const [showVida, setShowVida] = useState(true);
  const [showSanidade, setShowSanidade] = useState(true);
  const [showEnergia, setShowEnergia] = useState(true);

  const [attrs, setAttrs] = useState<Record<Attribute, number>>({
    [Attribute.Forca]: 0, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 0,
    [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
  });

  const [skills, setSkills] = useState<Skills>({
    atletismo: 0, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0, agilidade: 0, percepcao: 0, investigacao: 0, animais: 0, atuacao: 0, diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCharacter = () => {
    if (!name || !codename) return alert("Preencha Nome e Codinome");
    const finalClass = category === 'Outro' ? customCategory : category;

    onAddNpc({
      id: `${isNpc ? 'npc' : 'agent'}-${Date.now()}`,
      name, codename, race: 'Humano', age: '?', class: finalClass,
      appearance: 'Registro Operacional',
      history, talents, faults, personality,
      attributes: attrs,
      skills: skills,
      maxVida: vida, currentVida: vida,
      maxSanidade: sanidade, currentSanidade: sanidade,
      maxEnergia: energia, currentEnergia: energia,
      imageUrl: imageUrl || 'https://via.placeholder.com/400x600?text=AGENTE',
      inventoryItems: [], vestuarioItems: [],
      armas: armasText || 'Nenhuma', armadura: 'Nenhuma',
      isNpc, isActive: true, isDeleted: false,
      statusConfig: { showAttributes: true, showVida, showSanidade, showEnergia }
    });
    
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setCodename(''); setHistory(''); setTalents(''); setFaults(''); setPersonality('');
    setArmasText(''); setImageUrl(''); setVida(10); setSanidade(10); setEnergia(10);
    setShowVida(true); setShowSanidade(true); setShowEnergia(true);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          onImportCampaign(imported);
          alert("Dossiê de Campanha carregado com sucesso.");
          setIsOpen(false);
        } catch (err) { alert("Erro ao ler o arquivo JSON."); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed bottom-20 left-8 z-40">
      {isOpen && (
        <div className="bg-slate-900 border border-temor-gold rounded-xl p-6 shadow-2xl w-[450px] max-h-[85vh] overflow-y-auto animate-fadeIn scrollbar-hide mb-4">
          <div className="flex gap-4 mb-6 border-b border-slate-800">
            <button onClick={() => setActiveTab('NPC')} className={`pb-2 text-[10px] font-bold uppercase ${activeTab === 'NPC' ? 'text-temor-gold border-b-2' : 'text-slate-500'}`}>CRIADOR</button>
            <button onClick={() => setActiveTab('FX')} className={`pb-2 text-[10px] font-bold uppercase ${activeTab === 'FX' ? 'text-temor-gold border-b-2' : 'text-slate-500'}`}>FX</button>
            <button onClick={() => setActiveTab('CAMP')} className={`pb-2 text-[10px] font-bold uppercase ${activeTab === 'CAMP' ? 'text-temor-gold border-b-2' : 'text-slate-500'}`}>CAMPANHA</button>
          </div>

          {activeTab === 'NPC' && (
            <div className="space-y-4">
              <div className="flex gap-4 p-2 bg-slate-950 rounded border border-slate-800 mb-4">
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-temor-gold">
                   <input type="radio" checked={isNpc} onChange={() => setIsNpc(true)} /> Inimigo/NPC
                 </label>
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-cyan-500">
                   <input type="radio" checked={!isNpc} onChange={() => setIsNpc(false)} /> Agente Operacional
                 </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Nome Real" value={name} onChange={e => setName(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
                <input placeholder="Codinome" value={codename} onChange={e => setCodename(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs font-bold text-temor-gold" />
              </div>

              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300">
                <option value="Inimigo">Inimigo</option>
                <option value="Boss">Boss</option>
                <option value="Aliado">Aliado</option>
                <option value="Agente">Agente Especial</option>
                <option value="Outro">Outro...</option>
              </select>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Visibilidade para Jogadores</span>
                <div className="flex justify-between gap-2">
                  <label className="flex items-center gap-2 text-[8px] uppercase font-bold text-red-500">
                    <input type="checkbox" checked={showVida} onChange={e => setShowVida(e.target.checked)} /> Vida
                  </label>
                  <label className="flex items-center gap-2 text-[8px] uppercase font-bold text-cyan-500">
                    <input type="checkbox" checked={showSanidade} onChange={e => setShowSanidade(e.target.checked)} /> Sanidade
                  </label>
                  <label className="flex items-center gap-2 text-[8px] uppercase font-bold text-amber-500">
                    <input type="checkbox" checked={showEnergia} onChange={e => setShowEnergia(e.target.checked)} /> Energia
                  </label>
                </div>
              </div>

              <textarea placeholder="Dossiê Biográfico (História)" value={history} onChange={e => setHistory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs h-16 text-slate-300" />
              
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Talentos" value={talents} onChange={e => setTalents(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
                <input placeholder="Falhas" value={faults} onChange={e => setFaults(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-white" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {Object.values(Attribute).map(attr => (
                  <div key={attr} className="flex flex-col bg-slate-950 p-1 rounded border border-slate-800">
                    <span className="text-[7px] uppercase font-bold text-slate-500 text-center">{attr}</span>
                    <input type="number" value={attrs[attr]} onChange={e => setAttrs({...attrs, [attr]: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-center text-temor-gold text-[10px] font-bold" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-4">
                <div className="text-center">
                  <span className="text-[8px] text-red-500 uppercase font-black">Vida</span>
                  <input type="number" value={vida} onChange={e => setVida(parseInt(e.target.value)||0)} className="w-full bg-slate-950 p-1 rounded text-xs text-center border border-slate-800" />
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-cyan-500 uppercase font-black">Sanidade</span>
                  <input type="number" value={sanidade} onChange={e => setSanidade(parseInt(e.target.value)||0)} className="w-full bg-slate-950 p-1 rounded text-xs text-center border border-slate-800" />
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-amber-500 uppercase font-black">Energia</span>
                  <input type="number" value={energia} onChange={e => setEnergia(parseInt(e.target.value)||0)} className="w-full bg-slate-950 p-1 rounded text-xs text-center border border-slate-800" />
                </div>
              </div>

              <input type="file" accept="image/*" ref={fileInputRef} onChange={e => handleFileChange(e, setImageUrl)} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-slate-800 text-[10px] rounded uppercase font-bold text-slate-200 border border-slate-700">{imageUrl ? '✓ Foto Carregada' : '+ Associar Foto Permanente'}</button>
              
              <button onClick={handleAddCharacter} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold uppercase transition-colors shadow-lg">FINALIZAR REGISTRO</button>
            </div>
          )}

          {activeTab === 'CAMP' && (
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase text-temor-gold border-b border-slate-800 pb-2 text-center">GESTÃO DE CAMPANHAS</h4>
               <p className="text-[9px] text-slate-500 italic text-center px-4">Utilize os botões abaixo para salvar o estado total do jogo ou carregar uma nova história.</p>
               
               <button onClick={() => {
                 const dataStr = JSON.stringify(activeCampaign, null, 2);
                 const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                 const link = document.createElement('a');
                 link.setAttribute('href', dataUri);
                 link.setAttribute('download', `Campanha_${activeCampaign.name}_${new Date().getTime()}.json`);
                 link.click();
               }} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-black uppercase border border-slate-700 flex items-center justify-center gap-2">
                 Exportar Campanha (Download)
               </button>

               <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
               <button onClick={() => importFileRef.current?.click()} className="w-full py-3 bg-amber-600/20 text-amber-500 rounded text-[10px] font-black uppercase border border-amber-600/50 hover:bg-amber-600 hover:white transition-all">
                 Importar Campanha (Upload)
               </button>

               <button onClick={onResetCampaign} className="w-full py-2 mt-8 bg-red-950/40 text-red-500 rounded text-[9px] font-bold uppercase border border-red-900/30 hover:bg-red-600 hover:white transition-all">Resetar Sistema</button>
            </div>
          )}

          {activeTab === 'FX' && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onTriggerFX('BLOOD_SPLASH')} className="p-4 bg-red-900/20 rounded-lg text-red-500 border border-red-900 font-bold text-xs uppercase">Dano Crítico</button>
              <button onClick={() => onTriggerFX('SANITY_BLUR')} className="p-4 bg-purple-900/20 rounded-lg text-purple-500 border border-purple-900 font-bold text-xs uppercase">Terror</button>
              <button onClick={() => onTriggerFX('DANGER_ALARM')} className="p-4 bg-yellow-900/20 rounded-lg text-yellow-500 border border-yellow-900 font-bold text-xs uppercase">Perigo</button>
              <button onClick={() => onTriggerFX('HEAL_GLOW')} className="p-4 bg-emerald-900/20 rounded-lg text-emerald-500 border border-emerald-900 font-bold text-xs uppercase">Cura</button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl border border-yellow-300/30 transition-all flex items-center gap-2 group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-cinzel text-xs font-bold uppercase tracking-widest">COMANDO</span>
      </button>
    </div>
  );
};

export default MasterPanel;