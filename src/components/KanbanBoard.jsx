import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { message, Spin } from 'antd';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import FloatingAddButton from './FloatingAddButton';
import ClearDataButton from './ClearDataButton';
import TopNavigation from './TopNavigation';
import ApproversFilter from './ApproversFilter';
import ArchivedBoard from './ArchivedBoard';
import useCards from '../hooks/useCards';
import { KANBAN_COLUMNS } from '../constants/columns';

const BoardShell = styled.div`
  min-height: calc(100vh - 72px);
`;

const BoardContainer = styled.div`
  padding: 20px 24px 32px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  align-items: stretch;
`;

const KanbanColumns = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 12px;
  min-height: 420px;
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 50vh;
  color: #64748b;
`;

const OverlayWrap = styled.div`
  width: 300px;
`;

const detectColumnCollision = (args) => {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) {
    return pointerHits;
  }
  return rectIntersection(args);
};

const KanbanBoard = () => {
  const { cards, loading, addCard, updateCard, deleteCard, clearAllCards } = useCards();
  const [activeId, setActiveId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [boardView, setBoardView] = useState('board');
  const [filters, setFilters] = useState({
    approvers: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeCards = useMemo(
    () => cards.filter((card) => !card.archived),
    [cards]
  );
  const archivedCards = useMemo(
    () => cards.filter((card) => card.archived),
    [cards]
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const resolveTargetStatus = (over) => {
    if (!over) return null;
    if (over.data?.current?.type === 'column') {
      return over.id;
    }
    if (KANBAN_COLUMNS.some((col) => col.id === over.id)) {
      return over.id;
    }
    const targetCard = cards.find((card) => card.id === over.id);
    return targetCard?.status || null;
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeCard = cards.find((card) => card.id === active.id);
    if (!activeCard || activeCard.archived) return;

    const targetStatus = resolveTargetStatus(over);
    if (!targetStatus || targetStatus === activeCard.status) return;

    try {
      await updateCard(activeCard.id, { status: targetStatus });
    } catch (error) {
      message.error('Não foi possível mover a GMUD. Tente novamente.');
      console.error('Error updating card status:', error);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getCardsByStatus = (status) => {
    let filteredCards = activeCards.filter((card) => card.status === status);

    if (filters.approvers.length > 0) {
      filteredCards = filteredCards.filter((card) =>
        (card.approvers || []).some((approver) => {
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
      message.success('GMUD criada com sucesso');
    } catch (error) {
      message.error('Erro ao criar a GMUD');
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
      message.success('GMUD excluída');
    } catch (error) {
      message.error('Erro ao excluir a GMUD');
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
      message.success('GMUD atualizada');
    } catch (error) {
      message.error('Erro ao atualizar a GMUD');
      console.error('Error updating card:', error);
    }
  };

  const handleArchiveCard = async (card) => {
    try {
      await updateCard(card.id, { archived: true });
      message.success('GMUD arquivada');
    } catch (error) {
      message.error('Erro ao arquivar a GMUD');
      console.error('Error archiving card:', error);
    }
  };

  const handleRestoreCard = async (card) => {
    try {
      await updateCard(card.id, { archived: false });
      message.success('GMUD restaurada para o quadro');
    } catch (error) {
      message.error('Erro ao restaurar a GMUD');
      console.error('Error restoring card:', error);
    }
  };

  const activeCard = cards.find((card) => card.id === activeId);

  if (loading && cards.length === 0) {
    return (
      <BoardShell>
        <BoardContainer>
          <LoadingWrap>
            <Spin size="large" />
            Carregando GMUDs...
          </LoadingWrap>
        </BoardContainer>
      </BoardShell>
    );
  }

  return (
    <BoardShell>
      <DndContext
        sensors={sensors}
        collisionDetection={detectColumnCollision}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <BoardContainer>
          <ControlsContainer>
            <TopNavigation
              onAddGMUD={() => setIsModalVisible(true)}
              boardView={boardView}
              onChangeView={setBoardView}
              archivedCount={archivedCards.length}
            />
            {boardView === 'board' && (
              <ApproversFilter onFiltersChange={setFilters} />
            )}
          </ControlsContainer>

          {boardView === 'archived' ? (
            <ArchivedBoard
              cards={archivedCards}
              onDeleteCard={handleDeleteCard}
              onRestoreCard={handleRestoreCard}
            />
          ) : (
            <KanbanColumns>
              {KANBAN_COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={getCardsByStatus(column.id)}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleEditCard}
                  onArchiveCard={handleArchiveCard}
                />
              ))}
            </KanbanColumns>
          )}
        </BoardContainer>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeCard ? (
            <OverlayWrap>
              <KanbanCard
                card={activeCard}
                isOverlay
                onDelete={() => {}}
                onEdit={() => {}}
              />
            </OverlayWrap>
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
    </BoardShell>
  );
};

export default KanbanBoard;
