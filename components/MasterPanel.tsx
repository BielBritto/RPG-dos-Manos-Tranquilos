
import React, { useState, useRef } from 'react';
import { Character, Attribute, MapData, Campaign, VisualEffectType, ChatMessage } from '../types';

interface MasterPanelProps {
  activeCampaign: Campaign;
  onAddNpc: (npc: Character) => void;
  onAddMap: (map: MapData) => void;
  onImportCampaign: (campaign: Campaign) => void;
  onResetCampaign?: () => void;
  onTriggerFX: (effect: VisualEffectType) => void;
  onSystemMessage: (msg: ChatMessage) => void;
}

const MasterPanel: React.FC<MasterPanelProps> = ({ 
  activeCampaign, onAddNpc, onAddMap, onImportCampaign, onResetCampaign, onTriggerFX, onSystemMessage 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'NPC' | 'MAP' | 'FX' | 'DICE' | 'CAMP'>('NPC');

  // NPC / Character State
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [category, setCategory] = useState('Inimigo');
  const [customCategory, setCustomCategory] = useState('');
  const [rank, setRank] = useState('');
  
  // Bio Data
  const [history, setHistory] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [talents, setTalents] = useState('');
  const [faults, setFaults] = useState('');
  
  // Gear
  const [armasText, setArmasText] = useState('');
  const [armaduraText, setArmaduraText] = useState('');
  
  // Stats & Visibility
  const [vida, setVida] = useState(10);
  const [showVida, setShowVida] = useState(true);
  
  const [sanidade, setSanidade] = useState(10);
  const [showSanidade, setShowSanidade] = useState(true);
  
  const [energia, setEnergia] = useState(10);
  const [showEnergia, setShowEnergia] = useState(true);
  
  const [showAttributes, setShowAttributes] = useState(true);

  const [imageUrl, setImageUrl] = useState('');
  const [isNpc, setIsNpc] = useState(true);

  // Map State
  const [mapName, setMapName] = useState('');
  const [mapDesc, setMapDesc] = useState('');
  const [mapImg, setMapImg] = useState('');

  // Dice Roller State
  const [selectedCharId, setSelectedCharId] = useState('');
  const [diceFormula, setDiceFormula] = useState('1d20');
  const [rollLabel, setRollLabel] = useState('');

  const [attrs, setAttrs] = useState<Record<Attribute, number>>({
    [Attribute.Forca]: 0, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 0,
    [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);
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
      name, 
      codename, 
      race: isNpc ? 'Criatura/NPC' : 'Humano', 
      age: '?', 
      class: finalClass,
      rank: rank || 'Desconhecida',
      appearance: appearance || 'Sem dados visuais.',
      history: history || 'Registro confidencial.', 
      talents: talents || '-', 
      faults: faults || '-', 
      personality: personality || '-',
      attributes: attrs,
      skills: { atletismo: 0, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0, agilidade: 0, percepcao: 0, investigacao: 0, animais: 0, atuacao: 0, diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0 },
      maxVida: vida, currentVida: vida,
      maxSanidade: sanidade, currentSanidade: sanidade,
      maxEnergia: energia, currentEnergia: energia,
      imageUrl: imageUrl || 'https://via.placeholder.com/400x600?text=SINAL+NAO+DETECTADO',
      inventoryItems: [], 
      vestuarioItems: [],
      armas: armasText || 'Nenhuma', 
      armadura: armaduraText || 'Nenhuma',
      isNpc, 
      isActive: true, 
      isDeleted: false,
      statusConfig: { 
        showAttributes, 
        showVida, 
        showSanidade, 
        showEnergia 
      }
    });
    
    resetForm();
    setIsOpen(false);
  };

  const handleAddNewMap = () => {
    if (!mapName || !mapImg) return alert("Preencha o nome e selecione uma imagem para o mapa.");
    
    onAddMap({
      id: `map-${Date.now()}`,
      name: mapName,
      url: mapImg,
      description: mapDesc || 'Sem descrição tática disponível.'
    });

    setMapName('');
    setMapDesc('');
    setMapImg('');
    setIsOpen(false);
  };

  const resetForm = () => {
    setName(''); setCodename(''); setHistory(''); setTalents(''); setFaults(''); setPersonality('');
    setAppearance(''); setRank(''); setArmasText(''); setArmaduraText('');
    setImageUrl(''); setVida(10); setSanidade(10); setEnergia(10);
    setAttrs({
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          onImportCampaign(imported);
          alert("Dossiê de Campanha carregado.");
          setIsOpen(false);
        } catch (err) { alert("Erro ao ler arquivo."); }
      };
      reader.readAsText(file);
    }
  };

  const handleMasterRoll = () => {
    if (!diceFormula) return;
    const targetChar = activeCampaign.characters.find(c => c.id === selectedCharId);
    const senderName = targetChar ? targetChar.codename : "Mestre (Oculto)";

    const regex = /^(\d*)d(\d+)([\+\-]\d+)?$/i;
    const match = diceFormula.trim().match(regex);

    if (!match) {
      alert("Fórmula inválida. Use ex: 1d20+5");
      return;
    }

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const bonus = match[3] ? parseInt(match[3]) : 0;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0) + bonus;

    onSystemMessage({
      id: Math.random().toString(36).substr(2, 9),
      sender: senderName,
      formula: rollLabel ? `${rollLabel} (${diceFormula.toUpperCase()})` : diceFormula.toUpperCase(),
      rolls,
      bonus,
      total,
      timestamp: new Date(),
      isCriticalSuccess: sides === 20 && rolls.includes(20),
      isCriticalFailure: sides === 20 && rolls.includes(1)
    });
  };

  return (
    <div className="fixed bottom-20 left-8 z-40">
      {isOpen && (
        <div className="bg-slate-900 border border-temor-gold rounded-xl p-6 shadow-2xl w-[500px] max-h-[85vh] overflow-y-auto animate-fadeIn scrollbar-hide mb-4">
          <div className="flex gap-4 mb-6 border-b border-slate-800">
            <button onClick={() => setActiveTab('NPC')} className={`pb-2 text-[10px] font-bold uppercase transition-all ${activeTab === 'NPC' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>CRIADOR</button>
            <button onClick={() => setActiveTab('MAP')} className={`pb-2 text-[10px] font-bold uppercase transition-all ${activeTab === 'MAP' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>MAPAS</button>
            <button onClick={() => setActiveTab('FX')} className={`pb-2 text-[10px] font-bold uppercase transition-all ${activeTab === 'FX' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>FX</button>
            <button onClick={() => setActiveTab('DICE')} className={`pb-2 text-[10px] font-bold uppercase transition-all ${activeTab === 'DICE' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>DADOS</button>
            <button onClick={() => setActiveTab('CAMP')} className={`pb-2 text-[10px] font-bold uppercase transition-all ${activeTab === 'CAMP' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>CAMPANHA</button>
          </div>

          {activeTab === 'NPC' && (
            <div className="space-y-4">
              {/* Type Selection */}
              <div className="flex gap-4 p-2 bg-slate-950 rounded border border-slate-800 mb-2">
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-temor-gold cursor-pointer">
                   <input type="radio" checked={isNpc} onChange={() => setIsNpc(true)} /> Inimigo/NPC
                 </label>
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-cyan-500 cursor-pointer">
                   <input type="radio" checked={!isNpc} onChange={() => setIsNpc(false)} /> Agente
                 </label>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Nome Real" value={name} onChange={e => setName(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
                <input placeholder="Codinome" value={codename} onChange={e => setCodename(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs font-bold text-temor-gold" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {category === 'Outro' ? (
                   <input placeholder="Classe Customizada" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
                ) : (
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300">
                    <option value="Inimigo">Inimigo Comum</option>
                    <option value="Boss">Boss / Elite</option>
                    <option value="Aliado">Aliado</option>
                    <option value="Agente">Agente da Ordem</option>
                    <option value="Civil">Civil</option>
                    <option value="Outro">Outro...</option>
                  </select>
                )}
                <input placeholder="Patente / Nível" value={rank} onChange={e => setRank(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
              </div>

              {/* Stats & Visibility */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-3">
                <h5 className="text-[9px] font-black text-slate-500 uppercase border-b border-slate-800 pb-1 mb-2">Status Vitais & Visibilidade</h5>
                
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-red-500">Vida</span>
                        <input type="checkbox" checked={showVida} onChange={e => setShowVida(e.target.checked)} className="w-3 h-3 accent-red-600" title="Visível para jogadores?" />
                      </div>
                      <input type="number" value={vida} onChange={e => setVida(parseInt(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-700 p-1 rounded text-center text-xs" />
                   </div>
                   
                   <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-cyan-500">Sanidade</span>
                        <input type="checkbox" checked={showSanidade} onChange={e => setShowSanidade(e.target.checked)} className="w-3 h-3 accent-cyan-600" title="Visível para jogadores?" />
                      </div>
                      <input type="number" value={sanidade} onChange={e => setSanidade(parseInt(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-700 p-1 rounded text-center text-xs" />
                   </div>

                   <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-amber-500">Energia</span>
                        <input type="checkbox" checked={showEnergia} onChange={e => setShowEnergia(e.target.checked)} className="w-3 h-3 accent-amber-600" title="Visível para jogadores?" />
                      </div>
                      <input type="number" value={energia} onChange={e => setEnergia(parseInt(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-700 p-1 rounded text-center text-xs" />
                   </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                 <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Atributos</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <span className="text-[8px] text-slate-500 uppercase">Visível?</span>
                      <input type="checkbox" checked={showAttributes} onChange={e => setShowAttributes(e.target.checked)} className="w-3 h-3 accent-slate-600" />
                    </label>
                 </div>
                 <div className="grid grid-cols-6 gap-1">
                  {Object.values(Attribute).map(attr => (
                    <div key={attr} className="flex flex-col items-center">
                      <span className="text-[7px] uppercase font-bold text-slate-600 mb-1">{attr.substring(0,3)}</span>
                      <input type="number" value={attrs[attr]} onChange={e => setAttrs({...attrs, [attr]: parseInt(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-700 p-1 rounded text-[10px] text-center text-temor-gold" />
                    </div>
                  ))}
                 </div>
              </div>

              {/* Details & Lore */}
              <div className="space-y-2">
                <input placeholder="Armas / Ataques" value={armasText} onChange={e => setArmasText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
                <input placeholder="Armadura / Proteção" value={armaduraText} onChange={e => setArmaduraText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
                <textarea placeholder="História / Descrição" value={history} onChange={e => setHistory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs h-16 text-slate-300 scrollbar-hide" />
                <textarea placeholder="Aparência Física" value={appearance} onChange={e => setAppearance(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs h-12 text-slate-300 scrollbar-hide" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                 <input placeholder="Personalidade" value={personality} onChange={e => setPersonality(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
                 <input placeholder="Talentos" value={talents} onChange={e => setTalents(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
              </div>

              {/* Image Upload */}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={e => handleFileChange(e, setImageUrl)} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`w-full py-2 border border-dashed rounded uppercase font-bold text-[10px] transition-colors ${imageUrl ? 'bg-emerald-900/30 border-emerald-600 text-emerald-500' : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                {imageUrl ? '✓ Imagem Carregada' : '+ Carregar Retrato'}
              </button>
              
              <button onClick={handleAddCharacter} className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded font-bold uppercase shadow-lg text-xs tracking-widest mt-4">
                CRIAR REGISTRO
              </button>
            </div>
          )}

          {activeTab === 'MAP' && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-temor-gold border-b border-slate-800 pb-2">NOVA ZONA DE OPERAÇÃO</h4>
              <input placeholder="Nome do Local (Ex: Bunker Delta)" value={mapName} onChange={e => setMapName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" />
              <textarea placeholder="Descrição tática do terreno..." value={mapDesc} onChange={e => setMapDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs h-24 text-slate-300" />
              
              <input type="file" accept="image/*" ref={mapInputRef} onChange={e => handleFileChange(e, setMapImg)} className="hidden" />
              <button onClick={() => mapInputRef.current?.click()} className="w-full py-2 bg-slate-800 text-[10px] rounded uppercase font-bold text-slate-200 border border-slate-700">
                {mapImg ? '✓ Mapa Carregado' : '+ Selecionar Imagem do Mapa'}
              </button>

              <button onClick={handleAddNewMap} className="w-full py-3 bg-temor-crimson hover:bg-red-800 text-white rounded text-xs font-bold uppercase transition-all shadow-lg border border-temor-gold/30">
                ESTABELECER PERÍMETRO (ADICIONAR)
              </button>
            </div>
          )}
          
          {activeTab === 'DICE' && (
             <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase text-temor-gold border-b border-slate-800 pb-2">ROLAGEM DE COMANDO</h4>
               
               <div className="space-y-2">
                 <label className="text-[9px] font-bold text-slate-500 uppercase">Executar como:</label>
                 <select 
                   value={selectedCharId} 
                   onChange={e => setSelectedCharId(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white"
                 >
                   <option value="">[Mestre Oculto]</option>
                   {activeCampaign.characters.map(char => (
                     <option key={char.id} value={char.id}>{char.codename} ({char.name})</option>
                   ))}
                 </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Motivo / Perícia (Opcional)</label>
                  <input 
                    value={rollLabel} 
                    onChange={e => setRollLabel(e.target.value)} 
                    placeholder="Ex: Furtividade, Ataque, Sanidade..." 
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-white" 
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Fórmula</label>
                  <div className="flex gap-2">
                     <input 
                       value={diceFormula} 
                       onChange={e => setDiceFormula(e.target.value)} 
                       placeholder="1d20+5" 
                       className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono text-temor-gold" 
                     />
                     <button onClick={handleMasterRoll} className="px-4 bg-temor-crimson text-white font-bold text-xs rounded hover:bg-red-800 transition-colors uppercase">
                       ROLAR
                     </button>
                  </div>
               </div>

               <div className="pt-2 border-t border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {['1d20', '2d20', '1d6', '2d6', '1d100'].map(d => (
                      <button key={d} onClick={() => setDiceFormula(d)} className="px-2 py-1 bg-slate-800 text-[9px] rounded text-slate-400 hover:text-white hover:bg-slate-700">
                        {d}
                      </button>
                    ))}
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'CAMP' && (
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase text-temor-gold border-b border-slate-800 pb-2 text-center">GESTÃO DE CAMPANHAS</h4>
               <button onClick={() => {
                 const dataStr = JSON.stringify(activeCampaign, null, 2);
                 const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                 const link = document.createElement('a');
                 link.setAttribute('href', dataUri);
                 link.setAttribute('download', `Campanha_${activeCampaign.name}.json`);
                 link.click();
               }} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-black uppercase border border-slate-700">Exportar Campanha</button>

               <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
               <button onClick={() => importFileRef.current?.click()} className="w-full py-3 bg-amber-600/20 text-amber-500 rounded text-[10px] font-black uppercase border border-amber-600/50 hover:bg-amber-600 hover:text-white transition-all">Importar Campanha</button>

               <button onClick={onResetCampaign} className="w-full py-2 mt-8 bg-red-950/40 text-red-500 rounded text-[9px] font-bold uppercase border border-red-900/30 hover:bg-red-600 hover:text-white transition-all">Resetar Sistema</button>
            </div>
          )}

          {activeTab === 'FX' && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onTriggerFX('BLOOD_SPLASH')} className="p-4 bg-red-900/20 rounded-lg text-red-500 border border-red-900 font-bold text-xs uppercase hover:bg-red-900/40 transition-colors">Dano Crítico</button>
              <button onClick={() => onTriggerFX('SANITY_BLUR')} className="p-4 bg-purple-900/20 rounded-lg text-purple-500 border border-purple-900 font-bold text-xs uppercase hover:bg-purple-900/40 transition-colors">Terror</button>
              <button onClick={() => onTriggerFX('DANGER_ALARM')} className="p-4 bg-yellow-900/20 rounded-lg text-yellow-500 border border-yellow-900 font-bold text-xs uppercase hover:bg-yellow-900/40 transition-colors">Perigo</button>
              <button onClick={() => onTriggerFX('HEAL_GLOW')} className="p-4 bg-emerald-900/20 rounded-lg text-emerald-500 border border-emerald-900 font-bold text-xs uppercase hover:bg-emerald-900/40 transition-colors">Cura</button>
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
