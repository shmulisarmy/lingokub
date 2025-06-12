
import type { GridCell, ValidationIssue, SentencePattern, CardCategory, WordCard } from '@/types';
import { GRID_ROWS, GRID_COLS, SENTENCE_PATTERNS, SAME_LETTER_GROUP_MIN_LENGTH } from '@/lib/constants';

export function validateBoard(board: (GridCell | null)[][]): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let allPatternsValid = true;
  // let hasPlacedCard = false; // This variable is not currently used to determine overall board validity based on whether a card was placed.

  for (let r = 0; r < GRID_ROWS; r++) {
    let currentCol = 0;
    while (currentCol < GRID_COLS) {
      // Find the start of a potential sequence
      while (currentCol < GRID_COLS && board[r][currentCol] === null) {
        currentCol++;
      }
      if (currentCol === GRID_COLS) break; // End of row

      const sequenceStartCol = currentCol;
      let sequenceEndCol = currentCol;
      const currentSequence: GridCell[] = [];

      // Find the end of the current sequence of cards
      while (sequenceEndCol < GRID_COLS && board[r][sequenceEndCol] !== null) {
        currentSequence.push(board[r][sequenceEndCol] as GridCell);
        // if (board[r][sequenceEndCol]?.isNewThisTurn) { // Check if any card in sequence is new
        //   hasPlacedCard = true;
        // }
        sequenceEndCol++;
      }
      
      // Validate the found sequence
      if (currentSequence.length > 0) {
        const { isValidSequence, issue } = validateSequence(currentSequence, r, sequenceStartCol);
        if (!isValidSequence && issue) {
          issues.push(issue);
          allPatternsValid = false;
        }
      }
      currentCol = sequenceEndCol; // Move to the end of the processed sequence
    }
  }
  
  return { isValid: allPatternsValid, issues };
}

function validateSequence(sequence: GridCell[], rowIndex: number, startCol: number): { isValidSequence: boolean; issue?: ValidationIssue } {
  if (sequence.length === 0) return { isValidSequence: true };

  // Rule: No isolated single words allowed. A sequence of 1 is always invalid under current rules.
  if (sequence.length === 1 && !isGrammaticalSentence(sequence) && !isSameStartLetterGroup(sequence)) {
     return { 
       isValidSequence: false, 
       issue: { rowIndex, startCol, endCol: startCol, message: `Isolated card: '${sequence[0].text}'`, type: 'isolated' }
     };
  }
  
  // For sequences of length 2, they must form a grammatical sentence. Same letter group requires 3+.
  if (sequence.length === 2 && !isGrammaticalSentence(sequence)) {
    return {
      isValidSequence: false,
      issue: { rowIndex, startCol, endCol: startCol + 1, message: `Invalid two-word pattern: ${sequence.map(c=>c.text).join(' ')}`, type: 'pattern' }
    };
  }

  const isSentence = isGrammaticalSentence(sequence);
  const isGroup = isSameStartLetterGroup(sequence);

  if (isSentence || isGroup) {
    return { isValidSequence: true };
  }

  // If neither, and length is >1 (length 1 handled above), then it's an invalid pattern
  return { 
    isValidSequence: false, 
    issue: { rowIndex, startCol, endCol: startCol + sequence.length - 1, message: `Invalid pattern: ${sequence.map(c=>c.text).join(' ')}`, type: 'pattern' }
  };
}


function isGrammaticalSentence(cells: GridCell[]): boolean {
  if (cells.length === 0) return false;
  const categoriesInSequence = cells.map(cell => cell.categories[0]); // Use primary category

  for (const pattern of SENTENCE_PATTERNS) {
    for (const structureRule of pattern.structure) {
      if (structureRule.length === categoriesInSequence.length) {
        let match = true;
        for (let i = 0; i < structureRule.length; i++) {
          // Allow 'Verb' in pattern to match specific verbs like 'Is', 'Are' if they are tagged only as 'Verb'
          if (structureRule[i] === 'Verb' && (cells[i].text.toLowerCase() === 'is' || cells[i].text.toLowerCase() === 'are')) {
            // This condition is tricky. If 'Is' is specifically a verb, it matches.
            // If the pattern just needs 'Verb', any verb card matches.
            // Current primary category check is fine.
          }
          if (structureRule[i] !== categoriesInSequence[i]) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
  }
  return false;
}

function isSameStartLetterGroup(cells: GridCell[]): boolean {
  if (cells.length < SAME_LETTER_GROUP_MIN_LENGTH) return false;
  
  const firstLetter = cells[0].text[0]?.toLowerCase();
  if (!firstLetter) return false; // Should not happen with valid card text

  for (let i = 1; i < cells.length; i++) {
    if (cells[i].text[0]?.toLowerCase() !== firstLetter) {
      return false;
    }
  }
  return true;
}

export function getBoardStateString(board: (GridCell | null)[][]): string {
  return board.map(row => 
    row.map(cell => cell ? `${cell.text}(${cell.categories[0][0]})` : '_').join(' ') // Abbreviate category
  ).join('\n');
}

export function getPlayerHandString(hand: WordCard[]): string {
  return hand.map(card => card.text).join(', ');
}

    