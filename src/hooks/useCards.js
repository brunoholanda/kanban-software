import { useState, useEffect } from 'react';
import { cardsService } from '../services/cardsService';

const persistLocal = (nextCards) => {
  localStorage.setItem('kanban-cards', JSON.stringify(nextCards));
};

const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const cardsData = await cardsService.getAll();
      setCards(cardsData);
    } catch (error) {
      console.error('Erro ao carregar cards:', error);
      const localCards = JSON.parse(localStorage.getItem('kanban-cards') || '[]');
      setCards(localCards);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (newCard) => {
    const createdCard = await cardsService.create(newCard);
    setCards((prevCards) => {
      const updatedCards = [...prevCards, createdCard];
      persistLocal(updatedCards);
      return updatedCards;
    });
    return createdCard;
  };

  const updateCard = async (cardId, updatedData) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updatedData } : card
      )
    );

    try {
      const updatedCard = await cardsService.update(cardId, updatedData);
      setCards((prevCards) => {
        const nextCards = prevCards.map((card) =>
          card.id === cardId ? updatedCard : card
        );
        persistLocal(nextCards);
        return nextCards;
      });
      return updatedCard;
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      await loadCards();
      throw error;
    }
  };

  const deleteCard = async (cardId) => {
    await cardsService.delete(cardId);
    setCards((prevCards) => {
      const updatedCards = prevCards.filter((card) => card.id !== cardId);
      persistLocal(updatedCards);
      return updatedCards;
    });
  };

  const clearAllCards = async () => {
    setLoading(true);
    try {
      for (const card of cards) {
        await cardsService.delete(card.id);
      }
      setCards([]);
      localStorage.removeItem('kanban-cards');
    } finally {
      setLoading(false);
    }
  };

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    clearAllCards,
    loadCards,
  };
};

export default useCards;
