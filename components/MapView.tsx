
import React from 'react';
import { MapData } from '../types';

interface MapViewProps {
  currentMap: MapData;
  allMaps: MapData[];
  isMaster: boolean;
  onSelectMap: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ currentMap, allMaps, isMaster, onSelectMap }) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-temor-gold" />
            <div>
              <h2 className="text-3xl font-cinzel font-bold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {currentMap.name}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">COORDENADAS DE MISSÃO ATIVAS</p>
            </div>
          </div>
        </div>
        
        {isMaster && (
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col gap-2 min-w-[200px]">
            <span className="text-[9px] font-bold text-temor-gold uppercase tracking-[0.2em] mb-1">Seletor Tático</span>
            <div className="flex gap-2 flex-wrap max-w-md">
              {allMaps.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMap(m.id)}
                  className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all border ${
                    currentMap.id === m.id 
                    ? 'bg-temor-crimson border-temor-gold text-white shadow-[0_0_10px_rgba(127,29,29,0.5)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative w-full border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 group">
        <img 
          src={currentMap.url} 
          alt={currentMap.name} 
          className="w-full aspect-video object-cover grayscale-[0.2] brightness-75 group-hover:brightness-100 transition-all duration-1000 transform group-hover:scale-[1.02]"
        />
        
        {/* Overlay de HUD */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-950/80 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950/90 to-transparent" />
          
          {/* Scanlines effect */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        </div>
        
        {/* Ponto de Interesse Animado */}
        <div className="absolute top-1/3 left-1/4">
          <div className="w-6 h-6 bg-temor-crimson/20 rounded-full animate-ping absolute -inset-1" />
          <div className="w-4 h-4 bg-temor-crimson rounded-full border-2 border-white/50 shadow-lg" />
          <div className="ml-6 -mt-2 bg-slate-950/80 px-2 py-1 border border-temor-gold/30 rounded text-[8px] text-temor-gold font-bold uppercase tracking-widest whitespace-nowrap">
            Alvo Confirmado
          </div>
        </div>

        <div className="absolute bottom-8 left-8 max-w-md">
          <div className="bg-slate-950/90 p-5 border-l-4 border-temor-gold rounded shadow-2xl backdrop-blur-md">
            <h3 className="text-xs font-cinzel font-bold text-temor-gold mb-2 tracking-[0.2em]">SITREP / BRIEFING</h3>
            <p className="text-[11px] text-slate-300 uppercase leading-relaxed font-mono">
              {currentMap.description}
            </p>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex flex-col items-end gap-1 opacity-60">
          <div className="text-[10px] font-mono text-temor-gold font-bold">LINK: ÔMEGA-STRATOS</div>
          <div className="text-[9px] font-mono text-slate-400">STATUS: TRANSMISSÃO ENCRIPTADA</div>
          <div className="flex gap-1 mt-2">
            <div className="w-1 h-3 bg-emerald-500 animate-pulse" />
            <div className="w-1 h-3 bg-emerald-500 animate-pulse delay-75" />
            <div className="w-1 h-3 bg-emerald-500 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
