export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Administrador Principal' | 'Corredor Senior';
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
}
