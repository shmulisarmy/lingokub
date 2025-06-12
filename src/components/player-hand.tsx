'use client';

import type { WordCard as WordCardType, SelectedCardInfo } from '@/types';
import { WordCard } from './word-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PlayerHandProps {
  hand: WordCardType[];
  selectedCardInfo: SelectedCardInfo | null;
  onCardSelect: (card: WordCardType, handIndex: number) => void;
  onCardDragStart: (card: WordCardType, handIndex: number) => void;
   setDraggedItem: (item: SelectedCardInfo | null) => void; // For global DND tracking
}

export function PlayerHand({ hand, selectedCardInfo, onCardSelect, onCardDragStart, setDraggedItem }: PlayerHandProps) {
  if (!hand || hand.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">Hand is empty.</div>;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card shadow-lg">
      <div className="flex space-x-2 p-4 min-h-[8rem] md:min-h-[10rem] items-center">
        {hand.map((card, index) => (
          <WordCard
            key={card.id}
            card={card}
            isSelected={
              selectedCardInfo?.source === 'hand' && selectedCardInfo.card.id === card.id
            }
            onClick={() => onCardSelect(card, index)}
            draggable
            onDragStart={(e) => {
              const dragInfo: SelectedCardInfo = { card, source: 'hand', handIndex: index };
              onCardDragStart(card, index); // This is from useGameLogic hook
              setDraggedItem(dragInfo); // For global DND tracking if needed by page
              if (e.dataTransfer) {
                  e.dataTransfer.setData('application/json', JSON.stringify(dragInfo));
                  e.dataTransfer.effectAllowed = "move";
              }
            }}
            className="shrink-0"
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
