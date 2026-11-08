import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { AdminUser } from '../types/auth';
import { supabase } from '../lib/supabase';

type AuthResult = { success: boolean; message?: string };

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<AuthResult>;
}

const NOT_CONFIGURED_MESSAGE = 'El acceso no está disponible: Supabase no está configurado.';

const toAdminUser = (user: User): AdminUser => ({
  id: user.id,
  username: user.email || '',
  name: 'Paulina Aliaga',
  email: user.email || '',
  role: 'Administrador Principal',
  lastLogin: user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString('es-CL')
    : undefined
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Restos del login anterior, que guardaba la contraseña en el navegador.
    ['pauli_auth_token', 'pauli_auth_user', 'pauli_admin_password'].forEach(key =>
      localStorage.removeItem(key)
    );

    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? toAdminUser(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResult> => {
    if (!supabase) return { success: false, message: NOT_CONFIGURED_MESSAGE };

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass
    });
    if (error) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
      await supabase.auth.signOut();
      return { success: false, message: 'Esta cuenta no tiene permisos de administrador.' };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase?.auth.signOut();
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<AuthResult> => {
    if (!supabase) return { success: false, message: NOT_CONFIGURED_MESSAGE };
    if (!currentUser) return { success: false, message: 'Tu sesión expiró. Inicia sesión nuevamente.' };
    if (newPass.length < 8) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: oldPass
    });
    if (verifyError) {
      return { success: false, message: 'La contraseña actual ingresada es incorrecta.' };
    }

    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      return { success: false, message: `No se pudo actualizar la contraseña: ${error.message}` };
    }
    return { success: true, message: 'Contraseña actualizada exitosamente.' };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        currentUser,
        login,
        logout,
        changePassword
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
