
import React, { useState } from 'react';
import { Character, PlayerSession } from '../types';

interface LandingScreenProps {
  characters: Character[];
  occupied: Record<string, string>;
  onStart: (session: PlayerSession) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ characters, occupied, onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  const handleStart = () => {
    if (playerName && roomId && (isMaster || selectedCharId)) {
      onStart({ 
        playerName, 
        roomId: roomId.trim().toLowerCase(),
        characterId: isMaster ? 'master' : selectedCharId!, 
        isMaster
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 border border-temor-gold/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-temor-gold tracking-widest">TEMOR</h1>
          <p className="text-[10px] uppercase text-slate-500 font-bold mt-2 tracking-widest">Terminal de Operações Ômega</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Operador</label>
              <input 
                type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none focus:border-temor-gold text-white"
                placeholder="Identificação..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">ID da Missão (SALA)</label>
              <input 
                type="text" value={roomId} onChange={e => setRoomId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none focus:border-temor-gold text-white font-mono"
                placeholder="Ex: alfa-1"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center py-4 border-y border-slate-800">
             <button onClick={() => setIsMaster(false)} className={`px-8 py-2 rounded-full text-xs font-bold uppercase transition-all ${!isMaster ? 'bg-temor-crimson text-white' : 'bg-slate-800 text-slate-500'}`}>Agente</button>
             <button onClick={() => setIsMaster(true)} className={`px-8 py-2 rounded-full text-xs font-bold uppercase transition-all ${isMaster ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Mestre</button>
          </div>

          {!isMaster ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {characters.filter(c => !c.isNpc).map(char => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${selectedCharId === char.id ? 'border-temor-gold scale-105' : 'border-slate-800 opacity-60'}`}
                >
                  <img src={char.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[8px] font-bold uppercase truncate">
                    {char.codename}
                  </div>
                  {occupied[char.id] && <div className="absolute top-0 right-0 bg-red-600 text-[6px] px-1">USO</div>}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs italic text-slate-500 py-4">O Mestre terá controle tático total sobre a missão e visualização de todos os alvos.</p>
          )}

          <button
            onClick={handleStart}
            disabled={!playerName || !roomId || (!isMaster && !selectedCharId)}
            className="w-full py-4 bg-temor-crimson hover:bg-red-700 disabled:bg-slate-800 text-white font-cinzel font-bold tracking-[0.3em] rounded-xl transition-all shadow-lg"
          >
            INICIAR TERMINAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
