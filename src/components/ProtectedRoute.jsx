import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Aguardar um pouco para garantir que o contexto seja inicializado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  console.log('🔒 ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated, 'isReady:', isReady);

  if (loading || !isReady) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔒 Usuário autenticado, renderizando conteúdo');
  return children;
};

export default ProtectedRoute;

