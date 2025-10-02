import React from 'react';
import styled from 'styled-components';
import { Calendar, FileText, Plus } from 'lucide-react';
import { Button } from 'antd';

const HeaderContainer = styled.header`
  background-color: #1558BC;
  color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
  font-weight: 400;
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
`;

const AddButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
  
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
`;

const Header = ({ totalCards, overdueCards, onAddGMUD }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <TitleSection>
          <TitleIcon>
            <FileText size={20} />
          </TitleIcon>
          <div>
            <TitleText>Acompanhamento de GMUDs</TitleText>
            <Subtitle>Sistema de Gestão de Mudanças</Subtitle>
          </div>
        </TitleSection>
        
        <StatsSection>
          <StatItem>
            <Calendar size={16} />
            <span>{totalCards} GMUDs</span>
          </StatItem>
          {overdueCards > 0 && (
            <StatItem style={{ backgroundColor: 'rgba(255, 87, 87, 0.2)', color: '#ff5757' }}>
              <span>⚠️ {overdueCards} Atrasadas</span>
            </StatItem>
          )}
          
          <AddButton
            type="primary"
            icon={<Plus size={16} />}
            onClick={onAddGMUD}
          >
            Adicionar GMUD
          </AddButton>
        </StatsSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
