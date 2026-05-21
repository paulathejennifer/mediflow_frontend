import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserRole } from '../constants/roles'
import { authService } from '../services/auth.service'
import { User } from '../types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          const { user, access_token, refresh_token } = response
          
          // Store tokens in localStorage
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch (error) {
        } finally {
          // Clear tokens from localStorage
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      checkAuth: async () => {
        const { user } = get()
        if (user) {
          // User is already in state, validate token
          try {
            await authService.getCurrentUser()
            set({ isAuthenticated: true })
          } catch (error) {
            // Token is invalid, clear state
            set({
              user: null,
              isAuthenticated: false
            })
          }
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...userData }
          })
        }
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
