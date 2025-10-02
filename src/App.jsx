import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/LoginPage';
import ApproversPage from './pages/ApproversPage';
import KanbanBoard from './components/KanbanBoard';
import styled from 'styled-components';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.div`
  padding: 0;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Routes>
            {/* Rota de login - não protegida */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppHeader />
                <MainContent>
                  <KanbanBoard />
                </MainContent>
              </ProtectedRoute>
            } />
            
            <Route path="/approvers" element={
              <ProtectedRoute>
                <AppHeader />
                <MainContent>
                  <ApproversPage />
                </MainContent>
              </ProtectedRoute>
            } />
            
            {/* Redirecionar rotas não encontradas para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
