
import { Character, Attribute, MapData } from './types';

/**
 * GUIA PARA INSERIR FOTOS DOS PERSONAGENS:
 * 
 * 1. Links da Internet: Copie o link da imagem (ex: https://site.com/foto.jpg) e cole no campo 'imageUrl'.
 * 2. Imagens Locais: Se as fotos estiverem na mesma pasta deste código, use './nome-da-foto.png'.
 * 3. Mestre (GM): O mestre pode inserir links de fotos diretamente no painel de criação de NPC dentro do app.
 * 
 * Abaixo estão os personagens iniciais do sistema TEMOR.
 */

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: "dario",
    name: "Dario Severus",
    codename: "Sentinela",
    race: "Humano",
    age: 28,
    class: "Centurião",
    appearance: "Homem alto, negro, robusto, estilo militar, cicatrizes de esforço.",
    attributes: {
      [Attribute.Forca]: 2,
      [Attribute.Inteligencia]: 1,
      [Attribute.Resistencia]: 2,
      [Attribute.Destreza]: 0,
      [Attribute.Carisma]: 0,
      [Attribute.Sabedoria]: 0
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0,
      agilidade: 0, percepcao: 1, investigacao: 1, animais: 0, atuacao: 0,
      diplomacia: 0, intimidacao: 1, medicina: 0, magia: 0
    },
    maxVida: 12, currentVida: 12,
    maxSanidade: 7, currentSanidade: 7,
    maxEnergia: 8, currentEnergia: 8,
    imageUrl: "https://picsum.photos/seed/dario/400/500", // <--- INSERIR FOTO DO DARIO AQUI
    inventory: ["Escudo Tático", "Espada Longa Românica"],
    armas: "Espada Longa (Dano 5)",
    armadura: "Centurião Românico (+3 Defesa)",
    defesaExtra: 3
  },
  {
    id: "pierre",
    name: "Pierre Fontana",
    codename: "Falcão",
    race: "Humano",
    age: 26,
    class: "Arqueiro/Ranger",
    appearance: "Homem médio, claro, magro definido, olhos verdes, barba rala.",
    attributes: {
      [Attribute.Forca]: 0,
      [Attribute.Inteligencia]: 1,
      [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 2,
      [Attribute.Carisma]: 1,
      [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 0, conhecimento: 1, intuicao: 0, acrobacia: 1, furtividade: 0,
      agilidade: 0, percepcao: 0, investigacao: 0, animais: 1, atuacao: 1,
      diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
    },
    maxVida: 10, currentVida: 10,
    maxSanidade: 6, currentSanidade: 6,
    maxEnergia: 8, currentEnergia: 8,
    imageUrl: "https://picsum.photos/seed/pierre/400/500", // <--- INSERIR FOTO DO PIERRE AQUI
    inventory: ["Arco de Caça", "Lança Românica", "12 flechas"],
    armas: "Arco de Caça (Dano 3), Lança (Dano 4)",
    armadura: "Malha Românica (+1 Defesa)",
    defesaExtra: 1
  },
  {
    id: "kael",
    name: "Kael",
    codename: "Oráculo",
    race: "Humano",
    age: 0,
    class: "Mago",
    appearance: "Olhos carmesins, cabelos negros, bigode e cavanhaque discretos.",
    attributes: {
      [Attribute.Forca]: 0,
      [Attribute.Inteligencia]: 1,
      [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 1,
      [Attribute.Carisma]: 1,
      [Attribute.Sabedoria]: 2
    },
    skills: {
      atletismo: 0, conhecimento: 1, intuicao: 0, acrobacia: 0, furtividade: 0,
      agilidade: 0, percepcao: 1, investigacao: 0, animais: 0, atuacao: 0,
      diplomacia: 1, intimidacao: 0, medicina: 0, magia: 1
    },
    maxVida: 10, currentVida: 10,
    maxSanidade: 9, currentSanidade: 9,
    maxEnergia: 8, currentEnergia: 8,
    imageUrl: "https://picsum.photos/seed/kael/400/500", // <--- INSERIR FOTO DO KAEL AQUI
    inventory: ["Manto Mágico", "Selos de Mão"],
    armas: "Bola de Fogo (+3), Rajada de Vento (+2)",
    armadura: "Manto Mágico (+1 Defesa)",
    defesaExtra: 1
  },
  {
    id: "talia",
    name: "Talia Crane",
    codename: "Fantasma",
    race: "Humana",
    age: 22,
    class: "Especialista",
    appearance: "Pele oliva, cicatriz no rosto, traços árabes.",
    attributes: {
      [Attribute.Forca]: 0,
      [Attribute.Inteligencia]: 2,
      [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 2,
      [Attribute.Carisma]: 0,
      [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 1,
      agilidade: 0, percepcao: 1, investigacao: 1, animais: 0, atuacao: 0,
      diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
    },
    maxVida: 10, currentVida: 10,
    maxSanidade: 8, currentSanidade: 8,
    maxEnergia: 7, currentEnergia: 7,
    imageUrl: "https://picsum.photos/seed/talia/400/500", // <--- INSERIR FOTO DA TALIA AQUI
    inventory: ["Adaga Românica", "Lâminas Ocultas (10)"],
    armas: "Adaga (+4), Lâminas (+3)",
    armadura: "Véu Românico (+1 Defesa)",
    defesaExtra: 1
  },
  {
    id: "gunnar",
    name: "Gunnar Bergson",
    codename: "Urso",
    race: "Humano",
    age: 29,
    class: "Berserker",
    appearance: "Grande, musculoso, pele branca, escritas rúnicas.",
    attributes: {
      [Attribute.Forca]: 2,
      [Attribute.Inteligencia]: 0,
      [Attribute.Resistencia]: 1,
      [Attribute.Destreza]: 1,
      [Attribute.Carisma]: 0,
      [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 1, acrobacia: 0, furtividade: 0,
      agilidade: 0, percepcao: 0, investigacao: 0, animais: 1, atuacao: 0,
      diplomacia: 0, intimidacao: 1, medicina: 0, magia: 0
    },
    maxVida: 11, currentVida: 11,
    maxSanidade: 8, currentSanidade: 8,
    maxEnergia: 8, currentEnergia: 8,
    imageUrl: "https://picsum.photos/seed/gunnar/400/500", // <--- INSERIR FOTO DO GUNNAR AQUI
    inventory: ["Machado Estrangeiro"],
    armas: "Machado (+4)",
    armadura: "Manta de Couro Românica (+2 Defesa)",
    defesaExtra: 2
  }
];

export const INITIAL_MAPS: MapData[] = [
  {
    id: "vila",
    name: "Vila de Runa",
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000",
    description: "Infiltração silenciosa necessária. Vlad identificado como contato local."
  },
  {
    id: "floresta",
    name: "Floresta Proibida",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000",
    description: "Zona de densa vegetação. Criaturas desconhecidas avistadas por drones."
  },
  {
    id: "caverna",
    name: "Cavernas de Ômega",
    url: "https://images.unsplash.com/photo-1509023467864-1ecbb3f6354b?auto=format&fit=crop&q=80&w=2000",
    description: "Ambiente fechado com baixa visibilidade. Risco de desmoronamento alto."
  }
];
