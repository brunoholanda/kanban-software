import React from 'react';
import { Dropdown, Avatar, Typography } from 'antd';
import { LogOut, User, LayoutGrid } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #4f46e5 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
  position: sticky;
  top: 0;
  z-index: 20;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoMark = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoCopy = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const LogoSubtitle = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
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
  font-weight: 600;
  font-size: 14px;
`;

const UserRole = styled(Text)`
  color: rgba(255, 255, 255, 0.75) !important;
  font-size: 12px;
`;

const AppHeader = () => {
  const { user, logout } = useAuth();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: 'Perfil',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sair',
      onClick: logout,
    },
  ];

  return (
    <HeaderContainer>
      <LogoSection>
        <LogoMark>
          <LayoutGrid size={18} />
        </LogoMark>
        <LogoCopy>
          <LogoTitle>Kanban GMUD</LogoTitle>
          <LogoSubtitle>Gestão de mudanças e aprovações</LogoSubtitle>
        </LogoCopy>
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
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: 'white',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.28)',
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
