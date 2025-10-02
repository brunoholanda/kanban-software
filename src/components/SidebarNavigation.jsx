import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const TopNavigation = () => {
  const navigate = useNavigate();

  const handleNavigateToApprovers = () => {
    navigate('/approvers');
  };

  return (
    <NavigationContainer>
      <NavButton
        type="primary"
        icon={<Users size={14} />}
        onClick={handleNavigateToApprovers}
      >
        Gerenciar Aprovadores
      </NavButton>
    </NavigationContainer>
  );
};

export default TopNavigation;
