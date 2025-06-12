'use client';

import { useGameLogic } from '@/hooks/use-game-logic';
import { GameBoard } from '@/components/game-board';
import { PlayerHand } from '@/components/player-hand';
import { GameControls } from '@/components/game-controls';
import { StatusDisplay } from '@/components/status-display';
import { AIPanel } from '@/components/ai-panel';
import type { WordCard as WordCardType, GridCell, SelectedCardInfo } from '@/types';
import { DndProvider } from 'react-dnd'; // If using react-dnd
import { HTML5Backend } from 'react-dnd-html5-backend'; // If using react-dnd
import { useEffect } from 'react';


export default function LexicaLabyrinthPage() {
  const {
    gameState,
    newGame,
    selectCard,
    placeCardOnBoard,
    removeCardFromBoard,
    drawCard,
    endTurn,
    handleDragStart, // Renamed from useGameLogic to avoid conflict
    handleDrop,      // Renamed from useGameLogic
    setDraggedItem,   // Expose from useGameLogic for DND handling
  } = useGameLogic();

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

  // Drag and drop handlers using native HTML DND for simplicity first
  // These will call the hook's handleDragStart and handleDrop

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
    if (cell) { // Clicked on an existing card on the board
      selectCard({ card: cell, source: 'board', boardCoordinates: { row: rowIndex, col: colIndex } });
    } else { // Clicked on an empty cell
      if (selectedCardInfo) {
        placeCardOnBoard(rowIndex, colIndex);
      }
    }
  };

  const onHandCardSelect = (card: WordCardType, handIndex: number) => {
    selectCard({ card, source: 'hand', handIndex });
  };
  
  // Clear draggedItem on drag end to prevent issues if drop doesn't occur on a valid target
  useEffect(() => {
    const dragEndHandler = () => setDraggedItem(null);
    document.addEventListener('dragend', dragEndHandler);
    return () => document.removeEventListener('dragend', dragEndHandler);
  }, [setDraggedItem]);

  return (
    // If using react-dnd, wrap with DndProvider: <DndProvider backend={HTML5Backend}>
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
          setDraggedItem={setDraggedItem} // Pass this down
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
            setDraggedItem={setDraggedItem} // Pass this down
          />
        </div>

        <GameControls
          onFinishTurn={endTurn}
          onDrawCard={drawCard}
          onNewGame={newGame}
          canFinishTurn={actionsThisTurn > 0 || deck.length === 0} // Allow finish if deck empty even with 0 actions
          isGameWon={isGameWon}
          deckEmpty={deck.length === 0}
          // Placeholder AI handlers
          // onGrammarInsight={() => console.log("Grammar Insight Clicked")}
          // onSentenceSuggestions={() => console.log("Sentence Suggestion Clicked")}
        />
        
        <AIPanel gameBoard={gameBoard} currentHand={currentPlayer.hand} />
        
        {isGameWon && winner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-8 rounded-lg shadow-xl text-center">
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
        <p>Tip: Form grammatical sentences or groups of 3+ same-type words horizontally.</p>
      </footer>
    </div>
    // </DndProvider>
  );
}
