import React from 'react';
import styled from 'styled-components';
import { Button, Badge } from 'antd';
import { Users, Plus, LayoutGrid, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavigationContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 4px 14px;
  font-weight: 600;
  border-radius: 10px;
`;

const TopNavigation = ({ onAddGMUD, boardView, onChangeView, archivedCount = 0 }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <NavigationContainer>
      <NavButton
        type="primary"
        icon={<Plus size={15} />}
        onClick={onAddGMUD}
      >
        Nova GMUD
      </NavButton>
      <NavButton
        type={boardView === 'board' ? 'primary' : 'default'}
        icon={<LayoutGrid size={15} />}
        onClick={() => onChangeView?.('board')}
      >
        Quadro
      </NavButton>
      <Badge count={archivedCount} color="#0f172a" offset={[-4, 4]}>
        <NavButton
          type={boardView === 'archived' ? 'primary' : 'default'}
          icon={<Archive size={15} />}
          onClick={() => onChangeView?.('archived')}
        >
          Arquivadas
        </NavButton>
      </Badge>
      <NavButton
        type="default"
        icon={<Users size={15} />}
        onClick={() => navigate('/approvers')}
      >
        {isAdmin ? 'Gerenciar Aprovadores' : 'Ver Aprovadores'}
      </NavButton>
    </NavigationContainer>
  );
};

export default TopNavigation;
