
'use client';

import { useGameLogic } from '@/hooks/use-game-logic';
import { GameBoard } from '@/components/game-board';
import { PlayerHand } from '@/components/player-hand';
import { GameControls } from '@/components/game-controls';
import { StatusDisplay } from '@/components/status-display';
import { AIPanel } from '@/components/ai-panel';
import type { WordCard as WordCardType, GridCell, SelectedCardInfo } from '@/types';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


export default function LexicaLabyrinthPage() {
  const {
    gameState,
    newGame,
    selectCard,
    placeCardOnBoard,
    removeCardFromBoard,
    drawCard,
    endTurn,
    handleDragStart,
    handleDrop,
    setDraggedItem,
  } = useGameLogic();

  useEffect(() => {
    const dragEndHandler = () => setDraggedItem(null);
    document.addEventListener('dragend', dragEndHandler);
    return () => document.removeEventListener('dragend', dragEndHandler);
  }, [setDraggedItem]);

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-foreground">Loading LexicaLabyrinth...</p>
      </div>
    );
  }

  const {
    players,
    currentPlayerIndex,
    gameBoard,
    isGameWon,
    selectedCardInfo,
    actionsThisTurn,
    winner,
    deck,
    turnMessages,
    highlightedIssues,
  } = gameState;

  const currentPlayer = players[currentPlayerIndex];

  const onBoardCardDragStart = (card: GridCell, rowIndex: number, colIndex: number) => {
    const itemInfo: SelectedCardInfo = { card, source: 'board', boardCoordinates: { row: rowIndex, col: colIndex } };
    handleDragStart(itemInfo);
  };
  
  const onHandCardDragStart = (card: WordCardType, handIndex: number) => {
    const itemInfo: SelectedCardInfo = { card, source: 'hand', handIndex };
    handleDragStart(itemInfo);
  };

  const onCellDrop = (rowIndex: number, colIndex: number) => {
    handleDrop(rowIndex, colIndex);
  };

  const onCellClick = (rowIndex: number, colIndex: number) => {
    const cell = gameBoard[rowIndex][colIndex];
    if (cell) {
      selectCard({ card: cell, source: 'board', boardCoordinates: { row: rowIndex, col: colIndex } });
    } else {
      if (selectedCardInfo) {
        placeCardOnBoard(rowIndex, colIndex);
      }
    }
  };

  const onHandCardSelect = (card: WordCardType, handIndex: number) => {
    selectCard({ card, source: 'hand', handIndex });
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-6 bg-background">
      <header className="w-full max-w-5xl mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary font-headline mb-2">
          LexicaLabyrinth
        </h1>
        <StatusDisplay
          currentPlayer={currentPlayer}
          players={players}
          deckSize={deck.length}
          winner={winner}
          turnMessages={turnMessages}
        />
      </header>

      <main className="w-full max-w-5xl space-y-6">
        <GameBoard
          board={gameBoard}
          selectedCardInfo={selectedCardInfo}
          currentPlayerId={currentPlayer.id}
          highlightedIssues={highlightedIssues}
          onCellClick={onCellClick}
          onCellDrop={onCellDrop}
          onCardRemove={removeCardFromBoard}
          onCardDragStart={onBoardCardDragStart}
          setDraggedItem={setDraggedItem}
        />

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-center md:text-left text-foreground">
            {currentPlayer.name}'s Hand ({currentPlayer.hand.length} cards)
          </h3>
          <PlayerHand
            hand={currentPlayer.hand}
            selectedCardInfo={selectedCardInfo}
            onCardSelect={onHandCardSelect}
            onCardDragStart={onHandCardDragStart}
            setDraggedItem={setDraggedItem}
          />
        </div>

        <GameControls
          onFinishTurn={endTurn}
          onDrawCard={drawCard}
          onNewGame={newGame}
          canFinishTurn={actionsThisTurn > 0 || deck.length === 0}
          isGameWon={isGameWon}
          deckEmpty={deck.length === 0}
        />
        
        <AIPanel gameBoard={gameBoard} currentHand={currentPlayer.hand} />
        
        {isGameWon && winner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-lg shadow-xl text-center">
              <h2 className="text-3xl font-bold text-primary mb-4 font-headline">
                🎉 {winner.name} Wins! 🎉
              </h2>
              <Button onClick={newGame} size="lg">Play Again</Button>
            </div>
          </div>
        )}
      </main>
      <footer className="w-full max-w-5xl mt-8 text-center text-xs text-muted-foreground">
        <p>LexicaLabyrinth - A word placement game.</p>
        <p>Tip: Form grammatical sentences or groups of 3+ words starting with the same letter horizontally.</p>
      </footer>
    </div>
  );
}
