export type PlayerId = 0 | 1 | 2 | 3;

export interface Player {
  id: PlayerId;
  name: string;
  score: number;
}

export enum GameType {
  KING = 'KING',
  QUEENS = 'QUEENS',
  DIAMONDS = 'DIAMONDS',
  COLLECTION = 'COLLECTION', // Latshat
  TRIX = 'TRIX'
}

export interface GameDefinition {
  type: GameType;
  label: string;
  arabicLabel: string;
  description: string;
  icon: string;
  scoreUnit: number; // e.g., -25 per queen
  maxItems?: number; // e.g., 4 queens
}

export interface ScoreTransaction {
  id: string;
  gameType: GameType;
  scores: { [key in PlayerId]: number };
  timestamp: number;
}
