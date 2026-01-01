
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Character, AppView, ChatMessage, PlayerSession, Campaign, SyncAction, VisualEffectType } from './types';
import { INITIAL_CHARACTERS, INITIAL_MAPS } from './constants';
import CharacterCard from './components/CharacterCard';
import CharacterDetail from './components/CharacterDetail';
import MapView from './components/MapView';
import DiceChat from './components/DiceChat';
import LandingScreen from './components/LandingScreen';
import MasterPanel from './components/MasterPanel';
import EffectOverlay from './components/EffectOverlay';
import { Peer, DataConnection } from 'peerjs';

const STORAGE_KEY_CAMPAIGN = 'temor_rpg_v5';

const App: React.FC = () => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGN);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...parsed, 
          chatMessages: (parsed.chatMessages || []).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
          customMaps: parsed.customMaps || INITIAL_MAPS,
          occupiedCharacters: parsed.occupiedCharacters || {},
        };
      } catch (e) { console.error(e); }
    }
    return {
      id: 'main',
      name: 'Operação Primária',
      roomId: '',
      characters: INITIAL_CHARACTERS.map(c => ({ ...c, isActive: true, isDeleted: false })),
      chatMessages: [],
      currentMapId: INITIAL_MAPS[0].id,
      currentNpcLayer: 0,
      customMaps: INITIAL_MAPS,
      occupiedCharacters: {},
      masterIsOnline: false,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
    };
  });

  const [session, setSession] = useState<PlayerSession | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [activeEffect, setActiveEffect] = useState<VisualEffectType | null>(null);
  const [bossEntrance, setBossEntrance] = useState<Character | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<DataConnection[]>([]);
  const campaignRef = useRef<Campaign>(activeCampaign);

  useEffect(() => { campaignRef.current = activeCampaign; }, [activeCampaign]);

  const broadcast = useCallback((action: SyncAction) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) conn.send(action);
    });
  }, []);

  const masterUpdateState = useCallback((updater: (prev: Campaign) => Campaign) => {
    setActiveCampaign(prev => {
      const next = updater(prev);
      broadcast({ type: 'UPDATE_CAMPAIGN', payload: next });
      return next;
    });
  }, [broadcast]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    if (session?.isMaster) {
      masterUpdateState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, msg] }));
    } else {
      const conn = connectionsRef.current.find(c => c.peer.includes('master'));
      if (conn?.open) conn.send({ type: 'CHAT_MESSAGE', payload: msg });
    }
  }, [session, masterUpdateState]);

  const updateCharacterStatus = useCallback((id: string, field: string, value: any) => {
    if (session?.isMaster) {
      masterUpdateState(prev => ({
        ...prev,
        characters: prev.characters.map(c => c.id === id ? { ...c, [field]: value } : c)
      }));
    } else {
      const conn = connectionsRef.current.find(c => c.peer.includes('master'));
      if (conn?.open) conn.send({ type: 'UPDATE_CHARACTER_FIELD', characterId: id, field, value });
      
      // Update local otimista para o jogador não sentir lag
      setActiveCampaign(prev => ({ 
        ...prev, 
        characters: prev.characters.map(c => c.id === id ? { ...c, [field]: value } : c) 
      }));
    }
  }, [session, masterUpdateState]);

  const handleQuickRoll = useCallback((codename: string) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    addChatMessage({
      id: Math.random().toString(36).substr(2, 9),
      sender: codename.toUpperCase(),
      formula: '1D20 (RÁPIDO)',
      rolls: [roll],
      bonus: 0,
      total: roll,
      timestamp: new Date(),
      isCriticalSuccess: roll === 20,
      isCriticalFailure: roll === 1,
    });
  }, [addChatMessage]);

  const handleData = useCallback((data: any, conn: DataConnection) => {
    const action = data as SyncAction;
    if (session?.isMaster) {
      if (action.type === 'UPDATE_CHARACTER_FIELD') {
        updateCharacterStatus(action.characterId, action.field, action.value);
      } else if (action.type === 'CHAT_MESSAGE') {
        addChatMessage(action.payload);
      } else if (action.type === 'HEARTBEAT') {
        masterUpdateState(prev => ({
          ...prev,
          occupiedCharacters: { ...prev.occupiedCharacters, [action.characterId]: action.playerName }
        }));
      }
    } else {
      if (action.type === 'UPDATE_CAMPAIGN') {
        setActiveCampaign({
          ...action.payload,
          chatMessages: action.payload.chatMessages.map((m:any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        });
      } else if (action.type === 'TRIGGER_VISUAL') {
        setActiveEffect(action.effect);
      } else if (action.type === 'BOSS_ENTRANCE') {
        const char = activeCampaign.characters.find(c => c.id === action.characterId);
        if (char) setBossEntrance(char);
      }
    }
  }, [session, activeCampaign.characters, addChatMessage, updateCharacterStatus, masterUpdateState]);

  useEffect(() => {
    if (!session) return;
    const masterId = `temor-room-${session.roomId.toLowerCase()}-master`;
    const peer = new Peer(session.isMaster ? masterId : undefined);
    peerRef.current = peer;

    peer.on('open', () => {
      setIsConnected(true);
      if (!session.isMaster) {
        const conn = peer.connect(masterId);
        setupConnection(conn);
      }
    });

    peer.on('connection', (conn) => setupConnection(conn));

    const setupConnection = (conn: DataConnection) => {
      conn.on('open', () => {
        if (!connectionsRef.current.find(c => c.peer === conn.peer)) {
          connectionsRef.current.push(conn);
        }
        if (session.isMaster) {
          // GARANTIA: Mestre envia o estado ATUAL da campanha para quem acabou de entrar
          conn.send({ type: 'UPDATE_CAMPAIGN', payload: campaignRef.current });
        } else {
          conn.send({ type: 'HEARTBEAT', playerName: session.playerName, characterId: session.characterId });
        }
      });
      conn.on('data', (data) => handleData(data, conn));
      conn.on('close', () => {
        connectionsRef.current = connectionsRef.current.filter(c => c.peer !== conn.peer);
      });
    };

    return () => { peer.destroy(); connectionsRef.current = []; };
  }, [session, handleData]);

  if (!session) return <LandingScreen characters={activeCampaign.characters} occupied={activeCampaign.occupiedCharacters} onStart={setSession} />;

  const selectedCharacter = activeCampaign.characters.find(c => c.id === selectedCharacterId);
  const currentMap = activeCampaign.customMaps.find(m => m.id === activeCampaign.currentMapId) || activeCampaign.customMaps[0];
  const isAgent = (c: Character) => !c.isNpc || c.class === 'Agente' || c.class === 'Agente Especial';

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden relative font-inter">
      <EffectOverlay activeEffect={activeEffect} bossEntrance={bossEntrance} onEffectEnd={() => { setActiveEffect(null); setBossEntrance(null); }} />
      <header className="flex-none bg-slate-900 border-b border-temor-gold p-4 flex justify-between items-center shadow-2xl z-50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 border-2 flex items-center justify-center rounded rotate-45 ${session.isMaster ? 'bg-amber-600 border-yellow-300' : 'bg-temor-crimson border-temor-gold'}`}>
            <span className="text-white font-cinzel font-bold text-xl -rotate-45">{session.isMaster ? 'M' : 'T'}</span>
          </div>
          <div>
            <h1 className="text-lg font-cinzel font-bold tracking-widest text-temor-gold uppercase">MISSÃO: {session.roomId.toUpperCase()}</h1>
            <p className="text-[10px] uppercase text-slate-400 font-black tracking-tighter">{isConnected ? '● LINK ESTÁVEL' : '○ CONECTANDO...'} | AGENTE: {session.playerName.toUpperCase()}</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <button onClick={() => setCurrentView(AppView.Dashboard)} className={`px-4 py-1.5 rounded font-cinzel text-xs ${currentView === AppView.Dashboard ? 'bg-temor-crimson border border-temor-gold text-white' : 'bg-slate-800 text-slate-400'}`}>Dashboard</button>
            <button onClick={() => setCurrentView(AppView.Map)} className={`px-4 py-1.5 rounded font-cinzel text-xs ${currentView === AppView.Map ? 'bg-temor-crimson border border-temor-gold text-white' : 'bg-slate-800 text-slate-400'}`}>Mapa</button>
          </div>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${isChatOpen ? 'bg-temor-gold text-slate-950' : 'bg-slate-800 text-slate-400'}`}>COMMS</button>
        </nav>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {currentView === AppView.Dashboard && (
            <div className="space-y-10 pb-20">
              <section>
                <h2 className="text-sm font-cinzel font-bold text-temor-gold uppercase tracking-widest mb-6 border-l-4 border-temor-crimson pl-3">Equipe de Campo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {activeCampaign.characters.filter(c => isAgent(c) && !c.isDeleted).map(char => (
                    <CharacterCard 
                      key={char.id} character={char} 
                      isEditable={session.isMaster || session.characterId === char.id}
                      isMaster={session.isMaster}
                      isOccupiedBy={activeCampaign.occupiedCharacters[char.id]}
                      onSelect={() => { setSelectedCharacterId(char.id); setCurrentView(AppView.CharacterDetail); }}
                      onUpdateStatus={updateCharacterStatus}
                      onQuickRoll={handleQuickRoll}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-cinzel font-bold text-emerald-500 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Ameaças Ativas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {activeCampaign.characters.filter(c => !isAgent(c) && c.isActive && !c.isDeleted).map(char => (
                    <CharacterCard 
                      key={char.id} character={char} 
                      isEditable={session.isMaster} isMaster={session.isMaster}
                      onSelect={() => { setSelectedCharacterId(char.id); setCurrentView(AppView.CharacterDetail); }}
                      onUpdateStatus={updateCharacterStatus}
                      onQuickRoll={handleQuickRoll}
                    />
                  ))}
                </div>
              </section>

              {session.isMaster && (
                <section className="opacity-50 grayscale hover:grayscale-0 transition-all">
                  <h2 className="text-sm font-cinzel font-bold text-slate-500 uppercase tracking-widest mb-6 border-l-4 border-slate-700 pl-3">Reserva Operacional</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {activeCampaign.characters.filter(c => !isAgent(c) && !c.isActive && !c.isDeleted).map(char => (
                      <CharacterCard key={char.id} character={char} isEditable={true} isMaster={true} onSelect={() => {}} onUpdateStatus={updateCharacterStatus} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          {currentView === AppView.Map && <MapView currentMap={currentMap} allMaps={activeCampaign.customMaps} isMaster={session.isMaster} onSelectMap={(id) => updateCharacterStatus('global', 'currentMapId', id)} />}
          {currentView === AppView.CharacterDetail && selectedCharacter && (
            <CharacterDetail 
              character={selectedCharacter} 
              isEditable={session.isMaster || session.characterId === selectedCharacter.id}
              isMaster={session.isMaster}
              onBack={() => setCurrentView(AppView.Dashboard)} 
              onUpdateStatus={updateCharacterStatus} 
            />
          )}
        </main>
        {isChatOpen && <aside className="w-80 flex-none border-l border-slate-800 bg-slate-950/50"><DiceChat currentUsername={session.playerName} messages={activeCampaign.chatMessages} onSendMessage={addChatMessage} /></aside>}
      </div>
      {session.isMaster && (
        <MasterPanel 
          activeCampaign={activeCampaign} 
          onAddNpc={(npc) => masterUpdateState(p => ({...p, characters: [...p.characters, npc]}))} 
          onAddMap={(map) => masterUpdateState(p => ({...p, customMaps: [...p.customMaps, map]}))} 
          onImportCampaign={(c) => { setActiveCampaign(c); broadcast({type: 'UPDATE_CAMPAIGN', payload: c}); }} 
          onTriggerFX={(effect) => { setActiveEffect(effect); broadcast({type: 'TRIGGER_VISUAL', effect}); }}
        />
      )}
    </div>
  );
};

export default App;
