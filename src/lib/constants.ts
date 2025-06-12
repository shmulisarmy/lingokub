import type { WordCard, CardCategory, SentencePattern } from '@/types';
import { nanoid } from 'nanoid'; // You might need to install nanoid: npm install nanoid

export const GRID_ROWS = 5;
export const GRID_COLS = 8;
export const INITIAL_HAND_SIZE = 14;
export const PLAYER_COUNT = 2;

export const CATEGORIES: CardCategory[] = [
  'Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 
  'Article', 'Preposition', 'Conjunction'
];

export const CARD_COLORS: Record<CardCategory, string> = {
  Noun: 'noun-gradient',
  Verb: 'verb-gradient',
  Adjective: 'adjective-gradient',
  Adverb: 'adverb-gradient',
  Pronoun: 'pronoun-gradient',
  Article: 'article-gradient',
  Preposition: 'preposition-gradient',
  Conjunction: 'conjunction-gradient',
  Unknown: 'default-gradient',
};

export const INITIAL_DECK: WordCard[] = [
  // Pronouns
  { id: nanoid(), text: 'I', categories: ['Pronoun'] }, { id: nanoid(), text: 'You', categories: ['Pronoun'] },
  { id: nanoid(), text: 'He', categories: ['Pronoun'] }, { id: nanoid(), text: 'She', categories: ['Pronoun'] },
  { id: nanoid(), text: 'It', categories: ['Pronoun'] }, { id: nanoid(), text: 'We', categories: ['Pronoun'] },
  { id: nanoid(), text: 'They', categories: ['Pronoun'] },
  // Verbs
  { id: nanoid(), text: 'Run', categories: ['Verb'] }, { id: nanoid(), text: 'Eat', categories: ['Verb'] },
  { id: nanoid(), text: 'See', categories: ['Verb'] }, { id: nanoid(), text: 'Play', categories: ['Verb'] },
  { id: nanoid(), text: 'Is', categories: ['Verb'] }, { id: nanoid(), text: 'Are', categories: ['Verb'] },
  { id: nanoid(), text: 'Go', categories: ['Verb'] }, { id: nanoid(), text: 'Like', categories: ['Verb'] },
  // Nouns
  { id: nanoid(), text: 'Cat', categories: ['Noun'] }, { id: nanoid(), text: 'Dog', categories: ['Noun'] },
  { id: nanoid(), text: 'Sun', categories: ['Noun'] }, { id: nanoid(), text: 'Moon', categories: ['Noun'] },
  { id: nanoid(), text: 'Man', categories: ['Noun'] }, { id: nanoid(), text: 'Woman', categories: ['Noun'] },
  { id: nanoid(), text: 'Park', categories: ['Noun'] }, { id: nanoid(), text: 'Book', categories: ['Noun'] },
  // Adjectives
  { id: nanoid(), text: 'Big', categories: ['Adjective'] }, { id: nanoid(), text: 'Small', categories: ['Adjective'] },
  { id: nanoid(), text: 'Red', categories: ['Adjective'] }, { id: nanoid(), text: 'Happy', categories: ['Adjective'] },
  { id: nanoid(), text: 'Fast', categories: ['Adjective'] }, { id: nanoid(), text: 'Good', categories: ['Adjective'] },
  // Adverbs
  { id: nanoid(), text: 'Quickly', categories: ['Adverb'] }, { id: nanoid(), text: 'Slowly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Very', categories: ['Adverb'] }, { id: nanoid(), text: 'Often', categories: ['Adverb'] },
  // Articles
  { id: nanoid(), text: 'A', categories: ['Article'] }, { id: nanoid(), text: 'An', categories: ['Article'] },
  { id: nanoid(), text: 'The', categories: ['Article'] },
  // Prepositions
  { id: nanoid(), text: 'In', categories: ['Preposition'] }, { id: nanoid(), text: 'On', categories: ['Preposition'] },
  { id: nanoid(), text: 'At', categories: ['Preposition'] }, { id: nanoid(), text: 'With', categories: ['Preposition'] },
  // Conjunctions
  { id: nanoid(), text: 'And', categories: ['Conjunction'] }, { id: nanoid(), text: 'But', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Or', categories: ['Conjunction'] }, { id: nanoid(), text: 'So', categories: ['Conjunction'] },
  // Add more cards to ensure enough for gameplay (at least 28 for initial deal + draw pile)
  ...Array(10).fill(null).map((_, i) => ({ id: nanoid(), text: `Noun${i+1}`, categories: ['Noun'] as CardCategory[] })),
  ...Array(10).fill(null).map((_, i) => ({ id: nanoid(), text: `Verb${i+1}`, categories: ['Verb'] as CardCategory[] })),
  ...Array(5).fill(null).map((_, i) => ({ id: nanoid(), text: `Adj${i+1}`, categories: ['Adjective'] as CardCategory[] })),
];

export const SENTENCE_PATTERNS: SentencePattern[] = [
  { name: "Pronoun-Verb-Noun", structure: [['Pronoun', 'Verb', 'Noun']] },
  { name: "Article-Noun-Verb", structure: [['Article', 'Noun', 'Verb']] },
  { name: "Pronoun-Verb-Adjective", structure: [['Pronoun', 'Verb', 'Adjective']] },
  { name: "Article-Adjective-Noun", structure: [['Article', 'Adjective', 'Noun']] },
  { name: "Noun-Verb-Adverb", structure: [['Noun', 'Verb', 'Adverb']] },
  // Example of a pattern with options (e.g. Noun or Pronoun as subject)
  // { name: "Subject-Verb-Object", structure: [['Noun', 'Verb', 'Noun'], ['Pronoun', 'Verb', 'Noun']] },
];

export const SAME_TYPE_GROUP_MIN_LENGTH = 3;

// Ensure nanoid is installed: `npm install nanoid` or `yarn add nanoid`
// If nanoid causes issues with server components/Next.js build, a simpler unique ID generator can be used.
// For example: export const generateId = () => Math.random().toString(36).substr(2, 9);
// But nanoid is generally fine.
