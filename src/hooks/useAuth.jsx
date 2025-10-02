import { useState, useEffect, createContext, useContext } from 'react';
import authService from '../services/authService';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Configurar token no header das requisições
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verificar se o token ainda é válido
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          // Token inválido, limpar dados
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { access_token, user: userData } = response;
      
      // Salvar token no localStorage
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Configurar token no header das requisições
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const googleLogin = async (googleUserData) => {
    try {
      const response = await authService.googleLogin(googleUserData);
      const { access_token, user: userData } = response;
      
      // Salvar token no localStorage
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Configurar token no header das requisições
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login com Google' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!(user && token && user.id && token.length > 0);
  const isAdmin = user?.userType === 'admin';

  // Debug logs
  console.log('🔍 useAuth Debug:', {
    user: user ? { id: user.id, username: user.username, userType: user.userType } : null,
    token: token ? `${token.substring(0, 20)}...` : null,
    isAuthenticated,
    isAdmin,
    loading
  });

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      googleLogin,
      logout,
      setUser,
      setToken,
      isAuthenticated,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
