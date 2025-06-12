'use client';

import type { Player } from '@/types';
import { Badge } from '@/components/ui/badge';

interface StatusDisplayProps {
  currentPlayer: Player;
  players: [Player, Player];
  deckSize: number;
  winner: Player | null;
  turnMessages: string[];
}

export function StatusDisplay({
  currentPlayer,
  players,
  deckSize,
  winner,
  turnMessages,
}: StatusDisplayProps) {
  return (
    <div className="p-4 bg-card rounded-lg shadow-lg mb-4 text-center md:text-left">
      {winner ? (
        <h2 className="text-2xl font-bold text-primary font-headline">
          🎉 {winner.name} Wins! 🎉
        </h2>
      ) : (
        <h2 className="text-xl font-semibold text-foreground font-headline">
          Current Player: <span className="text-primary">{currentPlayer.name}</span>
        </h2>
      )}
      <div className="mt-2 flex flex-col md:flex-row md:justify-between items-center text-sm text-muted-foreground">
        <div className="flex gap-4">
          {players.map(p => (
            <div key={p.id}>
              {p.name}: <Badge variant={p.id === currentPlayer.id ? "default" : "secondary"}>{p.hand.length} cards</Badge>
            </div>
          ))}
          <div>
            Deck: <Badge variant="outline">{deckSize} cards</Badge>
          </div>
        </div>
        {turnMessages.length > 0 && (
          <div className="mt-2 md:mt-0 text-accent">
            {turnMessages.join(' ')}
          </div>
        )}
      </div>
    </div>
  );
}
