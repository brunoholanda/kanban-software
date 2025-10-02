import React from 'react';
import styled from 'styled-components';
import { FileText, Plus } from 'lucide-react';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  text-align: center;
  padding: 40px 20px;
  flex: 1;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #595959;
  font-size: 18px;
  font-weight: 600;
`;

const EmptyDescription = styled.p`
  margin: 0 0 24px 0;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 1.5;
  max-width: 400px;
`;

const EmptyState = () => {
  return (
    <EmptyContainer>
      <EmptyIcon>
        <FileText size={32} color="#8c8c8c" />
      </EmptyIcon>
      <EmptyTitle>Nenhuma GMUD cadastrada</EmptyTitle>
      <EmptyDescription>
        Comece criando sua primeira GMUD clicando no botão <Plus size={16} style={{ display: 'inline', margin: '0 4px' }} /> no canto inferior direito.
        <br />
        <br />
        <strong>Dica:</strong> Configure os aprovadores clicando em "Gerenciar Aprovadores" acima das colunas antes de criar sua primeira GMUD.
      </EmptyDescription>
    </EmptyContainer>
  );
};

export default EmptyState;

