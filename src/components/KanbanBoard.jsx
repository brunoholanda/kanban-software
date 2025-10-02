import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import FloatingAddButton from './FloatingAddButton';
import EmptyState from './EmptyState';
import ClearDataButton from './ClearDataButton';
import TopNavigation from './TopNavigation';
import ApproversFilter from './ApproversFilter';
import useCards from '../hooks/useCards';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const BoardContainer = styled.div`
  padding: 20px;
  min-height: calc(100vh - 100px);
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const KanbanColumns = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;


const columns = [
  { id: 'aberta', title: 'Aberta', color: '#52c41a' },
  { id: 'pendente-aprovacao-1', title: 'Pendente Aprovação 1', color: '#1890ff' },
  { id: 'pendente-aprovacao-2', title: 'Pendente Aprovação 2', color: '#faad14' },
  { id: 'pendente-execucao', title: 'Pendente de Execução', color: '#f5222d' },
  { id: 'concluido', title: 'Concluído', color: '#722ed1' }
];

const KanbanBoard = () => {
  const { cards, loading, addCard, updateCard, deleteCard, clearAllCards } = useCards();
  const [activeId, setActiveId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [filters, setFilters] = useState({
    approvers: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCard = cards.find(card => card.id === active.id);
    if (!activeCard) return;

    // Determinar o destino baseado no tipo de elemento sobre o qual foi solto
    let targetStatus = null;
    let targetIndex = null;
    
    // Se foi solto sobre uma coluna (droppable)
    if (columns.some(col => col.id === over.id)) {
      targetStatus = over.id;
      targetIndex = 0; // Adicionar no início da coluna
    }
    // Se foi solto sobre outro card, usar o status desse card
    else {
      const targetCard = cards.find(card => card.id === over.id);
      if (targetCard) {
        targetStatus = targetCard.status;
        // Encontrar a posição do card alvo na coluna
        const cardsInTargetColumn = cards.filter(card => card.status === targetStatus);
        targetIndex = cardsInTargetColumn.findIndex(card => card.id === over.id);
      }
    }

    if (!targetStatus) return;

    // Se o card foi solto em uma coluna diferente, atualizar status
    if (targetStatus !== activeCard.status) {
      try {
        await updateCard(activeCard.id, { status: targetStatus });
      } catch (error) {
        console.error('Error updating card status:', error);
      }
    }
  };

  const getCardsByStatus = (status) => {
    let filteredCards = cards.filter(card => card.status === status);
    
    // Aplicar filtro de aprovadores (global)
    if (filters.approvers.length > 0) {
      filteredCards = filteredCards.filter(card => 
        card.approvers.some(approver => {
          const approverName = approver.fullName || approver;
          return filters.approvers.includes(approverName);
        })
      );
    }
    
    return filteredCards;
  };

  const handleAddCard = async (newCard) => {
    try {
      await addCard(newCard);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllCards();
    } catch (error) {
      console.error('Error clearing cards:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsEditModalVisible(true);
  };

  const handleUpdateCard = async (updatedCard) => {
    try {
      await updateCard(updatedCard.id, updatedCard);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calcular estatísticas
  const getOverdueCards = () => {
    const today = new Date();
    return cards.filter(card => {
      const executionDate = new Date(card.executionForecast);
      return executionDate < today && card.status !== 'concluido';
    }).length;
  };

  const activeCard = cards.find(card => card.id === activeId);
  const overdueCards = getOverdueCards();

  // Mostrar loading durante carregamento inicial
  if (loading && cards.length === 0) {
    return (
      <AppContainer>
        <BoardContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            Carregando GMUDs...
          </div>
        </BoardContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <BoardContainer>
          <ControlsContainer>
            <TopNavigation onAddGMUD={() => setIsModalVisible(true)} />
            <ApproversFilter onFiltersChange={handleFiltersChange} />
          </ControlsContainer>
          
          {cards.length === 0 ? (
            <EmptyState />
          ) : (
            <KanbanColumns>
              {columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={getCardsByStatus(column.id)}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleEditCard}
                />
              ))}
            </KanbanColumns>
          )}
        </BoardContainer>
      
        <DragOverlay>
          {activeCard ? (
            <KanbanCard 
              card={activeCard} 
              onDelete={() => {}} 
              onEdit={() => {}} 
            />
          ) : null}
        </DragOverlay>
      
      <AddCardModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddCard={handleAddCard}
      />
      
      <EditCardModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingCard(null);
        }}
        onEditCard={handleUpdateCard}
        card={editingCard}
      />
      
      <FloatingAddButton onClick={() => setIsModalVisible(true)} />
      
        {cards.length > 0 && (
          <ClearDataButton onClearData={handleClearData} />
        )}
      </DndContext>
    </AppContainer>
  );
};

export default KanbanBoard;
