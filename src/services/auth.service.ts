import { LoginRequest, LoginResponse, RegisterRequest, ChangePasswordRequest, User } from '@/types/auth'
import apiClient from '@/lib/axios'

// API Service Functions
export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data)
    return response.data
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<{ message: string; valid: boolean }> => {
    const response = await apiClient.post('/auth/verify-code', data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', data)
    return response.data
  },
}
