import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
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
  background: #eef2f7;
`;

const MainContent = styled.div`
  padding: 0;
`;

const antdTheme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 10,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    colorBgLayout: '#eef2f7',
  },
};

function App() {
  return (
    <ConfigProvider locale={ptBR} theme={antdTheme}>
      <AuthProvider>
        <Router>
          <AppContainer>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

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

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppContainer>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
