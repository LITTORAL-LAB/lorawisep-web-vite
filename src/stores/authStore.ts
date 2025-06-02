import { AuthService, UserData } from '@/lib/api';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, errorMessage?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  register: (nome: string, email: string, senha: string, errorMessage: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password, errorMessage = "Login failed") => {
    set({ isLoading: true, error: null });

    try {
      const tokens = await AuthService.login({ username: email, password });
      localStorage.setItem('access_token', tokens.access_token);
      
      const user = await AuthService.getCurrentUser();
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      localStorage.removeItem('access_token');
      set({ isAuthenticated: false, user: null, isLoading: false });
      throw error;
    }
  },

  register: async (nome: string, email: string, senha: string, errorMessage: string) => {
    set({ isLoading: true, error: null });

    try {
      await AuthService.register({ nome, email, senha });
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

}));