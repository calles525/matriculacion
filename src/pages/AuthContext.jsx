import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      console.log('Token encontrado en localStorage:', token); // Debug
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Verificando token con el backend...'); // Debug
        const response = await api.get('/auth/verify-token');
        console.log('Respuesta de verify-token:', response.data); // Debug
        
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('User data from localStorage:', userData); // Debug
        
        setUser({
          ...userData,
          ...response.data.user
        });
      } catch (error) {
        console.error('Error al verificar token:', error.response?.data || error.message); // Debug mejorado
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Intentando login con:', { username }); // Debug (no log password por seguridad)
      
      const response = await api.post('/auth/login', { username, password });
      console.log('Respuesta del login:', { 
        status: response.status,
        data: { 
          user: response.data.user,
          tokenPresent: !!response.data.accessToken 
        }
      }); // Debug
      
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Error completo en login:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      }); // Debug detallado
      
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error en la autenticación'
      };
    }
  };

  // ... (resto del código permanece igual)
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}