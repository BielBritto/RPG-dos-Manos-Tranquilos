
export enum Attribute {
  Forca = "Força",
  Inteligencia = "Inteligência",
  Resistencia = "Resistência",
  Destreza = "Destreza",
  Carisma = "Carisma",
  Sabedoria = "Sabedoria"
}

export interface InventoryItem {
  id: string;
  name: string;
  slots: number;
  damage?: string;
  description?: string;
}

// Added VestuarioItem interface
export interface VestuarioItem {
  id: string;
  name: string;
  weight: number;
}

export interface Skills {
  atletismo: number;
  conhecimento: number; // Changed from conocimiento to conhecimento
  intuicao: number;
  acrobacia: number;
  furtividade: number;
  agilidade: number;
  percepcao: number;
  investigacao: number;
  animais: number;
  atuacao: number;
  diplomacia: number;
  intimidacao: number;
  medicina: number;
  magia: number;
}

export interface Character {
  id: string;
  name: string;
  codename: string;
  race: string;
  age: number | string;
  class: string; 
  appearance: string;
  history: string;
  talents: string;
  faults: string;
  personality: string;
  attributes: Record<Attribute, number>;
  skills: Skills;
  maxVida: number;
  currentVida: number;
  maxSanidade: number;
  currentSanidade: number;
  maxEnergia: number;
  currentEnergia: number;
  imageUrl: string;
  inventoryItems: InventoryItem[];
  vestuarioItems: VestuarioItem[]; // Changed from any[] to VestuarioItem[]
  armas: string;
  armadura: string;
  isNpc?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  statusConfig?: {
    showAttributes: boolean;
    showVida: boolean;
    showSanidade: boolean;
    showEnergia: boolean;
  };
}

export enum AppView {
  Dashboard = "DASHBOARD",
  Map = "MAP",
  CharacterDetail = "CHARACTER_DETAIL"
}

export interface ChatMessage {
  id: string;
  sender: string;
  formula: string;
  rolls: number[];
  bonus: number;
  total: number;
  timestamp: Date;
  isCriticalSuccess?: boolean;
  isCriticalFailure?: boolean;
}

export interface PlayerSession {
  playerName: string;
  characterId: string;
  isMaster: boolean;
  roomId: string;
}

export interface MapData {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  roomId: string;
  characters: Character[];
  chatMessages: ChatMessage[];
  currentMapId: string;
  customMaps: MapData[];
  occupiedCharacters: Record<string, string>;
  createdAt: number;
}

export type VisualEffectType = 'BLOOD_SPLASH' | 'DANGER_ALARM' | 'SANITY_BLUR' | 'HEAL_GLOW';

export type SyncAction = 
  | { type: 'UPDATE_CAMPAIGN', payload: Campaign }
  | { type: 'CHAT_MESSAGE', payload: ChatMessage }
  | { type: 'HEARTBEAT', playerName: string, characterId: string }
  | { type: 'UPDATE_FIELD', targetId: string, field: string, value: any }
  | { type: 'TRIGGER_VISUAL', effect: VisualEffectType }
  | { type: 'BOSS_ENTRANCE', characterId: string };
