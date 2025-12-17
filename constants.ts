import { GameDefinition, GameType } from './types';
import { Crown, Diamond, Heart, Layers, Trophy } from 'lucide-react';

export const GAME_DEFINITIONS: Record<GameType, GameDefinition> = {
  [GameType.KING]: {
    type: GameType.KING,
    label: "King of Hearts",
    arabicLabel: "شيخ الكبة",
    description: "Avoid the King of Hearts.",
    icon: 'Crown',
    scoreUnit: -75,
    maxItems: 1
  },
  [GameType.QUEENS]: {
    type: GameType.QUEENS,
    label: "Queens",
    arabicLabel: "بنات",
    description: "Avoid the 4 Queens.",
    icon: 'Users',
    scoreUnit: -25,
    maxItems: 4
  },
  [GameType.DIAMONDS]: {
    type: GameType.DIAMONDS,
    label: "Diamonds",
    arabicLabel: "ديناري",
    description: "Avoid Diamond cards.",
    icon: 'Diamond',
    scoreUnit: -10,
    maxItems: 13
  },
  [GameType.COLLECTION]: {
    type: GameType.COLLECTION,
    label: "Latshat (Tricks)",
    arabicLabel: "لطوش",
    description: "Avoid taking any trick.",
    icon: 'Layers',
    scoreUnit: -15,
    maxItems: 13
  },
  [GameType.TRIX]: {
    type: GameType.TRIX,
    label: "Trix",
    arabicLabel: "تركس",
    description: "Finish your cards first.",
    icon: 'Trophy',
    scoreUnit: 0, // Special handling
    maxItems: 4 // 4 ranks
  }
};

export const INITIAL_PLAYERS = [
  "Ahmed (أحمد)", 
  "Sara (سارة)", 
  "Khalid (خالد)", 
  "Layan (ليان)"
];
