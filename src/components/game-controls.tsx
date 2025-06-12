
'use client';

import { Button } from '@/components/ui/button';
import { Lightbulb, MessageSquareQuote, Play, RotateCcw, Dices, Brain, Undo2 } from 'lucide-react';

interface GameControlsProps {
  onFinishTurn: () => void;
  onDrawCard: () => void;
  onNewGame: () => void;
  onReturnPlacedCards: () => void;
  onGrammarInsight?: () => void;
  onSentenceSuggestions?: () => void;
  canFinishTurn: boolean;
  hasPlacedCardsThisTurn: boolean;
  isGameWon: boolean;
  deckEmpty: boolean;
}

export function GameControls({
  onFinishTurn,
  onDrawCard,
  onNewGame,
  onReturnPlacedCards,
  onGrammarInsight,
  onSentenceSuggestions,
  canFinishTurn,
  hasPlacedCardsThisTurn,
  isGameWon,
  deckEmpty,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-4 bg-card rounded-lg shadow-lg mt-4">
      <Button 
        onClick={onFinishTurn} 
        disabled={!canFinishTurn || isGameWon} 
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Finish Turn"
      >
        <Play className="mr-2 h-5 w-5" /> Finish Turn
      </Button>
      <Button 
        onClick={onDrawCard} 
        variant="outline" 
        disabled={isGameWon} // Player can always attempt to draw if game not won, even if deck is empty (logic handles it)
        aria-label={deckEmpty ? "Deck is empty, Draw & End Turn" : "Draw Card & End Turn"}
      >
        <Dices className="mr-2 h-5 w-5" /> Draw Card {deckEmpty && "(Empty)"}
      </Button>
       <Button 
        onClick={onReturnPlacedCards}
        variant="outline"
        disabled={!hasPlacedCardsThisTurn || isGameWon}
        aria-label="Return Placed Cards to Hand"
        className="border-amber-500 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-600/20"
      >
        <Undo2 className="mr-2 h-5 w-5" /> Return Cards
      </Button>
      
      {onGrammarInsight && (
         <Button onClick={onGrammarInsight} variant="outline" disabled={isGameWon} className="text-accent-foreground border-accent hover:bg-accent/10">
            <MessageSquareQuote className="mr-2 h-5 w-5 text-accent" /> Grammar Insight
        </Button>
      )}

      {onSentenceSuggestions && (
        <Button onClick={onSentenceSuggestions} variant="outline" disabled={isGameWon} className="text-accent-foreground border-accent hover:bg-accent/10">
            <Brain className="mr-2 h-5 w-5 text-accent" /> Suggestions
        </Button>
      )}
      
      <Button onClick={onNewGame} variant="secondary" aria-label="Start New Game">
        <RotateCcw className="mr-2 h-5 w-5" /> New Game
      </Button>
    </div>
  );
}

    