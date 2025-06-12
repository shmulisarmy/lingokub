
import type { GridCell, ValidationIssue, SentencePattern, CardCategory, WordCard } from '@/types';
import { GRID_ROWS, GRID_COLS, SENTENCE_PATTERNS, SAME_LETTER_GROUP_MIN_LENGTH } from '@/lib/constants';

export function validateBoard(originalBoard: (GridCell | null)[][]): { 
  isValid: boolean; 
  issues: ValidationIssue[];
  boardWithValidationStates: (GridCell | null)[][];
} {
  const issues: ValidationIssue[] = [];
  let allPatternsValid = true;
  
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
          allPatternsValid = false;
          for (let i = 0; i < currentSequenceCells.length; i++) {
            const cellToUpdate = board[r][sequenceStartCol + i];
            if (cellToUpdate) {
              cellToUpdate.validationState = 'invalid';
            }
          }
        } else if (isValidSequence) {
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
  
  return { isValid: allPatternsValid, issues, boardWithValidationStates: board };
}

function validateSequence(sequence: GridCell[], rowIndex: number, startCol: number): { isValidSequence: boolean; issue?: ValidationIssue } {
  if (sequence.length === 0) return { isValidSequence: true };

  const isSentence = isGrammaticalSentence(sequence);
  const isGroup = isSameStartLetterGroup(sequence);

  if (isSentence || isGroup) {
    return { isValidSequence: true };
  }

  // If neither, then it's an invalid pattern (covers single isolated cards as well if they don't form a valid 1-word sentence/group)
  let message = `Invalid pattern: ${sequence.map(c => c.text).join(' ')}`;
  let type: ValidationIssue['type'] = 'pattern';

  if (sequence.length === 1) {
    message = `Isolated card: '${sequence[0].text}' is not a valid short sentence or group.`;
    type = 'isolated';
  }
  
  return { 
    isValidSequence: false, 
    issue: { rowIndex, startCol, endCol: startCol + sequence.length - 1, message, type }
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
    row.map(cell => cell ? `${cell.text}(${cell.categories[0][0]})` : '_').join(' ') 
  ).join('\n');
}

export function getPlayerHandString(hand: WordCard[]): string {
  return hand.map(card => card.text).join(', ');
}

    
