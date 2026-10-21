import React from 'react';
import styled from 'styled-components';
import { Archive } from 'lucide-react';
import KanbanCard from './KanbanCard';

const ArchivedContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  min-height: calc(100vh - 230px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 2px 0 0;
  color: #64748b;
  font-size: 13px;
`;

const Count = styled.span`
  background: #0f172a;
  color: white;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Empty = styled.div`
  text-align: center;
  color: #64748b;
  padding: 64px 16px;
`;

const ArchivedBoard = ({ cards, onDeleteCard, onRestoreCard }) => {
  return (
    <ArchivedContainer>
      <Header>
        <TitleBlock>
          <Archive size={22} color="#0f172a" />
          <div>
            <Title>GMUDs arquivadas</Title>
            <Subtitle>Cartões removidos do quadro principal. Restaure para devolvê-los às colunas.</Subtitle>
          </div>
        </TitleBlock>
        <Count>{cards.length}</Count>
      </Header>

      {cards.length === 0 ? (
        <Empty>Nenhuma GMUD arquivada no momento.</Empty>
      ) : (
        <Grid>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              isArchivedView
              onDelete={onDeleteCard}
              onRestore={onRestoreCard}
            />
          ))}
        </Grid>
      )}
    </ArchivedContainer>
  );
};

export default ArchivedBoard;
