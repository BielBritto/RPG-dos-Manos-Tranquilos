
import React, { useEffect, useState, useRef } from 'react';
import { VisualEffectType, Character } from '../types';

interface EffectOverlayProps {
  activeEffect: VisualEffectType | null;
  bossEntrance: Character | null;
  onEffectEnd: () => void;
}

// SFX - Mapeamento de sons cinematográficos
const SFX = {
  BLOOD: 'https://assets.mixkit.co/sfx/preview/mixkit-Splat-sound-effect-1051.mp3',
  ALARM: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-classic-door-bell-sound-113.mp3',
  HORROR: 'https://assets.mixkit.co/sfx/preview/mixkit-horror-low-rumble-drone-2503.mp3',
  BOSS: 'https://assets.mixkit.co/sfx/preview/mixkit-scary-monster-roar-197.mp3',
  HEAL: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-sound-effect-2453.mp3'
};

const EffectOverlay: React.FC<EffectOverlayProps> = ({ activeEffect, bossEntrance, onEffectEnd }) => {
  const [displayBoss, setDisplayBoss] = useState<Character | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio feedback inhibited", e));
    }
  };

  useEffect(() => {
    if (activeEffect) {
      if (activeEffect === 'BLOOD_SPLASH') playSound(SFX.BLOOD);
      else if (activeEffect === 'DANGER_ALARM') playSound(SFX.ALARM);
      else if (activeEffect === 'SANITY_BLUR') playSound(SFX.HORROR);
      else if (activeEffect === 'HEAL_GLOW') playSound(SFX.HEAL);

      const timer = setTimeout(() => {
        onEffectEnd();
      }, 1500); // Reduzido de 3000 para 1500
      return () => clearTimeout(timer);
    }
  }, [activeEffect, onEffectEnd]);

  useEffect(() => {
    if (bossEntrance) {
      setDisplayBoss(bossEntrance);
      playSound(SFX.BOSS);
      const timer = setTimeout(() => {
        setDisplayBoss(null);
        onEffectEnd();
      }, 2500); // Reduzido de 5000 para 2500
      return () => clearTimeout(timer);
    }
  }, [bossEntrance, onEffectEnd]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <audio ref={audioRef} />

      {activeEffect === 'BLOOD_SPLASH' && (
        <div className="absolute inset-0 bg-red-900/40 animate-pulse border-[30px] border-red-600 shadow-[inset_0_0_80px_rgba(255,0,0,0.8)]" />
      )}

      {activeEffect === 'DANGER_ALARM' && (
        <div className="absolute inset-0 bg-yellow-500/10 animate-ping border-[15px] border-yellow-500/40" />
      )}

      {activeEffect === 'SANITY_BLUR' && (
        <div className="absolute inset-0 backdrop-blur-lg bg-purple-950/20 grayscale animate-pulse" />
      )}

      {activeEffect === 'HEAL_GLOW' && (
        <div className="absolute inset-0 bg-emerald-500/10 shadow-[inset_0_0_120px_rgba(16,185,129,0.2)] animate-pulse" />
      )}

      {displayBoss && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-fadeIn pointer-events-auto">
          <div className="relative text-center transform transition-transform duration-500 scale-110">
            <div className="absolute -inset-10 bg-temor-gold/20 blur-[80px] rounded-full" />
            <div className="relative p-1 bg-temor-gold/50 rounded-xl shadow-2xl">
              <img src={displayBoss.imageUrl} className="w-[300px] md:w-[350px] aspect-[2/3] object-cover object-top rounded-lg shadow-inner" alt="BOSS" />
            </div>
            <h2 className="text-5xl font-cinzel font-black text-temor-gold uppercase tracking-[0.3em] drop-shadow-2xl mt-6 animate-pulse">
              {displayBoss.codename}
            </h2>
            <p className="text-temor-crimson text-xl font-bold uppercase tracking-widest mt-2">{displayBoss.class}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectOverlay;
