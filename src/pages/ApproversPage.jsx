import React from 'react';
import styled from 'styled-components';
import { Card, Button, Typography, Space } from 'antd';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApproversManager from '../components/ApproversManager';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const InfoCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ApproversPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleBackToKanban = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderContent>
          <TitleSection>
            <TitleIcon>
              <Users size={24} />
            </TitleIcon>
            <div>
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                {isAdmin ? 'Gerenciar Aprovadores' : 'Aprovadores'}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                {isAdmin 
                  ? 'Configure os aprovadores que podem ser selecionados nas GMUDs'
                  : 'Visualize os aprovadores disponíveis para as GMUDs'
                }
              </Text>
            </div>
          </TitleSection>
          
          <BackButton
            icon={<ArrowLeft size={16} />}
            onClick={handleBackToKanban}
          >
            Voltar ao Kanban
          </BackButton>
        </HeaderContent>
      </HeaderContainer>

      <ContentContainer>
        {isAdmin && (
          <InfoCard>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} color="#1890ff" />
                <Title level={4} style={{ margin: 0 }}>
                  Como Funciona
                </Title>
              </div>
              <div style={{ paddingLeft: '28px' }}>
                <Text>
                  <strong>1.</strong> Adicione aprovadores com nome e sobrenome<br/>
                  <strong>2.</strong> Os aprovadores ficam salvos automaticamente<br/>
                  <strong>3.</strong> Eles aparecerão nas opções ao criar/editar GMUDs<br/>
                  <strong>4.</strong> Use os filtros no Kanban para filtrar por aprovadores
                </Text>
              </div>
            </Space>
          </InfoCard>
        )}

        <ApproversManager />
      </ContentContainer>
    </PageContainer>
  );
};

export default ApproversPage;

