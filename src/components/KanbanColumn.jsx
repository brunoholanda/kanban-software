import React, { useState } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import ExecutionTeamFilter from './ExecutionTeamFilter';

const ColumnContainer = styled.div`
  flex: 1 0 280px;
  min-width: 280px;
  max-width: 360px;
  background: ${props => (props.$isOver ? '#eff6ff' : '#f8fafc')};
  border: 1px dashed ${props => (props.$isOver ? '#2563eb' : 'transparent')};
  border-radius: 16px;
  padding: 12px;
  box-shadow: ${props => (props.$isOver ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'inset 0 0 0 1px #e2e8f0')};
  transition: background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 230px);
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px 10px 12px;
  border-bottom: 3px solid ${props => props.$color};
`;

const ColumnTitle = styled.h3`
  margin: 0;
  color: ${props => props.$color};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
`;

const CardCount = styled.span`
  background-color: ${props => props.$color};
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
`;

const CardsList = styled.div`
  flex: 1;
  min-height: 180px;
  border-radius: 12px;
`;

const EmptyDropHint = styled.div`
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
  padding: 28px 12px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: ${props => (props.$isOver ? 'rgba(37, 99, 235, 0.06)' : 'transparent')};
`;

const KanbanColumn = ({ column, cards, onDeleteCard, onEditCard, onArchiveCard }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  });

  const [teamFilter, setTeamFilter] = useState([]);

  const filteredCards = column.id === 'pendente-execucao' && teamFilter.length > 0
    ? cards.filter(card => teamFilter.includes(card.executor))
    : cards;

  return (
    <ColumnContainer ref={setNodeRef} $isOver={isOver}>
      <ColumnHeader $color={column.color}>
        <ColumnTitle $color={column.color}>
          {column.title}
        </ColumnTitle>
        <CardCount $color={column.color}>
          {filteredCards.length}
        </CardCount>
      </ColumnHeader>

      {column.id === 'pendente-execucao' && (
        <ExecutionTeamFilter onTeamFilterChange={setTeamFilter} />
      )}

      <CardsList>
        {filteredCards.length === 0 ? (
          <EmptyDropHint $isOver={isOver}>
            {isOver ? 'Solte a GMUD aqui' : 'Arraste uma GMUD para esta coluna'}
          </EmptyDropHint>
        ) : (
          filteredCards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
              onArchive={onArchiveCard}
            />
          ))
        )}
      </CardsList>
    </ColumnContainer>
  );
};

export default KanbanColumn;
