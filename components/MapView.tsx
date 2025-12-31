
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
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-temor-gold tracking-widest uppercase">{currentMap.name}</h2>
          <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">{currentMap.description}</p>
        </div>
        {isMaster && (
          <div className="flex flex-col items-end gap-2">
            <span className="text-[9px] font-bold text-temor-gold uppercase tracking-widest">Painel do Mestre</span>
            <div className="flex gap-2">
              {allMaps.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMap(m.id)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${currentMap.id === m.id ? 'bg-temor-crimson border-temor-gold border text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative aspect-video w-full border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-900 group">
        <img 
          src={currentMap.url} 
          alt={currentMap.name} 
          className="w-full h-full object-cover grayscale-[0.3] brightness-75 group-hover:brightness-90 transition-all duration-700"
        />
        <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-950/20" />
        
        {/* Animated indicators based on map */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-temor-crimson rounded-full animate-ping" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-temor-crimson rounded-full border border-white" />

        <div className="absolute bottom-8 right-8 bg-slate-950/80 p-4 border border-temor-gold/50 rounded backdrop-blur-sm max-w-xs">
          <h3 className="text-sm font-cinzel font-bold text-temor-gold mb-1 tracking-widest">STATUS DA REGIÃO</h3>
          <p className="text-[10px] text-slate-300 uppercase leading-relaxed font-mono">
            {currentMap.description}
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-temor-gold opacity-50">LOCAL: {currentMap.name.toUpperCase()}</div>
          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-temor-gold opacity-50">MODO: {isMaster ? 'DIRETOR' : 'OPERACIONAL'}</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
