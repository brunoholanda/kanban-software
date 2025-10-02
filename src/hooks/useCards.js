import { useState, useEffect } from 'react';
import { cardsService } from '../services/cardsService';

const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar cards da API na inicialização
  useEffect(() => {
    loadCards();
  }, []);

  // Carregar cards da API
  const loadCards = async () => {
    setLoading(true);
    try {
      const cardsData = await cardsService.getAll();
      setCards(cardsData);
    } catch (error) {
      console.error('Erro ao carregar cards:', error);
      // Em caso de erro, usar dados do localStorage como fallback
      const localCards = JSON.parse(localStorage.getItem('kanban-cards') || '[]');
      setCards(localCards);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo card
  const addCard = async (newCard) => {
    setLoading(true);
    try {
      // Chamar API para criar card
      const createdCard = await cardsService.create(newCard);
      
      // Atualizar estado local
      setCards(prevCards => [...prevCards, createdCard]);
      
      // Salvar no localStorage como backup
      const updatedCards = [...cards, createdCard];
      localStorage.setItem('kanban-cards', JSON.stringify(updatedCards));
      
      return createdCard;
    } catch (error) {
      console.error('Erro ao adicionar card:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar card existente
  const updateCard = async (cardId, updatedData) => {
    setLoading(true);
    try {
      // Chamar API para atualizar card
      const updatedCard = await cardsService.update(cardId, updatedData);
      
      // Atualizar estado local
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === cardId ? updatedCard : card
        )
      );
      
      // Salvar no localStorage como backup
      const updatedCards = cards.map(card => 
        card.id === cardId ? updatedCard : card
      );
      localStorage.setItem('kanban-cards', JSON.stringify(updatedCards));
      
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Deletar card
  const deleteCard = async (cardId) => {
    setLoading(true);
    try {
      // Chamar API para deletar card
      await cardsService.delete(cardId);
      
      // Atualizar estado local
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      
      // Salvar no localStorage como backup
      const updatedCards = cards.filter(card => card.id !== cardId);
      localStorage.setItem('kanban-cards', JSON.stringify(updatedCards));
      
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Limpar todos os cards
  const clearAllCards = async () => {
    setLoading(true);
    try {
      // Deletar todos os cards individualmente via API
      for (const card of cards) {
        await cardsService.delete(card.id);
      }
      
      // Limpar estado local
      setCards([]);
      
      // Limpar localStorage
      localStorage.removeItem('kanban-cards');
      
    } catch (error) {
      console.error('Erro ao limpar cards:', error);
      throw error;
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
    loadCards // Expor função para recarregar cards
  };
};

export default useCards;
