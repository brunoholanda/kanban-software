import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavigationContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  height: 32px;
  padding: 4px 12px;
`;

const TopNavigation = ({ onAddGMUD }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleNavigateToApprovers = () => {
    navigate('/approvers');
  };

  return (
    <NavigationContainer>
      <NavButton
        type="primary"
        icon={<Plus size={14} />}
        onClick={onAddGMUD}
      >
        Nova GMUD
      </NavButton>
      <NavButton
        type="default"
        icon={<Users size={14} />}
        onClick={handleNavigateToApprovers}
      >
        {isAdmin ? 'Gerenciar Aprovadores' : 'Ver Aprovadores'}
      </NavButton>
    </NavigationContainer>
  );
};

export default TopNavigation;
