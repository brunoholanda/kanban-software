import React from 'react';
import { Button, Dropdown, Avatar, Typography } from 'antd';
import { LogOut, User } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled(Text)`
  color: white !important;
  font-weight: 500;
  font-size: 14px;
`;

const UserRole = styled(Text)`
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 12px;
`;

const LogoutButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.7);
    color: white;
  }
`;

const AppHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: 'Perfil',
      disabled: true, // Por enquanto desabilitado
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  return (
    <HeaderContainer>
      <LogoSection>
        <LogoTitle>Kanban GMUD</LogoTitle>
      </LogoSection>

      <UserSection>
        <UserInfo>
          <UserName>{user?.firstName} {user?.lastName}</UserName>
          <UserRole>@{user?.username}</UserRole>
        </UserInfo>
        
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Avatar
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
            size={40}
          >
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>
        </Dropdown>
      </UserSection>
    </HeaderContainer>
  );
};

export default AppHeader;

