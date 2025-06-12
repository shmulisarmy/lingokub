
import type { GridCell, ValidationIssue, CardCategory } from '@/types';
import { GRID_ROWS, GRID_COLS, SENTENCE_PATTERNS, SAME_LETTER_GROUP_MIN_LENGTH } from '@/lib/constants';
import { getPrimaryCategory } from '@/lib/utils';

export function validateBoard(originalBoard: (GridCell | null)[][]): { 
  isValid: boolean; 
  issues: ValidationIssue[];
  boardWithValidationStates: (GridCell | null)[][];
} {
  const issues: ValidationIssue[] = [];
  let allRowsValid = true; // Changed from allPatternsValid for clarity
  
  const board = originalBoard.map(row => 
    row.map(cell => cell ? ({ ...cell, validationState: 'neutral' } as GridCell) : null)
  );

  for (let r = 0; r < GRID_ROWS; r++) {
    let currentCol = 0;
    while (currentCol < GRID_COLS) {
      if (board[r][currentCol] === null) {
        currentCol++;
        continue; 
      }

      const sequenceStartCol = currentCol;
      let sequenceEndCol = currentCol;
      const currentSequenceCells: GridCell[] = [];

      while (sequenceEndCol < GRID_COLS && board[r][sequenceEndCol] !== null) {
        currentSequenceCells.push(board[r][sequenceEndCol] as GridCell);
        sequenceEndCol++;
      }
      
      if (currentSequenceCells.length > 0) {
        const { isValidSequence, issue } = validateSequence(currentSequenceCells, r, sequenceStartCol);
        if (!isValidSequence && issue) {
          issues.push(issue);
          allRowsValid = false; // If any sequence in any row is invalid, the board has issues
          for (let i = 0; i < currentSequenceCells.length; i++) {
            const cellToUpdate = board[r][sequenceStartCol + i];
            if (cellToUpdate) {
              cellToUpdate.validationState = 'invalid';
            }
          }
        } else if (isValidSequence) {
          // Mark cells in a valid sequence as 'valid'
          for (let i = 0; i < currentSequenceCells.length; i++) {
            const cellToUpdate = board[r][sequenceStartCol + i];
            if (cellToUpdate) {
              cellToUpdate.validationState = 'valid';
            }
          }
        }
      }
      currentCol = sequenceEndCol; 
    }
  }
  
  return { isValid: allRowsValid, issues, boardWithValidationStates: board };
}

function validateSequence(sequence: GridCell[], rowIndex: number, startCol: number): { isValidSequence: boolean; issue?: ValidationIssue } {
  if (sequence.length === 0) return { isValidSequence: true };

  const isSentence = isGrammaticalSentence(sequence);
  const isGroup = isSameStartLetterGroup(sequence);

  if (isSentence || isGroup) {
    return { isValidSequence: true };
  }

  let message = `Invalid pattern: '${sequence.map(c => c.text).join(' ')}'`;
  let type: ValidationIssue['type'] = 'pattern';

  if (sequence.length === 1 && !isSentence) { // isSentence for a single word would check if `['Noun']` etc. is a pattern
    message = `Isolated card: '${sequence[0].text}' is not a valid short sentence or group.`;
    type = 'isolated';
  }
  
  return { 
    isValidSequence: false, 
    issue: { rowIndex, startCol, endCol: startCol + sequence.length - 1, message, type }
  };
}

// Helper function for the original direct matching logic
function checkDirectPatternMatch(sequenceCells: GridCell[]): boolean {
  if (sequenceCells.length === 0) return false;
  // Use the primary category for matching against defined patterns
  const categoriesInSequence = sequenceCells.map(cell => getPrimaryCategory(cell.categories)); 

  for (const pattern of SENTENCE_PATTERNS) {
    for (const structureRule of pattern.structure) {
      if (structureRule.length === categoriesInSequence.length) {
        let match = true;
        for (let j = 0; j < structureRule.length; j++) {
          // Allow 'Unknown' in pattern to match any category, or specific match
          if (structureRule[j] !== 'Unknown' && structureRule[j] !== categoriesInSequence[j]) {
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


function isGrammaticalSentence(cells: GridCell[]): boolean {
  if (cells.length === 0) return false;

  // 1. Try to match the whole sequence directly
  if (checkDirectPatternMatch(cells)) {
    return true;
  }

  // 2. Try to find a conjunction and split the sentence
  for (let i = 0; i < cells.length; i++) {
    const card = cells[i];
    // Check if *any* category of the card is 'Conjunction'
    if (card.categories.includes('Conjunction')) {
      const firstClauseCells = cells.slice(0, i);
      const secondClauseCells = cells.slice(i + 1);

      // A conjunction shouldn't be at the very start or end of a sequence to join two clauses.
      // And both clauses must have at least one word.
      if (firstClauseCells.length > 0 && secondClauseCells.length > 0) {
        // Check if both sub-clauses match any existing sentence patterns.
        if (checkDirectPatternMatch(firstClauseCells) && checkDirectPatternMatch(secondClauseCells)) {
          return true;
        }
      }
    }
  }

  return false;
}


function isSameStartLetterGroup(cells: GridCell[]): boolean {
  if (cells.length < SAME_LETTER_GROUP_MIN_LENGTH) return false;
  
  const firstLetter = cells[0].text[0]?.toLowerCase();
  if (!firstLetter) return false; 

  for (let i = 1; i < cells.length; i++) {
    if (cells[i].text[0]?.toLowerCase() !== firstLetter) {
      return false;
    }
  }
  return true;
}

export function getBoardStateString(board: (GridCell | null)[][]): string {
  return board.map(row => 
    row.map(cell => cell ? `${cell.text}(${getPrimaryCategory(cell.categories)[0]})` : '_').join(' ') 
  ).join('\n');
}

export function getPlayerHandString(hand: WordCard[]): string {
  return hand.map(card => card.text).join(', ');
}
