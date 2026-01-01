
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

export interface VestuarioItem {
  id: string;
  name: string;
  weight: number;
}

export interface Skills {
  atletismo: number;
  conhecimento: number;
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
  vestuarioItems: VestuarioItem[];
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
  currentNpcLayer: number;
  customMaps: MapData[];
  occupiedCharacters: Record<string, string>;
  createdAt: number;
  lastPlayed: number;
  masterIsOnline: boolean;
}

export type VisualEffectType = 'BLOOD_SPLASH' | 'DANGER_ALARM' | 'SANITY_BLUR' | 'BLACKOUT' | 'HEAL_GLOW';

export type SyncAction = 
  | { type: 'UPDATE_CAMPAIGN', payload: Campaign }
  | { type: 'CHAT_MESSAGE', payload: ChatMessage }
  | { type: 'HEARTBEAT', playerName: string, characterId: string }
  | { type: 'UPDATE_CHARACTER_FIELD', characterId: string, field: string, value: any }
  | { type: 'CHANGE_MAP', mapId: string }
  | { type: 'TRIGGER_VISUAL', effect: VisualEffectType }
  | { type: 'BOSS_ENTRANCE', characterId: string }
  | { type: 'BOSS_ENT_BY_ADD', payload: Character }
  | { type: 'MASTER_PONG' };
