export type CardCategory = 
  | 'Noun' 
  | 'Verb' 
  | 'Adjective' 
  | 'Adverb' 
  | 'Pronoun' 
  | 'Article' 
  | 'Preposition' 
  | 'Conjunction'
  | 'Unknown';

export interface WordCard {
  id: string;
  text: string;
  categories: CardCategory[]; // Primary category first for coloring/grouping
}

export interface GridCell extends WordCard {
  isNewThisTurn?: boolean;
  placedByPlayerId?: string; // ID of the player who placed this card
  originalHandIndex?: number; // To return to hand
  validationState?: 'valid' | 'invalid' | 'neutral'; // For highlighting
}

export interface Player {
  id: string;
  name: string;
  hand: WordCard[];
}

export interface SelectedCardInfo {
  card: WordCard;
  source: 'hand' | 'board';
  handIndex?: number;
  boardCoordinates?: { row: number; col: number };
}

export interface ValidationIssue {
  rowIndex: number;
  startCol: number;
  endCol: number;
  message: string;
  type: 'isolated' | 'pattern';
}

export interface GameState {
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  gameBoard: (GridCell | null)[][]; // 5 rows, 8 columns
  isGameWon: boolean;
  selectedCardInfo: SelectedCardInfo | null;
  actionsThisTurn: number; // Number of cards placed/moved this turn
  winner: Player | null;
  deck: WordCard[];
  turnMessages: string[]; // For feedback like "Invalid move"
  highlightedIssues: ValidationIssue[];
}

export interface SentencePattern {
  name: string;
  structure: CardCategory[][]; // Array of possible category sequences
}
