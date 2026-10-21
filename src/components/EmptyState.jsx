import React from 'react';
import styled from 'styled-components';
import { FileText } from 'lucide-react';

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
  border-radius: 24px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
`;

const EmptyDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  max-width: 400px;
`;

const EmptyState = () => {
  return (
    <EmptyContainer>
      <EmptyIcon>
        <FileText size={32} color="#64748b" />
      </EmptyIcon>
      <EmptyTitle>Nenhuma GMUD cadastrada</EmptyTitle>
      <EmptyDescription>
        Comece criando sua primeira GMUD pelo botão Nova GMUD. Configure os aprovadores antes de cadastrar os cartões.
      </EmptyDescription>
    </EmptyContainer>
  );
};

export default EmptyState;
