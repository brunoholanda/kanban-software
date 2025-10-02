import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Função para obter valor do localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler do localStorage (${key}):`, error);
      return initialValue;
    }
  };

  // Estado inicial
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva no estado
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage (${key}):`, error);
    }
  };

  // Sincroniza com mudanças no localStorage de outras abas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage (${key}):`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;

