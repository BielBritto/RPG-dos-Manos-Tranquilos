
export enum Attribute {
  Forca = "Força",
  Inteligencia = "Inteligência",
  Resistencia = "Resistência",
  Destreza = "Destreza",
  Carisma = "Carisma",
  Sabedoria = "Sabedoria"
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
  age: number;
  class: string;
  appearance: string;
  attributes: Record<Attribute, number>;
  skills: Skills;
  maxVida: number;
  currentVida: number;
  maxSanidade: number;
  currentSanidade: number;
  maxEnergia: number;
  currentEnergia: number;
  imageUrl: string;
  inventory: string[];
  armas: string;
  armadura: string;
  defesaExtra: number;
  isNpc?: boolean;
  useVida?: boolean;
  useSanidade?: boolean;
  useEnergia?: boolean;
}

export enum AppView {
  Dashboard = "DASHBOARD",
  Map = "MAP",
  CharacterDetail = "CHARACTER_DETAIL",
  Campaigns = "CAMPAIGNS"
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
  createdAt: number;
  lastPlayed: number;
  characters: Character[];
  chatMessages: ChatMessage[];
  currentMapId: string;
}
