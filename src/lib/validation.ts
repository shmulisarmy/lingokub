import type { GridCell, ValidationIssue, SentencePattern, CardCategory } from '@/types';
import { GRID_ROWS, GRID_COLS, SENTENCE_PATTERNS, SAME_TYPE_GROUP_MIN_LENGTH } from '@/lib/constants';

export function validateBoard(board: (GridCell | null)[][]): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let allPatternsValid = true;
  let hasPlacedCard = false;

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
        if (board[r][sequenceEndCol]?.isNewThisTurn) {
          hasPlacedCard = true;
        }
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
  
  // Check for isolated cards (any card not part of a valid sequence according to more detailed rules)
  // This is a simplified check; a more robust one would see if a card contributes to ANY valid pattern.
  // For now, if issues exist, implies some cards might be "isolated" in effect.
  // A true isolated check would verify each card is part of at least one valid pattern found.
  // This part is complex and needs careful implementation.
  // Placeholder: if any issues were found, we assume the board is not fully valid.

  // The game rule is "All placed cards must be part of at least one valid horizontal pattern"
  // and "No isolated single words allowed".
  // The current `validateSequence` needs to be robust. If a sequence of 1 is found, it's an issue unless part of a longer valid pattern (which this linear scan doesn't easily cover for overlaps).
  // This simplified validation treats any single card as an error if not forming a valid group/sentence.
  
  return { isValid: allPatternsValid, issues };
}

function validateSequence(sequence: GridCell[], rowIndex: number, startCol: number): { isValidSequence: boolean; issue?: ValidationIssue } {
  if (sequence.length === 0) return { isValidSequence: true };

  // Rule: No isolated single words allowed. A sequence of 1 is only valid if it's part of a larger valid structure,
  // which is hard to check with simple linear scan. For now, a sequence of 1 is invalid unless it's a valid sentence pattern of length 1 (unlikely).
  if (sequence.length === 1 && !isGrammaticalSentence(sequence) && !isSameTypeGroup(sequence)) {
     return { 
       isValidSequence: false, 
       issue: { rowIndex, startCol, endCol: startCol, message: `Isolated card: '${sequence[0].text}'`, type: 'isolated' }
     };
  }
  
  const isSentence = isGrammaticalSentence(sequence);
  const isGroup = isSameTypeGroup(sequence);

  if (isSentence || isGroup) {
    return { isValidSequence: true };
  }

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

function isSameTypeGroup(cells: GridCell[]): boolean {
  if (cells.length < SAME_TYPE_GROUP_MIN_LENGTH) return false;
  
  const firstCategory = cells[0].categories[0]; // Use primary category
  for (let i = 1; i < cells.length; i++) {
    if (cells[i].categories[0] !== firstCategory) {
      return false;
    }
  }
  return true;
}

export function getBoardStateString(board: (GridCell | null)[][]): string {
  return board.map(row => 
    row.map(cell => cell ? cell.text : '_').join(' ')
  ).join('\n');
}

export function getPlayerHandString(hand: WordCard[]): string {
  return hand.map(card => card.text).join(', ');
}
