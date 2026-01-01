
import { Character, Attribute, MapData } from './types';
import * as Assets from './assets';

const defaultStatusConfig = { showAttributes: true, showVida: true, showSanidade: true, showEnergia: true };

// Função auxiliar para priorizar imagem base64, depois URL externa e por fim placeholder
const getImageUrl = (base64: string, fallbackUrl: string) => {
  return base64 && base64.trim() !== "" ? base64 : (fallbackUrl || Assets.PLACEHOLDER_AVATAR);
};

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: "dario",
    name: "Dario Severus",
    codename: "Sentinela",
    race: "Humano",
    age: 28,
    class: "Centurião",
    appearance: "Homem alto, negro, robusto, cabelo raspado ao estilo militar, olhos de areia, corpo repleto de cicatrizes de batalha.",
    history: "CENSURADO - Registro Militar de Elite. Ex-comandante de incursões românicas em solo estrangeiro.",
    talents: "Muito disciplinado; militar em ascensão e respeito; presença intimidadora; lealdade absoluta ao comando.",
    faults: "Fechado; inflexível; dureza excessiva; insensível.",
    personality: "Ordem acima do indivíduo (Maquiavélico); os mais fortes controlam os mais fracos; busca pela honra.",
    attributes: {
      [Attribute.Forca]: 2, [Attribute.Inteligencia]: 1, [Attribute.Resistencia]: 2,
      [Attribute.Destreza]: 0, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 0
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 0, agilidade: 0,
      percepcao: 1, investigacao: 1, animais: 0, atuacao: 0, diplomacia: 0, intimidacao: 1, medicina: 0, magia: 0
    },
    maxVida: 12, currentVida: 12, maxSanidade: 7, currentSanidade: 7, maxEnergia: 8, currentEnergia: 8,
    imageUrl: getImageUrl(Assets.DARIO_SENTINELA, "https://i.postimg.cc/85z1fMqv/Dario.png"),
    inventoryItems: [
      { id: "d1", name: "Escudo Tático", slots: 2, description: "+2 defesas passivas" },
      { id: "d2", name: "Espada Longa Românica", slots: 2, damage: "5 + FOR" }
    ],
    vestuarioItems: [],
    armas: "Escudo Tático (+2 defesas), Espada Longa Românica (dano 5)",
    armadura: "Centurião Românico (+3 defesas)",
    statusConfig: defaultStatusConfig
  },
  {
    id: "pierre",
    name: "Pierre Fontana",
    codename: "Falcão",
    race: "Humano",
    age: 26,
    class: "Arqueiro/Ranger",
    appearance: "Homem de estatura média, pele clara, magro e definido, olhos verdes acinzentados, marcas da natureza pela pele.",
    history: "CENSURADO - Sobrevivente de fronteira e guia de exploração em zonas de risco.",
    talents: "Especialista selvagem; silencioso por natureza; autossuficiente; improvisador.",
    faults: "Relaxado e despreocupado em excesso; desconfiado de autoridade; fraco em combate ou pressão.",
    personality: "Naturalista; síndrome de Robin Hood; evita conflitos.",
    attributes: {
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 1, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 2, [Attribute.Carisma]: 1, [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 0, conhecimento: 1, intuicao: 0, acrobacia: 1, furtividade: 0, agilidade: 0,
      percepcao: 0, investigacao: 0, animais: 1, atuacao: 1, diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
    },
    maxVida: 10, currentVida: 10, maxSanidade: 6, currentSanidade: 6, maxEnergia: 8, currentEnergia: 8,
    imageUrl: getImageUrl(Assets.PIERRE_FALCAO, "https://i.postimg.cc/9FmK9G7v/Pierre.png"),
    inventoryItems: [
      { id: "p1", name: "Arco de Caça", slots: 1, damage: "3 + DES" },
      { id: "p2", name: "Lança Românica", slots: 1, damage: "4 + FOR" }
    ],
    vestuarioItems: [],
    armas: "Arco de Caça (dano 3), Lança Românica (dano 4)",
    armadura: "Malha Românica (+1 defesa)",
    statusConfig: defaultStatusConfig
  },
  {
    id: "kael",
    name: "Kael",
    codename: "Oráculo",
    race: "Humano",
    age: "Desconhecida",
    class: "Mago",
    appearance: "Homem médio, pele clara, olhos carmesins escuros, bigode e cavanhaque discretos.",
    history: "CENSURADO - Arquivos de Alta Magia e Estudos Arcanos Proibidos.",
    talents: "Inteligente, perspicaz e intelectualista; versátil e adaptável; obediente e cooperativo.",
    faults: "Contrário ao uso de armas; baixa stamina.",
    personality: "Profundo estudioso; um verdadeiro camaleão; passividade ética e moral.",
    attributes: {
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 1, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 1, [Attribute.Carisma]: 1, [Attribute.Sabedoria]: 2
    },
    skills: {
      atletismo: 0, conhecimento: 1, intuicao: 0, acrobacia: 0, furtividade: 0, agilidade: 0,
      percepcao: 1, investigacao: 0, animais: 0, atuacao: 0, diplomacia: 1, intimidacao: 0, medicina: 0, magia: 1
    },
    maxVida: 10, currentVida: 10, maxSanidade: 9, currentSanidade: 9, maxEnergia: 8, currentEnergia: 8,
    imageUrl: getImageUrl(Assets.KAEL_ORACULO, "https://i.postimg.cc/8C7mJd0L/Kael.png"),
    inventoryItems: [],
    vestuarioItems: [],
    armas: "Selos de Mão (Fogo +3, Vento +2)",
    armadura: "Manto Mágico (+1 defesa)",
    statusConfig: defaultStatusConfig
  },
  {
    id: "talia",
    name: "Talia Crane",
    codename: "Fantasma",
    race: "Humana",
    age: 22,
    class: "Especialista",
    appearance: "Jovem mulher, estatura média, pele oliva quente, olhos castanhos, cicatriz marcante no rosto.",
    history: "CENSURADO - Ex-agente de Operações Negras e infiltração urbana.",
    talents: "Imperceptível em ação; reflexos anormais; frieza absoluta; subordinação.",
    faults: "Desconfiança com parceiros; sádica, cruel e sórdida; imprevisível.",
    personality: "Observadora, isolada, traumas - deseja manter controle sobre a própria existência.",
    attributes: {
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 2, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 2, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 0, acrobacia: 0, furtividade: 1, agilidade: 0,
      percepcao: 1, investigacao: 1, animais: 0, atuacao: 0, diplomacia: 0, intimidacao: 0, medicina: 0, magia: 0
    },
    maxVida: 10, currentVida: 10, maxSanidade: 8, currentSanidade: 8, maxEnergia: 7, currentEnergia: 7,
    imageUrl: getImageUrl(Assets.TALIA_FANTASMA, "https://i.postimg.cc/mD3BvBny/Talia.png"),
    inventoryItems: [
      { id: "t1", name: "Adaga Românica", slots: 1, damage: "4 + DES" },
      { id: "t2", name: "Lâminas Ocultas", slots: 1, damage: "3 + DES" }
    ],
    vestuarioItems: [],
    armas: "Adaga Românica (+4), Lâminas Ocultas (+3)",
    armadura: "Véu Românico (+1 defesa)",
    statusConfig: defaultStatusConfig
  },
  {
    id: "eli",
    name: "Eli Weiss",
    codename: "Sup",
    race: "Humano",
    age: 33,
    class: "Curandeiro",
    appearance: "Homem de meia-idade, estatura média, pele clara, olhos de mel, sem cicatrizes físicas.",
    history: "CENSURADO - Registro Médico de Campanha e apoio humanitário.",
    talents: "Precisão clínica; estabilidade e experiência; disciplina e calma; autocontrole.",
    faults: "Inutilidade completa em combate; pacifista; apego emocional.",
    personality: "Salvar um é salvar todos; pensamento altruísta.",
    attributes: {
      [Attribute.Forca]: 0, [Attribute.Inteligencia]: 2, [Attribute.Resistencia]: 0,
      [Attribute.Destreza]: 0, [Attribute.Carisma]: 1, [Attribute.Sabedoria]: 2
    },
    skills: {
      atletismo: 0, conhecimento: 1, intuicao: 1, acrobacia: 0, furtividade: 0, agilidade: 0,
      percepcao: 0, investigacao: 0, animais: 0, atuacao: 0, diplomacia: 1, intimidacao: 0, medicina: 1, magia: 0
    },
    maxVida: 10, currentVida: 10, maxSanidade: 9, currentSanidade: 9, maxEnergia: 8, currentEnergia: 8,
    imageUrl: getImageUrl(Assets.ELI_SUP, "https://i.postimg.cc/WpgnswmP/Eli.png"),
    inventoryItems: [
      { id: "e1", name: "Cajado Vital", slots: 1, damage: "1" }
    ],
    vestuarioItems: [],
    armas: "Cajado Vital (+1 dano)",
    armadura: "Túnica Românica (+1 defesa)",
    statusConfig: defaultStatusConfig
  },
  {
    id: "gunnar",
    name: "Gunnar Bergson",
    codename: "Urso",
    race: "Humano",
    age: 29,
    class: "Berserker",
    appearance: "Homem grande, musculoso e robusto, pele branca, olhos negros, corpo coberto rúnicas.",
    history: "CENSURADO - Forasteiro exilado das Terras do Norte.",
    talents: "Força descomunal; controlado; cultural.",
    faults: "Ingenuidade; alienado; confuso.",
    personality: "Fazer o certo é o certo; oprimido; forasteiro perdido.",
    attributes: {
      [Attribute.Forca]: 2, [Attribute.Inteligencia]: 0, [Attribute.Resistencia]: 1,
      [Attribute.Destreza]: 1, [Attribute.Carisma]: 0, [Attribute.Sabedoria]: 1
    },
    skills: {
      atletismo: 1, conhecimento: 0, intuicao: 1, acrobacia: 0, furtividade: 0, agilidade: 0,
      percepcao: 0, investigacao: 0, animais: 1, atuacao: 0, diplomacia: 0, intimidacao: 1, medicina: 0, magia: 0
    },
    maxVida: 11, currentVida: 11, maxSanidade: 8, currentSanidade: 8, maxEnergia: 8, currentEnergia: 8,
    imageUrl: getImageUrl(Assets.GUNNAR_URSO, "https://i.postimg.cc/0j7Y60M0/Gunnar.png"),
    inventoryItems: [
      { id: "g1", name: "Machado Estrangeiro", slots: 2, damage: "4 + FOR" }
    ],
    vestuarioItems: [],
    armas: "Machado Estrangeiro (+4 danos)",
    armadura: "Manta de Couro Românica (+2 defesas)",
    statusConfig: defaultStatusConfig
  }
];

export const INITIAL_MAPS: MapData[] = [
  { id: "hq", name: "QG Ômega", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600", description: "Base de operações secreta do reino." },
  { id: "vila", name: "Vila de Runa", url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000", description: "Divisa com os Alpes Escandinavos." }
];
