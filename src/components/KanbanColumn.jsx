import React, { useState } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import ExecutionTeamFilter from './ExecutionTeamFilter';

const ColumnContainer = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.color};
`;

const ColumnTitle = styled.h3`
  margin: 0;
  color: ${props => props.color};
  font-size: 16px;
  font-weight: 600;
`;

const CardCount = styled.span`
  margin-left: 8px;
  background-color: ${props => props.color};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const CardsList = styled.div`
  min-height: 200px;
  transition: background-color 0.2s ease;
`;

const KanbanColumn = ({ column, cards, onDeleteCard, onEditCard, onTeamFilterChange }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [teamFilter, setTeamFilter] = useState([]);

  const handleTeamFilterChange = (teams) => {
    setTeamFilter(teams);
    if (onTeamFilterChange) {
      onTeamFilterChange(teams);
    }
  };

  // Filtrar cards por time se for a coluna de execução
  const filteredCards = column.id === 'pendente-execucao' && teamFilter.length > 0
    ? cards.filter(card => teamFilter.includes(card.executor))
    : cards;

  return (
    <ColumnContainer>
      <ColumnHeader color={column.color}>
        <ColumnTitle color={column.color}>
          {column.title}
        </ColumnTitle>
        <CardCount color={column.color}>
          {filteredCards.length}
        </CardCount>
      </ColumnHeader>
      
      {/* Mostrar filtro de time apenas na coluna de execução */}
      {column.id === 'pendente-execucao' && (
        <ExecutionTeamFilter onTeamFilterChange={handleTeamFilterChange} />
      )}
      
      <SortableContext items={filteredCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <CardsList
          ref={setNodeRef}
          style={{
            backgroundColor: isOver ? '#f0f0f0' : 'transparent',
            borderRadius: '4px',
            minHeight: '200px'
          }}
        >
          {filteredCards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
            />
          ))}
        </CardsList>
      </SortableContext>
    </ColumnContainer>
  );
};

export default KanbanColumn;
