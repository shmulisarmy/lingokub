'use client';

import { Button } from '@/components/ui/button';
import { Lightbulb, MessageSquareQuote, Play, RotateCcw, Dices, Brain } from 'lucide-react';

interface GameControlsProps {
  onFinishTurn: () => void;
  onDrawCard: () => void;
  onNewGame: () => void;
  onGrammarInsight?: () => void; // Optional for now
  onSentenceSuggestions?: () => void; // Optional for now
  canFinishTurn: boolean;
  isGameWon: boolean;
  deckEmpty: boolean;
}

export function GameControls({
  onFinishTurn,
  onDrawCard,
  onNewGame,
  onGrammarInsight,
  onSentenceSuggestions,
  canFinishTurn,
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
        disabled={isGameWon || deckEmpty}
        aria-label={deckEmpty ? "Deck is empty" : "Draw Card"}
      >
        <Dices className="mr-2 h-5 w-5" /> Draw Card {deckEmpty && "(Empty)"}
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
