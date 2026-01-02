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

const STORAGE_KEY = 'temor_omega_v9';

const App: React.FC = () => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        return { 
          ...p, 
          chatMessages: (p.chatMessages || []).map((m: any) => ({ 
            ...m, 
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date() 
          })) 
        };
      }
    } catch (e) {
      console.error("Erro ao carregar campanha:", e);
    }
    return {
      id: 'main', name: 'Operação Ômega', roomId: '',
      characters: INITIAL_CHARACTERS.map(c => ({ ...c, isActive: true })),
      chatMessages: [], currentMapId: INITIAL_MAPS[0].id,
      customMaps: INITIAL_MAPS, occupiedCharacters: {}, createdAt: Date.now()
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

  useEffect(() => {
    campaignRef.current = activeCampaign;
    if (session?.isMaster) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeCampaign));
    }
  }, [activeCampaign, session]);

  const broadcast = useCallback((action: SyncAction) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) conn.send(action);
    });
  }, []);

  const updateCharacterStatus = useCallback((id: string, field: string, value: any) => {
    const current = campaignRef.current;
    let next: Campaign;

    if (id === 'global') {
      next = { ...current, [field]: value };
    } else {
      next = {
        ...current,
        characters: (current.characters || []).map(c => c.id === id ? { ...c, [field]: value } : c)
      };
    }

    setActiveCampaign(next);

    if (session?.isMaster) {
      broadcast({ type: 'UPDATE_CAMPAIGN', payload: next });
    } else {
      const masterConn = connectionsRef.current.find(c => c.peer.includes('master'));
      if (masterConn?.open) {
        masterConn.send({ type: 'UPDATE_FIELD', targetId: id, field, value });
      }
    }
  }, [session, broadcast]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    const nextCampaign = { 
      ...campaignRef.current, 
      chatMessages: [...(campaignRef.current.chatMessages || []), msg] 
    };
    setActiveCampaign(nextCampaign);
    
    if (session?.isMaster) {
      broadcast({ type: 'UPDATE_CAMPAIGN', payload: nextCampaign });
    } else {
      const masterConn = connectionsRef.current.find(c => c.peer.includes('master'));
      if (masterConn?.open) masterConn.send({ type: 'CHAT_MESSAGE', payload: msg });
    }
  }, [session, broadcast]);

  const handleData = useCallback((data: any) => {
    const action = data as SyncAction;
    if (session?.isMaster) {
      if (action.type === 'UPDATE_FIELD') {
        updateCharacterStatus(action.targetId, action.field, action.value);
      } else if (action.type === 'CHAT_MESSAGE') {
        addChatMessage(action.payload);
      } else if (action.type === 'HEARTBEAT') {
        setActiveCampaign(prev => ({
          ...prev,
          occupiedCharacters: { ...prev.occupiedCharacters, [action.characterId]: action.playerName }
        }));
      }
    } else {
      if (action.type === 'UPDATE_CAMPAIGN') {
        const payload = action.payload;
        setActiveCampaign({
          ...payload,
          chatMessages: (payload.chatMessages || []).map((m: any) => ({ 
            ...m, 
            timestamp: new Date(m.timestamp) 
          }))
        });
      } else if (action.type === 'TRIGGER_VISUAL') {
        setActiveEffect(action.effect);
      } else if (action.type === 'BOSS_ENTRANCE') {
        const boss = campaignRef.current.characters.find(c => c.id === action.characterId);
        if (boss) setBossEntrance(boss);
      }
    }
  }, [session, updateCharacterStatus, addChatMessage]);

  useEffect(() => {
    if (!session) return;
    const masterId = `temor-omega-${session.roomId.toLowerCase()}-master`;
    const peer = new Peer(session.isMaster ? masterId : undefined);
    peerRef.current = peer;

    peer.on('open', () => {
      setIsConnected(true);
      if (!session.isMaster) {
        const conn = peer.connect(masterId);
        setupConn(conn);
      }
    });

    peer.on('connection', (conn) => setupConn(conn));

    function setupConn(conn: DataConnection) {
      conn.on('open', () => {
        if (!connectionsRef.current.find(c => c.peer === conn.peer)) {
          connectionsRef.current.push(conn);
        }
        if (session?.isMaster) {
          conn.send({ type: 'UPDATE_CAMPAIGN', payload: campaignRef.current });
        } else {
          conn.send({ type: 'HEARTBEAT', playerName: session!.playerName, characterId: session!.characterId });
        }
      });
      conn.on('data', handleData);
    }

    return () => { peer.destroy(); connectionsRef.current = []; };
  }, [session, handleData]);

  if (!session) return <LandingScreen characters={activeCampaign.characters} occupied={activeCampaign.occupiedCharacters} onStart={setSession} />;

  const currentMap = activeCampaign.customMaps.find(m => m.id === activeCampaign.currentMapId) || INITIAL_MAPS[0];

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-inter animate-fadeIn">
      <EffectOverlay activeEffect={activeEffect} bossEntrance={bossEntrance} onEffectEnd={() => { setActiveEffect(null); setBossEntrance(null); }} />
      
      <header className="flex-none bg-slate-900 border-b border-temor-gold p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-temor-crimson border-2 border-temor-gold flex items-center justify-center rounded rotate-45">
            <span className="text-white font-cinzel font-bold text-xl -rotate-45">Ω</span>
          </div>
          <div>
            <h1 className="text-lg font-cinzel font-bold text-temor-gold uppercase tracking-tighter">SISTEMA ÔMEGA: {session.roomId}</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black">{isConnected ? 'LINK ESTÁVEL' : 'OFFLINE'} | {session.playerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView(AppView.Dashboard)} className={`px-4 py-1 rounded font-cinzel text-xs transition-all ${currentView === AppView.Dashboard ? 'bg-temor-crimson text-white' : 'bg-slate-800 text-slate-400'}`}>Painel</button>
          <button onClick={() => setCurrentView(AppView.Map)} className={`px-4 py-1 rounded font-cinzel text-xs transition-all ${currentView === AppView.Map ? 'bg-temor-crimson text-white' : 'bg-slate-800 text-slate-400'}`}>Mapa</button>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-slate-800 px-3 py-1 rounded text-[10px] font-bold">COMMS</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {currentView === AppView.Dashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
              {activeCampaign.characters.filter(c => !c.isDeleted && (c.isActive || session.isMaster)).map(char => (
                <CharacterCard 
                  key={char.id} character={char} 
                  isEditable={session.isMaster || session.characterId === char.id}
                  isMaster={session.isMaster}
                  isOccupiedBy={activeCampaign.occupiedCharacters[char.id]}
                  onSelect={() => { setSelectedCharacterId(char.id); setCurrentView(AppView.CharacterDetail); }}
                  onUpdateStatus={updateCharacterStatus}
                  onBossReveal={() => { broadcast({ type: 'BOSS_ENTRANCE', characterId: char.id }); setBossEntrance(char); }}
                />
              ))}
            </div>
          )}
          {currentView === AppView.Map && <MapView currentMap={currentMap} allMaps={activeCampaign.customMaps} isMaster={session.isMaster} onSelectMap={(id) => updateCharacterStatus('global', 'currentMapId', id)} />}
          {currentView === AppView.CharacterDetail && selectedCharacterId && (
             <CharacterDetail 
               character={activeCampaign.characters.find(c => c.id === selectedCharacterId)!}
               isEditable={session.isMaster || session.characterId === selectedCharacterId}
               isMaster={session.isMaster}
               onBack={() => setCurrentView(AppView.Dashboard)}
               onUpdateStatus={updateCharacterStatus}
             />
          )}
        </main>
        {isChatOpen && <aside className="w-80 border-l border-slate-800 bg-slate-950/50"><DiceChat currentUsername={session.playerName} messages={activeCampaign.chatMessages} onSendMessage={addChatMessage} /></aside>}
      </div>

      {session.isMaster && (
        <MasterPanel 
          activeCampaign={activeCampaign} 
          onAddNpc={(npc) => {
            const next = {...activeCampaign, characters: [...activeCampaign.characters, npc]};
            setActiveCampaign(next);
            broadcast({ type: 'UPDATE_CAMPAIGN', payload: next });
          }}
          onAddMap={(map) => {
            const next = {...activeCampaign, customMaps: [...activeCampaign.customMaps, map]};
            setActiveCampaign(next);
            broadcast({ type: 'UPDATE_CAMPAIGN', payload: next });
          }}
          onImportCampaign={(camp) => {
            setActiveCampaign(camp);
            broadcast({ type: 'UPDATE_CAMPAIGN', payload: camp });
          }}
          onTriggerFX={(effect) => { broadcast({type: 'TRIGGER_VISUAL', effect}); setActiveEffect(effect); }}
        />
      )}
    </div>
  );
};

export default App;