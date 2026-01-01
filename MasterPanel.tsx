
import React, { useState, useRef } from 'react';
import { Character, Attribute, MapData, Campaign } from './types';

interface MasterPanelProps {
  activeCampaign: Campaign;
  onAddNpc: (npc: Character) => void;
  onAddMap: (map: MapData) => void;
  onImportCampaign: (campaign: Campaign) => void;
  onResetCampaign?: () => void;
}

const MasterPanel: React.FC<MasterPanelProps> = ({ activeCampaign, onAddNpc, onAddMap, onImportCampaign, onResetCampaign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'NPC' | 'MAP' | 'CAMP'>('NPC');

  // NPC State
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [category, setCategory] = useState('Ameaça');
  const [vida, setVida] = useState(10);
  const [sanidade, setSanidade] = useState(10);
  const [energia, setEnergia] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [attrs, setAttrs] = useState<Record<Attribute, number>>({
    [Attribute.Forca]: 0, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 0,
    [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
  });

  // MAP State
  const [mapName, setMapName] = useState('');
  const [mapDesc, setMapDesc] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapFileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(activeCampaign, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `Campanha_TEMOR_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported.characters && imported.chatMessages) {
            onImportCampaign(imported);
            setIsOpen(false);
            alert("Operação carregada com sucesso!");
          } else {
            alert("Arquivo de campanha inválido.");
          }
        } catch (err) {
          alert("Erro ao processar arquivo JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddNpc = () => {
    if (!name || !codename) return alert("Preencha Nome e Codinome");
    // Updated object to correctly implement Character interface
    // Fixed 'inventory' to 'inventoryItems' and added missing required fields
    onAddNpc({
      id: `npc-${Date.now()}`,
      name, 
      codename, 
      race: 'NPC', 
      age: 0, 
      class: category, 
      appearance: 'Registro inserido pelo Mestre.',
      history: 'Registro Mestre',
      talents: '?',
      faults: '?',
      personality: 'Agressiva',
      attributes: attrs,
      skills: { atletismo: 0, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0, agilidade: 0, percepcao: 0, investigacao: 0, animais: 0, atuacao: 0, diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0 },
      maxVida: vida, currentVida: vida, maxSanidade: sanidade, currentSanidade: sanidade, maxEnergia: energia, currentEnergia: energia,
      imageUrl: imageUrl || 'https://via.placeholder.com/400?text=NPC', 
      inventoryItems: [], 
      // Changed vestuarioWeight: 0 to vestuarioItems: [] to match Character interface
      vestuarioItems: [],
      armas: 'Ataque Padrão', 
      armadura: 'Nenhuma', 
      isNpc: true
    });
    setIsOpen(false);
    resetForm();
  };

  const handleAddMap = () => {
    if (!mapName || !mapUrl) return alert("Preencha Nome e Imagem do Mapa");
    onAddMap({ id: `map-${Date.now()}`, name: mapName, url: mapUrl, description: mapDesc });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setCodename(''); setVida(10); setSanidade(10); setEnergia(10); setImageUrl('');
    setMapName(''); setMapDesc(''); setMapUrl('');
    setAttrs({
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
    });
  };

  return (
    <div className="fixed bottom-20 left-8 z-40 flex flex-col gap-4">
      {isOpen && (
        <div className="bg-slate-900 border border-temor-gold rounded-xl p-6 shadow-2xl w-96 max-h-[85vh] overflow-y-auto animate-fadeIn scrollbar-hide mb-4">
          <div className="flex gap-4 mb-6 border-b border-slate-800">
            <button onClick={() => setActiveTab('NPC')} className={`pb-2 px-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'NPC' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>Novo Alvo</button>
            <button onClick={() => setActiveTab('MAP')} className={`pb-2 px-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'MAP' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>Novo Mapa</button>
            <button onClick={() => setActiveTab('CAMP')} className={`pb-2 px-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'CAMP' ? 'text-temor-gold border-b-2 border-temor-gold' : 'text-slate-500'}`}>Operação</button>
          </div>

          {activeTab === 'NPC' ? (
            <div className="space-y-4">
              <input placeholder="Nome Real" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
              <input placeholder="Codinome" value={codename} onChange={e => setCodename(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs font-bold" />
              
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Atributos Base</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Attribute).map(attr => (
                    <div key={attr} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-[8px] uppercase font-bold text-slate-400">{attr}</span>
                      <input 
                        type="number" 
                        value={attrs[attr]} 
                        onChange={e => setAttrs({...attrs, [attr]: parseInt(e.target.value) || 0})} 
                        className="w-8 bg-transparent text-center text-temor-gold text-xs font-bold" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
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
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-slate-800 text-[10px] rounded uppercase font-bold">{imageUrl ? 'Arte Carregada' : 'Subir Arte do Alvo'}</button>
              <button onClick={handleAddNpc} className="w-full py-3 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-widest">Confirmar Alvo</button>
            </div>
          ) : activeTab === 'MAP' ? (
            <div className="space-y-4">
              <input placeholder="Nome do Local" value={mapName} onChange={e => setMapName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
              <textarea placeholder="Descrição tática" value={mapDesc} onChange={e => setMapDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs h-20" />
              <input type="file" accept="image/*" ref={mapFileInputRef} onChange={e => handleFileChange(e, setMapUrl)} className="hidden" />
              <button onClick={() => mapFileInputRef.current?.click()} className="w-full py-2 bg-slate-800 text-[10px] rounded uppercase font-bold">{mapUrl ? 'Imagem Carregada' : 'Selecionar Mapa'}</button>
              <button onClick={handleAddMap} className="w-full py-3 bg-temor-crimson text-white rounded text-xs font-bold uppercase tracking-widest">Adicionar Mapa</button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="text-center">
                 <h4 className="text-[10px] font-black uppercase text-temor-gold mb-2">Backup de Segurança</h4>
                 <p className="text-[9px] text-slate-500 leading-relaxed italic">"Exporte o estado atual da missão para um arquivo local para garantir que nenhum dado seja perdido."</p>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                 <button onClick={handleExport} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-black uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Exportar Operação
                 </button>
                 
                 <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
                 <button onClick={() => importFileRef.current?.click()} className="w-full py-3 bg-temor-crimson hover:bg-red-800 text-white rounded text-[10px] font-black uppercase tracking-widest border border-temor-gold flex items-center justify-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   Importar Operação
                 </button>
               </div>

               <div className="pt-4 border-t border-slate-800">
                  <button onClick={onResetCampaign} className="w-full py-2 bg-red-950/30 text-red-500 rounded text-[9px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Reset Total dos Servidores</button>
               </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setIsOpen(!isOpen)} className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl border border-yellow-300/30 transition-all flex items-center gap-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-cinzel text-xs font-bold uppercase tracking-widest">Painel Mestre</span>
        </button>
      </div>
    </div>
  );
};

export default MasterPanel;
