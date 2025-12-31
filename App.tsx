
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Character, AppView, Attribute, ChatMessage, PlayerSession, MapData, Campaign } from './types';
import { INITIAL_CHARACTERS, INITIAL_MAPS } from './constants';
import CharacterCard from './components/CharacterCard';
import CharacterDetail from './components/CharacterDetail';
import MapView from './components/MapView';
import DiceChat from './components/DiceChat';
import LandingScreen from './components/LandingScreen';
import MasterPanel from './components/MasterPanel';

const STORAGE_KEY_CAMPAIGNS = 'temor_rpg_campaign_list';
const STORAGE_KEY_SESSION = 'temor_rpg_session';
const STORAGE_KEY_ACTIVE_CAMPAIGN_ID = 'temor_rpg_active_campaign_id';

const App: React.FC = () => {
  // --- Campaign State Management ---
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_CAMPAIGN_ID);
  });

  const [saveFeedback, setSaveFeedback] = useState(false);

  // Derive the active campaign data
  const activeCampaign = useMemo(() => {
    return campaigns.find(c => c.id === activeCampaignId) || null;
  }, [campaigns, activeCampaignId]);

  // Initial Campaign Creation if none exists
  useEffect(() => {
    if (campaigns.length === 0) {
      const defaultCampaign: Campaign = {
        id: 'default-' + Date.now(),
        name: 'Campanha Principal',
        createdAt: Date.now(),
        lastPlayed: Date.now(),
        characters: INITIAL_CHARACTERS,
        chatMessages: [],
        currentMapId: INITIAL_MAPS[0].id
      };
      setCampaigns([defaultCampaign]);
      setActiveCampaignId(defaultCampaign.id);
    }
  }, [campaigns.length]);

  const [session, setSession] = useState<PlayerSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    setSaveFeedback(true);
    const timer = setTimeout(() => setSaveFeedback(false), 2000);
    return () => clearTimeout(timer);
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (activeCampaignId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CAMPAIGN_ID, activeCampaignId);
    }
  }, [activeCampaignId]);

  // Update active campaign data helper
  const updateActiveCampaign = useCallback((updates: Partial<Campaign>) => {
    if (!activeCampaignId) return;
    setCampaigns(prev => prev.map(c => {
      if (c.id === activeCampaignId) {
        return { ...c, ...updates, lastPlayed: Date.now() };
      }
      return c;
    }));
  }, [activeCampaignId]);

  const updateCharacterStatus = useCallback((id: string, field: keyof Character, value: number) => {
    if (!activeCampaign) return;
    const newChars = activeCampaign.characters.map(char => {
      if (char.id === id) return { ...char, [field]: value };
      return char;
    });
    updateActiveCampaign({ characters: newChars });
  }, [activeCampaign, updateActiveCampaign]);

  const addNpc = useCallback((npc: Character) => {
    if (!activeCampaign) return;
    updateActiveCampaign({ characters: [...activeCampaign.characters, npc] });
  }, [activeCampaign, updateActiveCampaign]);

  const removeCharacter = useCallback((id: string) => {
    if (!activeCampaign) return;
    if (confirm("Remover este registro permanentemente desta campanha?")) {
      const newChars = activeCampaign.characters.filter(c => c.id !== id);
      updateActiveCampaign({ characters: newChars });
      if (selectedCharacterId === id) setCurrentView(AppView.Dashboard);
    }
  }, [activeCampaign, selectedCharacterId, updateActiveCampaign]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    if (!activeCampaign) return;
    updateActiveCampaign({ chatMessages: [...activeCampaign.chatMessages, msg] });
  }, [activeCampaign, updateActiveCampaign]);

  const handleLogout = () => {
    if (confirm("Sair da sessão atual?")) setSession(null);
  };

  const createNewCampaign = () => {
    const name = prompt("Nome da Nova Campanha:");
    if (!name) return;
    const newCampaign: Campaign = {
      id: 'campaign-' + Date.now(),
      name,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      characters: INITIAL_CHARACTERS,
      chatMessages: [],
      currentMapId: INITIAL_MAPS[0].id
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setActiveCampaignId(newCampaign.id);
    setCurrentView(AppView.Dashboard);
  };

  const deleteCampaign = (id: string) => {
    if (campaigns.length <= 1) {
      alert("Você deve ter pelo menos uma campanha.");
      return;
    }
    if (confirm("Deletar esta campanha permanentemente?")) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      if (activeCampaignId === id) {
        setActiveCampaignId(campaigns.find(c => c.id !== id)?.id || null);
      }
    }
  };

  const handleQuickRoll = (characterName: string) => {
    if (!activeCampaign || !session) return;
    
    setIsChatOpen(true);
    
    // Default 1d20 for quick testing
    const sides = 20;
    const rollValue = Math.floor(Math.random() * sides) + 1;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: session.isMaster ? `GM (${characterName})` : characterName,
      formula: "1D20",
      rolls: [rollValue],
      bonus: 0,
      total: rollValue,
      timestamp: new Date(),
      isCriticalSuccess: rollValue === 20,
      isCriticalFailure: rollValue === 1
    };

    addChatMessage(newMessage);
  };

  if (!session) {
    return <LandingScreen characters={activeCampaign?.characters || INITIAL_CHARACTERS} onStart={setSession} />;
  }

  const selectedCharacter = activeCampaign?.characters.find(c => c.id === selectedCharacterId);
  const currentMap = INITIAL_MAPS.find(m => m.id === activeCampaign?.currentMapId) || INITIAL_MAPS[0];

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      <header className="flex-none bg-slate-900 border-b border-temor-gold shadow-xl p-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border-2 flex items-center justify-center rounded-sm rotate-45 ${session.isMaster ? 'bg-amber-600 border-yellow-300' : 'bg-temor-crimson border-temor-gold'}`}>
              <span className="text-white font-cinzel font-bold text-xl -rotate-45">{session.isMaster ? 'M' : 'T'}</span>
            </div>
            <div>
              <h1 className="text-lg font-cinzel font-bold tracking-widest text-temor-gold">TEMOR</h1>
              <p className="text-[10px] uppercase tracking-tighter text-slate-400">
                {session.isMaster ? 'MESTRE' : 'AGENTE'}: <span className="text-white">{session.playerName}</span> | {activeCampaign?.name}
              </p>
            </div>
          </div>

          <nav className="flex gap-2 items-center">
            {saveFeedback && (
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse mr-2">Salvamento Auto ✓</span>
            )}
            
            <button 
              onClick={() => setCurrentView(AppView.Dashboard)}
              className={`px-4 py-1.5 rounded-md font-cinzel text-sm transition-all ${currentView === AppView.Dashboard ? 'bg-temor-crimson text-white border border-temor-gold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Equipe
            </button>
            <button 
              onClick={() => setCurrentView(AppView.Map)}
              className={`px-4 py-1.5 rounded-md font-cinzel text-sm transition-all ${currentView === AppView.Map ? 'bg-temor-crimson text-white border border-temor-gold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Mapas
            </button>
            {session.isMaster && (
              <button 
                onClick={() => setCurrentView(AppView.Campaigns)}
                className={`px-4 py-1.5 rounded-md font-cinzel text-sm transition-all ${currentView === AppView.Campaigns ? 'bg-amber-600 text-white border border-temor-gold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                Campanhas
              </button>
            )}
            
            <div className="h-6 w-px bg-slate-800 mx-1" />
            
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-1.5 rounded-md transition-all ${isChatOpen ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
            <button onClick={handleLogout} className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            {currentView === AppView.Dashboard && activeCampaign && (
              <div className="space-y-8 pb-12">
                <section>
                  <h2 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest mb-4 border-l-4 border-temor-crimson pl-3">Agentes Ômega</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCampaign.characters.filter(c => !c.isNpc).map(char => (
                      <CharacterCard 
                        key={char.id} 
                        character={char} 
                        isPlayerCharacter={char.id === session.characterId}
                        isMaster={session.isMaster}
                        onSelect={() => { setSelectedCharacterId(char.id); setCurrentView(AppView.CharacterDetail); }}
                        onUpdateStatus={updateCharacterStatus}
                        onQuickRoll={handleQuickRoll}
                      />
                    ))}
                  </div>
                </section>

                {activeCampaign.characters.some(c => c.isNpc) && (
                  <section>
                    <h2 className="text-sm font-cinzel font-bold text-red-500 uppercase tracking-widest mb-4 border-l-4 border-red-500 pl-3">Alvos e Hostis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCampaign.characters.filter(c => c.isNpc).map(char => (
                        <div key={char.id} className="relative group">
                          <CharacterCard 
                            character={char} 
                            isPlayerCharacter={false}
                            isMaster={session.isMaster}
                            onSelect={() => { setSelectedCharacterId(char.id); setCurrentView(AppView.CharacterDetail); }}
                            onUpdateStatus={updateCharacterStatus}
                            onQuickRoll={handleQuickRoll}
                          />
                          {session.isMaster && (
                            <button 
                              onClick={() => removeCharacter(char.id)}
                              className="absolute top-2 left-2 bg-red-900/90 text-white text-[10px] font-bold uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              Eliminar Alvo
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {currentView === AppView.Map && (
              <MapView 
                currentMap={currentMap} 
                allMaps={INITIAL_MAPS} 
                isMaster={session.isMaster} 
                onSelectMap={(id) => updateActiveCampaign({ currentMapId: id })}
              />
            )}

            {currentView === AppView.CharacterDetail && selectedCharacter && (
              <CharacterDetail 
                character={selectedCharacter} 
                isPlayerCharacter={selectedCharacter.id === session.characterId}
                onBack={() => setCurrentView(AppView.Dashboard)}
                onUpdateStatus={updateCharacterStatus}
              />
            )}

            {currentView === AppView.Campaigns && session.isMaster && (
              <div className="space-y-6 max-w-2xl mx-auto py-8">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-cinzel font-bold text-temor-gold tracking-widest">GERENCIADOR DE CAMPANHAS</h2>
                  <button onClick={createNewCampaign} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase px-4 py-2 rounded transition-all shadow-lg">Nova Campanha</button>
                </div>
                <div className="grid gap-4">
                  {campaigns.map(c => (
                    <div key={c.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${c.id === activeCampaignId ? 'bg-slate-800 border-temor-gold shadow-[0_0_15px_rgba(161,98,7,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                      <div>
                        <h3 className="font-cinzel font-bold text-lg text-slate-100">{c.name}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Último acesso: {new Date(c.lastPlayed).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="flex gap-2">
                        {c.id !== activeCampaignId && (
                          <button onClick={() => setActiveCampaignId(c.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold uppercase rounded border border-slate-700 transition-colors">Carregar</button>
                        )}
                        <button onClick={() => deleteCampaign(c.id)} className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900 text-red-500 hover:text-white text-[10px] font-bold uppercase rounded border border-red-500/30 transition-colors">Apagar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {isChatOpen && activeCampaign && (
          <aside className="w-80 md:w-96 flex-none z-30">
            <DiceChat currentUsername={session.playerName} messages={activeCampaign.chatMessages} onSendMessage={addChatMessage} />
          </aside>
        )}

        {session.isMaster && currentView === AppView.Dashboard && (
          <MasterPanel onAddNpc={addNpc} />
        )}
      </div>

      <footer className="flex-none bg-slate-900 border-t border-slate-800 p-2 text-center text-[10px] text-slate-500 uppercase tracking-[0.3em]">
        SYNC STATUS: OPERACIONAL // {activeCampaign?.name.toUpperCase()} // {new Date().toLocaleDateString('pt-BR')}
      </footer>
    </div>
  );
};

export default App;
