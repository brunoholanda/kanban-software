import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin, Divider } from 'antd';
import { User, Lock, LogIn } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #4f46e5 100%);
  padding: 20px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: none;

  .ant-card-body {
    padding: 40px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%);
  border-radius: 50%;
  margin: 0 auto 16px;
  color: white;
`;

const FormTitle = styled(Title)`
  margin: 0 !important;
  color: #262626;
  font-weight: 600;
`;

const FormSubtitle = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    
    &:hover, &:focus {
      border-color: #1890ff;
    }
  }

  .ant-btn {
    height: 48px;
    border-radius: 8px;
    font-weight: 500;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  background: linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
  }
`;

const GoogleButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #d9d9d9;
  background: white;
  color: #262626;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, googleLogin, setUser, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleResponse = async (response) => {
      setLoading(true);
      setError('');

      try {
        // Decodificar o JWT token do Google
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const googleUserData = {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          picture: payload.picture,
        };

        const result = await googleLogin(googleUserData);
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      } catch {
        setError('Erro ao fazer login com Google. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    // Carregar o script do Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [googleLogin, navigate]);

  const handleGoogleLogin = () => {
    // Usar a variável de ambiente para a URL do backend (com fallback)
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kanban.api.brunoholanda.com';
    const backendUrl = `${API_BASE_URL}/auth/google`;
    
    console.log('🚀 Iniciando login com Google...');
    console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    console.log('🌐 Backend URL:', backendUrl);
    
    // Verificar se a URL está correta
    if (!backendUrl.includes('kanban.api.brunoholanda.com')) {
      console.error('❌ URL incorreta! Deveria conter kanban.api.brunoholanda.com');
      console.error('❌ URL atual:', backendUrl);
      setError('Erro de configuração: URL do backend incorreta');
      return;
    }
    
    // Abrir popup
    console.log('🔍 Tentando abrir popup com URL:', backendUrl);
    const popup = window.open(
      backendUrl,
      'googleAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );
    
    // Verificar se o popup foi aberto
    if (!popup || popup.closed || typeof popup.closed == 'undefined') {
      console.error('❌ Popup foi bloqueado pelo navegador!');
      setError('Popup foi bloqueado pelo navegador. Permita popups para este site.');
      return;
    }
    
    console.log('✅ Popup aberto com sucesso');
    
    // Verificar a URL do popup após um pequeno delay
    setTimeout(() => {
      try {
        console.log('🔍 URL atual do popup:', popup.location.href);
      } catch (e) {
        console.log('⚠️ Não foi possível acessar a URL do popup (cross-origin):', e.message);
      }
    }, 1000);
    
    // Escutar mensagem do popup
    const messageListener = (event) => {
      console.log('📨 Mensagem recebida:', event);
      console.log('📍 Origin:', event.origin);
      console.log('📋 Data:', event.data);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://kanban.api.brunoholanda.com';
      if (event.origin !== apiUrl) {
        console.log('❌ Origin não autorizada:', event.origin);
        console.log('🎯 Origin esperada:', apiUrl);
        return;
      }
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log('✅ Login com Google bem-sucedido!');
        const { access_token, user } = event.data;
        
        console.log('🔑 Token:', access_token);
        console.log('👤 Usuário:', user);
        
        // Usar o método do contexto para fazer login
        try {
          // Simular o processo de login usando o contexto
          localStorage.setItem('token', access_token);
          setToken(access_token); // Atualizar token no contexto
          setUser(user); // Atualizar usuário no contexto
          
          // Configurar token no header das requisições
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          console.log('💾 Token salvo no localStorage');
          console.log('🔑 Token atualizado no contexto');
          console.log('👤 Usuário definido no contexto');
          console.log('🌐 Token configurado no header das requisições');
          
          // Pequeno delay para garantir que o contexto seja atualizado
          setTimeout(() => {
            navigate('/');
            console.log('🏠 Redirecionando para página inicial...');
          }, 100);
          
        } catch (error) {
          console.error('❌ Erro ao processar login:', error);
          setError('Erro ao processar login. Tente novamente.');
        }
        
        popup.close();
        window.removeEventListener('message', messageListener);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        console.log('❌ Erro no login com Google:', event.data.error);
        setError(event.data.error);
        popup.close();
        window.removeEventListener('message', messageListener);
      }
    };
    
    window.addEventListener('message', messageListener);
    
    // Fechar popup se usuário fechar manualmente
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log('🔒 Popup fechado pelo usuário');
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  };

  // Função de login tradicional comentada - apenas Google OAuth disponível
  
  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(values);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <LoginContainer>
      <LoginCard>
        <HeaderSection>
          <LogoIcon>
            <LogIn size={32} />
          </LogoIcon>
          <FormTitle level={2}>Kanban GMUD</FormTitle>
          <FormSubtitle>Faça login para acessar o sistema</FormSubtitle>
        </HeaderSection>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Formulário de login tradicional comentado - apenas Google OAuth disponível */}
        
        <StyledForm
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Por favor, insira seu usuário!' },
            ]}
          >
            <Input
              prefix={<User size={16} />}
              placeholder="Usuário"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor, insira sua senha!' },
            ]}
          >
            <Input.Password
              prefix={<Lock size={16} />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LogIn size={16} />}
            >
              Entrar
            </LoginButton>
          </Form.Item>
        </StyledForm>

        <Divider>ou</Divider>
        

        {/* Aviso sobre email corporativo */}
        <Alert
          message="Acesso Restrito"
          description="Somente emails corporativos podem fazer login no sistema."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <GoogleButton
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </GoogleButton>

      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;

