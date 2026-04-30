/**
 * Authentication Store
 * 
 * Simple authentication store for notification system integration.
 * This would typically integrate with your existing auth system.
 */

import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  role: 'super_admin' | 'facility_admin' | 'clinician';
  first_name?: string;
  last_name?: string;
  facility_id?: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  user: null,
  isAuthenticated: false,
  
  setAuth: (token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    set({ token, user, isAuthenticated: true });
  },
  
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    set({ token: null, user: null, isAuthenticated: false });
  }
}));
