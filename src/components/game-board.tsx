'use client';

import type { GridCell as GridCellType, SelectedCardInfo, ValidationIssue } from '@/types';
import { GRID_ROWS, GRID_COLS } from '@/lib/constants';
import { GridCellWrapper } from './grid-cell-wrapper';

interface GameBoardProps {
  board: (GridCellType | null)[][];
  selectedCardInfo: SelectedCardInfo | null;
  currentPlayerId: string;
  highlightedIssues: ValidationIssue[];
  onCellClick: (rowIndex: number, colIndex: number) => void; // For placing selected card or selecting board card
  onCellDrop: (rowIndex: number, colIndex: number) => void;
  onCardRemove: (rowIndex: number, colIndex: number) => void;
  onCardDragStart: (card: GridCellType, rowIndex: number, colIndex: number) => void; // Source info
  setDraggedItem: (item: SelectedCardInfo | null) => void; // For dragOver
}

export function GameBoard({
  board,
  selectedCardInfo,
  currentPlayerId,
  highlightedIssues,
  onCellClick,
  onCellDrop,
  onCardRemove,
  onCardDragStart,
  setDraggedItem
}: GameBoardProps) {

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const getHighlightClass = (rowIndex: number, colIndex: number): string | undefined => {
    for (const issue of highlightedIssues) {
      if (issue.rowIndex === rowIndex && colIndex >= issue.startCol && colIndex <= issue.endCol) {
        return issue.type === 'isolated' || issue.type === 'pattern' ? 'bg-red-200/50' : undefined;
      }
    }
    // TODO: Add logic for valid pattern highlighting (green) if separate from issues
    return undefined;
  };


  return (
    <div className="grid grid-cols-8 gap-1 md:gap-2 p-2 md:p-4 bg-card rounded-lg shadow-xl aspect-[8/5] max-w-4xl mx-auto">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const isSelected =
            selectedCardInfo?.source === 'board' &&
            selectedCardInfo.boardCoordinates?.row === rowIndex &&
            selectedCardInfo.boardCoordinates?.col === colIndex;
          
          const isRemovable = cell?.isNewThisTurn && cell?.placedByPlayerId === currentPlayerId;
          const highlight = getHighlightClass(rowIndex, colIndex);

          return (
            <GridCellWrapper
              key={cellKey}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onDrop={onCellDrop}
              onDragOver={handleDragOver}
              onCardClick={onCellClick}
              onCardRemove={onCardRemove}
              onCardDragStart={(e, cardData, r, c) => {
                const dragInfo: SelectedCardInfo = {
                  card: cardData,
                  source: 'board',
                  boardCoordinates: {row: r, col: c}
                };
                onCardDragStart(cardData, r, c); // This is from useGameLogic for its own state
                setDraggedItem(dragInfo); // For global DND tracking if needed by parent
                if (e.dataTransfer) {
                  e.dataTransfer.setData('application/json', JSON.stringify(dragInfo));
                  e.dataTransfer.effectAllowed = "move";
                }
              }}
              isSelected={isSelected}
              isRemovable={!!isRemovable}
              highlightClass={highlight}
            />
          );
        })
      )}
    </div>
  );
}
