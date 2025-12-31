
import React, { useState } from 'react';
import { Character, PlayerSession } from '../types';

interface LandingScreenProps {
  characters: Character[];
  onStart: (session: PlayerSession) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ characters, onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  const handleStart = () => {
    if (playerName.trim() && (selectedCharId || isMaster)) {
      onStart({ 
        playerName, 
        characterId: isMaster ? 'master' : selectedCharId!, 
        isMaster 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-temor-crimson rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full bg-slate-900 border border-temor-gold/30 rounded-2xl shadow-2xl p-8 relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-temor-crimson border-2 border-temor-gold flex items-center justify-center rounded-sm rotate-45 mx-auto mb-6">
            <span className="text-temor-gold font-cinzel font-bold text-3xl -rotate-45">T</span>
          </div>
          <h1 className="text-4xl font-cinzel font-bold tracking-[0.3em] text-temor-gold mb-2">TEMOR</h1>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500 font-bold">Terminal de Gerenciamento Ômega</p>
        </div>

        <div className="space-y-6">
          <div className="max-w-md mx-auto">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Identificação do Operador</label>
            <input 
              type="text" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-temor-gold rounded-lg px-4 py-3 text-slate-200 outline-none transition-all"
            />
          </div>

          <div className="flex justify-center gap-4 py-2">
            <button 
              onClick={() => setIsMaster(false)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${!isMaster ? 'bg-temor-crimson border-temor-gold text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
            >
              Jogador
            </button>
            <button 
              onClick={() => setIsMaster(true)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${isMaster ? 'bg-amber-600 border-temor-gold text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
            >
              Mestre (GM)
            </button>
          </div>

          {!isMaster ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Selecione seu Personagem</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {characters.filter(c => !c.isNpc).map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharId(char.id)}
                    className={`relative group overflow-hidden rounded-xl border-2 transition-all h-32 ${
                      selectedCharId === char.id 
                      ? 'border-temor-gold shadow-[0_0_20px_rgba(161,98,7,0.3)]' 
                      : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={char.imageUrl} alt={char.codename} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-left">
                      <p className="text-[10px] text-temor-gold font-bold uppercase tracking-tighter">{char.codename}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
              <p className="text-sm text-slate-400 font-cinzel italic">
                "O mestre possui autoridade total sobre o mapa, clima e destino de todos os agentes."
              </p>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={!playerName.trim() || (!isMaster && !selectedCharId)}
            className={`w-full py-4 rounded-lg font-cinzel font-bold tracking-[0.2em] transition-all ${
              playerName.trim() && (isMaster || selectedCharId)
              ? 'bg-temor-crimson text-white hover:bg-red-800 shadow-xl border border-temor-gold' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            INICIAR OPERAÇÃO
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
