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

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const { toast } = useToast();

  function initializeGame(): GameState {
    const shuffledDeck = shuffleArray(INITIAL_DECK);
    const players: [Player, Player] = [
      initialPlayer('player1', 'Player 1'),
      initialPlayer('player2', 'Player 2'),
    ];

    // Deal cards
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

  const newGame = useCallback(() => {
    setGameState(initializeGame());
    toast({ title: "New Game Started!"});
  }, [toast]);

  const selectCard = useCallback((cardInfo: SelectedCardInfo | null) => {
    setGameState(prev => ({ ...prev, selectedCardInfo: cardInfo }));
  }, []);

  const placeCardOnBoard = useCallback((rowIndex: number, colIndex: number) => {
    setGameState(prev => {
      if (!prev.selectedCardInfo) return prev;

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
      } else { // Target cell is occupied - attempt swap
        if (source === 'board' && boardCoordinates) { // Only swap board-to-board
          const cardToSwap = newBoard[rowIndex][colIndex]!;
          newBoard[rowIndex][colIndex] = { 
            ...card, 
            isNewThisTurn: true, // Moved card is considered new for this turn's validation
            placedByPlayerId: currentPlayer.id,
            validationState: 'neutral'
          };
          newBoard[boardCoordinates.row][boardCoordinates.col] = {
            ...cardToSwap,
            isNewThisTurn: true, // The swapped card is also 'new' in its new position for this turn
            placedByPlayerId: cardToSwap.placedByPlayerId, // Keep original placer or update if logic requires
            validationState: 'neutral'
          };
          newActionsThisTurn++;
        } else {
          toast({ title: "Invalid Move", description: "Cell is occupied. Drag from board to swap.", variant: "destructive" });
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
      const cardToRemove = prev.gameBoard[rowIndex][colIndex];
      if (!cardToRemove || !cardToRemove.isNewThisTurn || cardToRemove.placedByPlayerId !== prev.players[prev.currentPlayerIndex].id) {
        toast({ title: "Invalid Action", description: "Cannot remove this card.", variant: "destructive"});
        return prev;
      }

      const newBoard = prev.gameBoard.map(row => [...row]);
      newBoard[rowIndex][colIndex] = null;

      const newPlayers = prev.players.map(p => ({...p, hand: [...p.hand]})) as [Player, Player];
      const player = newPlayers[prev.currentPlayerIndex];
      // Return card to hand. For simplicity, add to end. Original index might be complex to track precisely.
      player.hand.push({ id: cardToRemove.id, text: cardToRemove.text, categories: cardToRemove.categories });
      
      const { issues } = validateBoard(newBoard);

      return {
        ...prev,
        gameBoard: newBoard,
        players: newPlayers,
        actionsThisTurn: prev.actionsThisTurn > 0 ? prev.actionsThisTurn -1 : 0, // Decrement action, ensure not negative
        highlightedIssues: issues,
      };
    });
  }, [toast]);

  const drawCard = useCallback(() => {
    setGameState(prev => {
      if (prev.deck.length === 0) {
        toast({ title: "Deck Empty", description: "No more cards to draw.", variant: "destructive"});
        return prev;
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!; // Assert pop since we checked length

      const newPlayers = prev.players.map(p => ({...p, hand: [...p.hand]})) as [Player, Player];
      const player = newPlayers[prev.currentPlayerIndex];
      player.hand.push(drawnCard);

      // Drawing a card counts as an action for turn completion
      return {
        ...prev,
        players: newPlayers,
        deck: newDeck,
        actionsThisTurn: prev.actionsThisTurn + 1, 
      };
    });
  }, [toast]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.actionsThisTurn === 0) {
        toast({ title: "No Action Taken", description: "You must place, move, or draw a card.", variant: "destructive"});
        return prev;
      }

      const { isValid, issues } = validateBoard(prev.gameBoard);
      if (!isValid) {
        toast({ title: "Invalid Board", description: "Please fix the highlighted issues before ending turn.", variant: "destructive"});
        return { ...prev, highlightedIssues: issues };
      }

      // Check for win condition
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (currentPlayer.hand.length === 0) {
        toast({ title: "Congratulations!", description: `${currentPlayer.name} wins!` });
        return { ...prev, isGameWon: true, winner: currentPlayer, highlightedIssues: [] };
      }
      
      // Reset isNewThisTurn flags on board
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

  // Handle drag state
  const [draggedItem, setDraggedItem] = useState<SelectedCardInfo | null>(null);

  const handleDragStart = useCallback((itemInfo: SelectedCardInfo) => {
    setDraggedItem(itemInfo);
    // For browser's DND API, you might need to use event.dataTransfer
  }, []);

  const handleDrop = useCallback((rowIndex: number, colIndex: number) => {
    if (draggedItem) {
      // Logic to place card from hand or move card on board
      // This combines selectCard and placeCardOnBoard logic for DND
      const originalSelectedCardInfo = gameState.selectedCardInfo;

      setGameState(prev => ({ ...prev, selectedCardInfo: draggedItem }));
      // Place card will use the new selectedCardInfo set just above
      // It's a bit of a sequence, might need refinement for direct DND update
      // For now, it simulates: select(draggedItem) then placeCardOnBoard(target)
      
      // Directly call a modified placeCardOnBoard or a new DND handler
      setGameState(prev => {
        if (!draggedItem) return prev; // Should not happen if handleDrop is called after dragStart
        const { card, source, handIndex, boardCoordinates } = draggedItem;
        
        const newBoard = prev.gameBoard.map(r => [...r]);
        let newPlayers = prev.players.map(p => ({ ...p, hand: [...p.hand] })) as [Player, Player];
        const currentPlayer = newPlayers[prev.currentPlayerIndex];
        let newActionsThisTurn = prev.actionsThisTurn;

        const targetCellCurrentContent = newBoard[rowIndex][colIndex];

        // Prepare the new cell content
        const newGridCellData: GridCell = {
          ...card,
          isNewThisTurn: true,
          placedByPlayerId: currentPlayer.id,
          validationState: 'neutral',
        };

        // Case 1: Dragging from hand OR dragging from board to an EMPTY cell
        if (source === 'hand' || (source === 'board' && !targetCellCurrentContent)) {
          newBoard[rowIndex][colIndex] = newGridCellData;
          if (source === 'hand' && handIndex !== undefined) {
            currentPlayer.hand.splice(handIndex, 1);
          } else if (source === 'board' && boardCoordinates) {
            newBoard[boardCoordinates.row][boardCoordinates.col] = null;
          }
          newActionsThisTurn++;
        }
        // Case 2: Dragging from board to an OCCUPIED cell (SWAP)
        else if (source === 'board' && boardCoordinates && targetCellCurrentContent) {
           // Only allow swap if target card is not fixed or belongs to current player (simplified: allow any swap for now)
          newBoard[rowIndex][colIndex] = newGridCellData; // Place dragged card
          newBoard[boardCoordinates.row][boardCoordinates.col] = { // Place target card in origin
            ...targetCellCurrentContent,
             isNewThisTurn: true, // The swapped card is also 'new'
             // placedByPlayerId: targetCellCurrentContent.placedByPlayerId, // Keep original ownership
          };
          newActionsThisTurn++;
        } else {
          // Drag from hand to occupied cell not allowed by this logic (must be empty)
           toast({ title: "Invalid Move", description: "Cannot place card from hand onto an occupied cell.", variant: "destructive"});
           return { ...prev, selectedCardInfo: originalSelectedCardInfo }; // Restore original selection if DND failed
        }
        
        const { issues } = validateBoard(newBoard);

        return {
          ...prev,
          gameBoard: newBoard,
          players: newPlayers,
          selectedCardInfo: null, // Clear selection after DND
          actionsThisTurn: newActionsThisTurn,
          turnMessages: [],
          highlightedIssues: issues,
        };
      });
    }
    setDraggedItem(null);
  }, [draggedItem, gameState.selectedCardInfo, toast]);


  return {
    gameState,
    newGame,
    selectCard,
    placeCardOnBoard,
    removeCardFromBoard,
    drawCard,
    endTurn,
    handleDragStart,
    handleDrop,
    draggedItem, // Expose for UI to clear if needed
    setDraggedItem, // Expose for dragOver
  };
}
