import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (username: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message?: string };
  resetDefaultPassword: () => void;
}

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'usr-1',
  username: 'admin',
  name: 'Paulina Aliaga',
  email: 'paulina@aliagapropiedades.cl',
  role: 'Administrador Principal'
};

const DEFAULT_PASS = 'pauli2026';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('pauli_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('pauli_auth_token');
  });

  // Password in localStorage with default fallback
  const getStoredPassword = (): string => {
    return localStorage.getItem('pauli_admin_password') || DEFAULT_PASS;
  };

  const login = (usernameInput: string, passInput: string): { success: boolean; message?: string } => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passInput.trim();
    const currentPass = getStoredPassword();

    const isValidUser = 
      cleanUser === 'admin' || 
      cleanUser === 'pauli' || 
      cleanUser === 'paulina@paulipropiedades.cl';

    if (!isValidUser) {
      return { success: false, message: 'Usuario no encontrado. Usa "admin" o "paulina@paulipropiedades.cl"' };
    }

    if (cleanPass !== currentPass) {
      return { success: false, message: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
    }

    const userWithLogin: AdminUser = {
      ...DEFAULT_ADMIN_USER,
      lastLogin: new Date().toLocaleString('es-CL')
    };

    setCurrentUser(userWithLogin);
    setIsAuthenticated(true);
    localStorage.setItem('pauli_auth_token', 'session-active-' + Date.now());
    localStorage.setItem('pauli_auth_user', JSON.stringify(userWithLogin));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pauli_auth_token');
    localStorage.removeItem('pauli_auth_user');
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message?: string } => {
    const currentPass = getStoredPassword();
    if (oldPass !== currentPass) {
      return { success: false, message: 'La contraseña actual ingresada es incorrecta.' };
    }
    if (newPass.length < 5) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 5 caracteres.' };
    }

    localStorage.setItem('pauli_admin_password', newPass);
    return { success: true, message: 'Contraseña actualizada exitosamente.' };
  };

  const resetDefaultPassword = () => {
    localStorage.setItem('pauli_admin_password', DEFAULT_PASS);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        changePassword,
        resetDefaultPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
