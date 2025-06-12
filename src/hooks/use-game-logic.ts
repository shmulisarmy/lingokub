
'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameState, Player, WordCard, GridCell, SelectedCardInfo, ValidationIssue, CardCategory } from '@/types';
import { GRID_ROWS, GRID_COLS, INITIAL_HAND_SIZE, INITIAL_DECK, PLAYER_COUNT } from '@/lib/constants';
import { shuffleArray, getPrimaryCategory } from '@/lib/utils';
import { validateBoard } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

const createEmptyBoard = (): (GridCell | null)[][] =>
  Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));

const initialPlayer = (id: string, name: string): Player => ({
  id,
  name,
  hand: [],
});

function initializeGame(): GameState {
  const shuffledDeck = shuffleArray(INITIAL_DECK);
  const players: [Player, Player] = [
    initialPlayer('player1', 'Player 1'),
    initialPlayer('player2', 'Player 2'),
  ];

  for (let i = 0; i < PLAYER_COUNT; i++) {
    players[i].hand = shuffledDeck.splice(0, INITIAL_HAND_SIZE);
  }
  
  return {
    players,
    currentPlayerIndex: 0,
    gameBoard: createEmptyBoard(),
    isGameWon: false,
    selectedCardInfo: null,
    actionsThisTurn: 0,
    winner: null,
    deck: shuffledDeck,
    turnMessages: [],
    highlightedIssues: [],
  };
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setGameState(initializeGame());
  }, []);

  const newGame = useCallback(() => {
    setGameState(initializeGame());
    toast({ title: "New Game Started!"});
  }, [toast]);

  const selectCard = useCallback((cardInfo: SelectedCardInfo | null) => {
    setGameState(prev => prev ? ({ ...prev, selectedCardInfo: cardInfo }) : null);
  }, []);

  const placeCardOnBoard = useCallback((rowIndex: number, colIndex: number) => {
    setGameState(prev => {
      if (!prev || !prev.selectedCardInfo) return prev;

      const { card, source, handIndex, boardCoordinates } = prev.selectedCardInfo;
      const newBoard = prev.gameBoard.map(row => [...row]);
      let newPlayers = prev.players.map(p => ({ ...p, hand: [...p.hand] })) as [Player, Player];
      const currentPlayer = newPlayers[prev.currentPlayerIndex];
      let newActionsThisTurn = prev.actionsThisTurn;

      const targetCellEmpty = !newBoard[rowIndex][colIndex];

      if (targetCellEmpty) {
        const newGridCell: GridCell = {
          ...card,
          isNewThisTurn: true,
          placedByPlayerId: currentPlayer.id,
          validationState: 'neutral',
        };
        newBoard[rowIndex][colIndex] = newGridCell;
        if (source === 'hand' && handIndex !== undefined) {
          currentPlayer.hand.splice(handIndex, 1);
        } else if (source === 'board' && boardCoordinates) {
          newBoard[boardCoordinates.row][boardCoordinates.col] = null;
        }
        newActionsThisTurn++;
      } else {
        if (source === 'board' && boardCoordinates) {
          const cardToSwap = newBoard[rowIndex][colIndex]!;
          newBoard[rowIndex][colIndex] = { 
            ...card, 
            isNewThisTurn: true,
            placedByPlayerId: currentPlayer.id,
            validationState: 'neutral'
          };
          newBoard[boardCoordinates.row][boardCoordinates.col] = {
            ...cardToSwap,
            isNewThisTurn: true,
            placedByPlayerId: cardToSwap.placedByPlayerId,
            validationState: 'neutral'
          };
          newActionsThisTurn++;
        } else {
          toast({ title: "Invalid Move", description: "Cell is occupied. Drag from board to swap or place on empty cell.", variant: "destructive" });
          return prev;
        }
      }
      
      const { issues } = validateBoard(newBoard);
      return {
        ...prev,
        gameBoard: newBoard,
        players: newPlayers,
        selectedCardInfo: null,
        actionsThisTurn: newActionsThisTurn,
        turnMessages: [],
        highlightedIssues: issues,
      };
    });
  }, [toast]);

  const removeCardFromBoard = useCallback((rowIndex: number, colIndex: number) => {
    setGameState(prev => {
      if (!prev) return prev;
      const cardToRemove = prev.gameBoard[rowIndex][colIndex];
      if (!cardToRemove || !cardToRemove.isNewThisTurn || cardToRemove.placedByPlayerId !== prev.players[prev.currentPlayerIndex].id) {
        toast({ title: "Invalid Action", description: "Cannot remove this card.", variant: "destructive"});
        return prev;
      }

      const newBoard = prev.gameBoard.map(row => [...row]);
      newBoard[rowIndex][colIndex] = null;

      const newPlayers = prev.players.map(p => ({...p, hand: [...p.hand]})) as [Player, Player];
      const player = newPlayers[prev.currentPlayerIndex];
      player.hand.push({ id: cardToRemove.id, text: cardToRemove.text, categories: cardToRemove.categories });
      
      const { issues } = validateBoard(newBoard);
      return {
        ...prev,
        gameBoard: newBoard,
        players: newPlayers,
        actionsThisTurn: prev.actionsThisTurn > 0 ? prev.actionsThisTurn - 1 : 0, 
        highlightedIssues: issues,
      };
    });
  }, [toast]);

  const returnPlacedCardsToHand = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      const currentPlayer = { ...prev.players[prev.currentPlayerIndex], hand: [...prev.players[prev.currentPlayerIndex].hand] };
      let cardsReturnedCount = 0;
      
      const newBoard = prev.gameBoard.map(row =>
        row.map(cell => {
          if (cell && cell.isNewThisTurn && cell.placedByPlayerId === currentPlayer.id) {
            currentPlayer.hand.push({ id: cell.id, text: cell.text, categories: cell.categories });
            cardsReturnedCount++;
            return null; 
          }
          return cell;
        })
      );

      if (cardsReturnedCount === 0) {
        toast({ title: "No Cards to Return", description: "You haven't placed any cards this turn.", variant: "default" });
        return prev;
      }
      
      const updatedPlayers = prev.players.map((p, index) => index === prev.currentPlayerIndex ? currentPlayer : p) as [Player, Player];
      const { issues } = validateBoard(newBoard);
      toast({ title: "Cards Returned", description: `${cardsReturnedCount} card(s) returned to your hand.` });

      return {
        ...prev,
        gameBoard: newBoard,
        players: updatedPlayers,
        actionsThisTurn: Math.max(0, prev.actionsThisTurn - cardsReturnedCount),
        selectedCardInfo: null, 
        highlightedIssues: issues,
      };
    });
  }, [toast]);

  const drawCard = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;

      const currentPlayerForUpdate = { ...prev.players[prev.currentPlayerIndex], hand: [...prev.players[prev.currentPlayerIndex].hand] };
      let newBoard = prev.gameBoard.map(row => [...row]);
      let actionsRevertedCount = 0;
      let cardsWereReturned = false;

      newBoard = newBoard.map(row =>
        row.map(cell => {
          if (cell && cell.isNewThisTurn && cell.placedByPlayerId === currentPlayerForUpdate.id) {
            currentPlayerForUpdate.hand.push({ id: cell.id, text: cell.text, categories: cell.categories });
            actionsRevertedCount++;
            cardsWereReturned = true;
            return null;
          }
          return cell;
        })
      );

      if (cardsWereReturned) {
        toast({ title: "Cards Returned", description: "Your placed cards were returned to hand before drawing." });
      }
      
      let drawnCardMessage = "Card drawn.";
      const newDeck = [...prev.deck];
      if (newDeck.length > 0) {
        const drawnCardItem = newDeck.pop()!;
        currentPlayerForUpdate.hand.push(drawnCardItem);
      } else {
        drawnCardMessage = "Deck is empty. No card drawn.";
        toast({ title: "Deck Empty", description: "No more cards to draw. Turn ends.", variant: "default" });
      }

      const updatedPlayers = prev.players.map((p, index) => index === prev.currentPlayerIndex ? currentPlayerForUpdate : p) as [Player, Player];
      
      if (currentPlayerForUpdate.hand.length === 0) {
        toast({ title: "Congratulations!", description: `${currentPlayerForUpdate.name} wins!` });
        return { 
          ...prev, 
          players: updatedPlayers,
          deck: newDeck,
          gameBoard: newBoard.map(r => r.map(c => c ? { ...c, isNewThisTurn: false, validationState: 'neutral' } : null)),
          isGameWon: true, 
          winner: currentPlayerForUpdate, 
          highlightedIssues: [],
          actionsThisTurn: 0, 
          selectedCardInfo: null,
          turnMessages: [`${drawnCardMessage} ${currentPlayerForUpdate.name} wins!`],
        };
      }

      const finalBoardAfterDraw = newBoard.map(row =>
        row.map(cell => cell ? { ...cell, isNewThisTurn: false, validationState: 'neutral' } : null)
      );

      toast({ title: "Turn Ended", description: `${drawnCardMessage} It's ${prev.players[1 - prev.currentPlayerIndex].name}'s turn.` });
      
      return {
        ...prev,
        players: updatedPlayers,
        deck: newDeck,
        gameBoard: finalBoardAfterDraw,
        currentPlayerIndex: (1 - prev.currentPlayerIndex) as 0 | 1,
        actionsThisTurn: 0, 
        selectedCardInfo: null,
        turnMessages: [`${prev.players[1 - prev.currentPlayerIndex].name}'s turn.`],
        highlightedIssues: [],
      };
    });
  }, [toast]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      if (prev.actionsThisTurn === 0 && prev.deck.length > 0) { // Allow ending turn if deck is empty even with 0 actions.
        toast({ title: "No Action Taken", description: "You must place, move, or draw a card.", variant: "destructive"});
        return prev;
      }

      const { isValid, issues } = validateBoard(prev.gameBoard);
      if (!isValid) {
        toast({ title: "Invalid Board", description: "Please fix the highlighted issues before ending turn.", variant: "destructive"});
        return { ...prev, highlightedIssues: issues };
      }

      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (currentPlayer.hand.length === 0) {
        toast({ title: "Congratulations!", description: `${currentPlayer.name} wins!` });
        return { ...prev, isGameWon: true, winner: currentPlayer, highlightedIssues: [] };
      }
      
      const newBoard = prev.gameBoard.map(row => 
        row.map(cell => cell ? { ...cell, isNewThisTurn: false, validationState: 'neutral' } : null)
      );

      toast({ title: "Turn Ended", description: `It's ${prev.players[1 - prev.currentPlayerIndex].name}'s turn.`});
      return {
        ...prev,
        gameBoard: newBoard,
        currentPlayerIndex: (1 - prev.currentPlayerIndex) as 0 | 1,
        actionsThisTurn: 0,
        selectedCardInfo: null,
        turnMessages: [`${prev.players[1 - prev.currentPlayerIndex].name}'s turn.`],
        highlightedIssues: [],
      };
    });
  }, [toast]);

  const [draggedItem, setDraggedItem] = useState<SelectedCardInfo | null>(null);

  const handleDragStart = useCallback((itemInfo: SelectedCardInfo) => {
    setDraggedItem(itemInfo);
  }, []);

  const handleDrop = useCallback((rowIndex: number, colIndex: number) => {
    if (draggedItem) {
      const originalSelectedCardInfo = gameState?.selectedCardInfo;

      setGameState(prev => {
         if (!prev || !draggedItem) return prev;
        
        const { card, source, handIndex, boardCoordinates } = draggedItem;
        
        const newBoard = prev.gameBoard.map(r => [...r]);
        let newPlayers = prev.players.map(p => ({ ...p, hand: [...p.hand] })) as [Player, Player];
        const currentPlayer = newPlayers[prev.currentPlayerIndex];
        let newActionsThisTurn = prev.actionsThisTurn;

        const targetCellCurrentContent = newBoard[rowIndex][colIndex];

        const newGridCellData: GridCell = {
          ...card,
          isNewThisTurn: true,
          placedByPlayerId: currentPlayer.id,
          validationState: 'neutral',
        };

        if (source === 'hand' && !targetCellCurrentContent) { // Placing from hand to empty cell
          newBoard[rowIndex][colIndex] = newGridCellData;
          if (handIndex !== undefined) {
            currentPlayer.hand.splice(handIndex, 1);
          }
          newActionsThisTurn++;
        } else if (source === 'board') { // Moving from board
          if (!targetCellCurrentContent) { // Moving to empty cell
            newBoard[rowIndex][colIndex] = newGridCellData;
            if (boardCoordinates) {
              newBoard[boardCoordinates.row][boardCoordinates.col] = null;
            }
            newActionsThisTurn++; // Count as an action if it's a move to a new spot
          } else if (boardCoordinates && targetCellCurrentContent) { // Swapping two cards on board
            newBoard[rowIndex][colIndex] = newGridCellData; 
            newBoard[boardCoordinates.row][boardCoordinates.col] = { 
              ...targetCellCurrentContent,
               isNewThisTurn: true, // The card being moved to original spot is also "new" for this turn
               placedByPlayerId: targetCellCurrentContent.placedByPlayerId, // Keep original placer or decide if current player "owns" it now
               validationState: 'neutral',
            };
            newActionsThisTurn++;
          }
        } else if (source === 'hand' && targetCellCurrentContent) {
           toast({ title: "Invalid Move", description: "Cannot place card from hand onto an occupied cell. Try swapping from board to board.", variant: "destructive"});
           return { ...prev, selectedCardInfo: originalSelectedCardInfo || null };
        } else {
           // Should not happen, but as a fallback
           toast({ title: "Invalid Drag Action", variant: "destructive"});
           return { ...prev, selectedCardInfo: originalSelectedCardInfo || null };
        }
        
        const { issues } = validateBoard(newBoard);

        return {
          ...prev,
          gameBoard: newBoard,
          players: newPlayers,
          selectedCardInfo: null, 
          actionsThisTurn: newActionsThisTurn,
          turnMessages: [],
          highlightedIssues: issues,
        };
      });
    }
    setDraggedItem(null);
  }, [draggedItem, gameState, toast]);


  return {
    gameState,
    newGame,
    selectCard,
    placeCardOnBoard,
    removeCardFromBoard,
    returnPlacedCardsToHand,
    drawCard,
    endTurn,
    handleDragStart,
    handleDrop,
    draggedItem, 
    setDraggedItem, 
  };
}

    