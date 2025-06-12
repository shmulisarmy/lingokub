'use client';

import type { GridCell as GridCellType } from '@/types';
import { WordCard } from './word-card';
import { cn } from '@/lib/utils';

interface GridCellWrapperProps {
  cell: GridCellType | null;
  rowIndex: number;
  colIndex: number;
  onDrop: (rowIndex: number, colIndex: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onCardClick: (rowIndex: number, colIndex: number) => void;
  onCardRemove: (rowIndex: number, colIndex: number) => void;
  onCardDragStart: (e: React.DragEvent<HTMLDivElement>, card: GridCellType, rowIndex: number, colIndex: number) => void;
  isSelected?: boolean;
  isRemovable?: boolean;
  highlightClass?: string;
}

export function GridCellWrapper({
  cell,
  rowIndex,
  colIndex,
  onDrop,
  onDragOver,
  onCardClick,
  onCardRemove,
  onCardDragStart,
  isSelected,
  isRemovable,
  highlightClass,
}: GridCellWrapperProps) {
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(rowIndex, colIndex);
  };

  return (
    <div
      className={cn(
        'border border-dashed border-gray-400 rounded-md aspect-square flex items-center justify-center min-h-[5rem] md:min-h-[6rem]',
        highlightClass,
        {'bg-accent/20': highlightClass === 'bg-green-200/50', 'bg-destructive/20': highlightClass === 'bg-red-200/50'}
      )}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onClick={() => { if (!cell) onCardClick(rowIndex, colIndex); /* Allow clicking empty cell to place selected card */ }}
      aria-label={`Grid cell ${rowIndex}-${colIndex}, ${cell ? `contains ${cell.text}` : 'empty'}`}
    >
      {cell ? (
        <WordCard
          card={cell}
          isSelected={isSelected}
          onClick={() => onCardClick(rowIndex, colIndex)}
          onRemove={isRemovable ? () => onCardRemove(rowIndex, colIndex) : undefined}
          isRemovable={isRemovable}
          draggable
          onDragStart={(e) => onCardDragStart(e, cell, rowIndex, colIndex)}
        />
      ) : (
        <div className="w-full h-full" /> // Placeholder for empty droppable area styling
      )}
    </div>
  );
}
