
'use client';

import type { WordCard as WordCardType, GridCell, CardCategory } from '@/types';
import { cn, getCardCategoryColor, getPrimaryCategory } from '@/lib/utils';
import { Button } from './ui/button';
import { XIcon } from 'lucide-react';

interface WordCardProps {
  card: WordCardType | GridCell;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  isRemovable?: boolean; // Typically if card.isNewThisTurn and placed by current player
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
}

export function WordCard({
  card,
  isSelected,
  onClick,
  onRemove,
  isRemovable,
  draggable = false,
  onDragStart,
  className,
}: WordCardProps) {
  const primaryCategory = getPrimaryCategory(card.categories); // Still used for color
  const colorClass = getCardCategoryColor(primaryCategory);
  const displayCategories = card.categories.join(', ');

  const validationState = (card as GridCell).validationState;
  let borderClass = 'border-transparent';
  if (isSelected) {
    borderClass = 'border-blue-500 ring-2 ring-blue-500 ring-offset-1';
  } else if (validationState === 'valid') {
    // Green highlighting for valid patterns (applied to sequence, not individual cards usually)
    // borderClass = 'border-green-500'; 
  } else if (validationState === 'invalid') {
     borderClass = 'border-red-500 ring-1 ring-red-500';
  }


  return (
    <div
      className={cn(
        'relative p-2 rounded-md shadow-md h-20 w-28 min-w-[6rem] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 ease-in-out transform hover:scale-105',
        colorClass,
        borderClass,
        'text-sm md:text-base md:h-24 md:w-32',
        className
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      aria-label={`Word card: ${card.text}, Categories: ${displayCategories}`}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <span className="font-bold text-lg">{card.text}</span>
      <span className="text-xs opacity-80">{displayCategories}</span>
      {isRemovable && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive/80 rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onRemove();
          }}
          aria-label="Remove card"
        >
          <XIcon size={16} />
        </Button>
      )}
    </div>
  );
}

