import { LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, User } from '@/types/auth'
import apiClient from '@/lib/axios'

// Data Abstraction Layer - Switch between mock and real API here
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true'

// Mock Data
const mockUser: User = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@mediflow.com',
  role: 'super_admin',
  is_active: true,
  email_verified: true,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
}

const mockLoginResponse: LoginResponse = {
  access_token: 'mock-access-token-12345',
  refresh_token: 'mock-refresh-token-67890',
  user: mockUser,
}

// Mock Service Functions
const mockLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Define mock users with their passwords
  const mockUsersWithPasswords = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@mediflow.com',
      role: 'super_admin' as const,
      password: 'password',
      is_active: true,
      email_verified: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@mediflow.com',
      role: 'facility_admin' as const,
      facility_id: 'facility-1',
      password: 'password123',
      is_active: true,
      email_verified: true,
      created_at: '2024-01-20T14:15:00Z',
      updated_at: '2024-01-20T14:15:00Z',
    },
    {
      id: '3',
      first_name: 'Robert',
      last_name: 'Johnson',
      email: 'robert.johnson@mediflow.com',
      role: 'clinician' as const,
      facility_id: 'facility-1',
      password: 'clinician123',
      is_active: true,
      email_verified: true,
      created_at: '2024-02-01T09:00:00Z',
      updated_at: '2024-02-01T09:00:00Z',
    }
  ]
  
  // Find user by email and password
  const user = mockUsersWithPasswords.find(
    u => u.email === data.email && u.password === data.password
  )
  
  if (user) {
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    return {
      access_token: `mock-access-token-${user.id}`,
      refresh_token: `mock-refresh-token-${user.id}`,
      user: userWithoutPassword,
    }
  }
  
  throw new Error('Invalid credentials')
}

const mockRegister = async (data: RegisterRequest): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    ...mockUser,
    id: Math.random().toString(36).substr(2, 9),
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    role: data.role || 'clinician',
  }
}

const mockForgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Mock email sending
}

const mockResetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Mock password reset
}

const mockChangePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Mock password change
}

const mockGetCurrentUser = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockUser
}

const mockLogout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  // Mock logout - clear tokens
}

const mockValidateToken = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  // Mock token validation - in real app would verify with server
}

// Real API Service Functions
const apiLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/v1/auth/login', data)
  return response.data
}

const apiRegister = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post('/api/v1/auth/register', data)
  return response.data
}

const apiForgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await apiClient.post('/api/v1/auth/forgot-password', data)
}

const apiResetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post('/api/v1/auth/reset-password', data)
}

const apiChangePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.post('/api/v1/auth/change-password', data)
}

const apiGetCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/api/v1/auth/me')
  return response.data
}

const apiLogout = async (): Promise<void> => {
  await apiClient.post('/api/v1/auth/logout')
}

const apiValidateToken = async (): Promise<void> => {
  await apiClient.get('/api/v1/auth/validate-token')
}

// Export Service Functions - These automatically switch between mock and real API
export const authService = {
  login: USE_MOCK_DATA ? mockLogin : apiLogin,
  register: USE_MOCK_DATA ? mockRegister : apiRegister,
  forgotPassword: USE_MOCK_DATA ? mockForgotPassword : apiForgotPassword,
  resetPassword: USE_MOCK_DATA ? mockResetPassword : apiResetPassword,
  changePassword: USE_MOCK_DATA ? mockChangePassword : apiChangePassword,
  getCurrentUser: USE_MOCK_DATA ? mockGetCurrentUser : apiGetCurrentUser,
  logout: USE_MOCK_DATA ? mockLogout : apiLogout,
  validateToken: USE_MOCK_DATA ? mockValidateToken : apiValidateToken,
}

// Helper function to switch between mock and real API
export const setUseMockData = (useMock: boolean) => {
  // This can be used to dynamically switch between mock and real API
  // In a real implementation, you might use a context or state management
  if (useMock) {
    authService.login = mockLogin
    authService.register = mockRegister
    authService.forgotPassword = mockForgotPassword
    authService.resetPassword = mockResetPassword
    authService.changePassword = mockChangePassword
    authService.getCurrentUser = mockGetCurrentUser
    authService.logout = mockLogout
    authService.validateToken = mockValidateToken
  } else {
    authService.login = apiLogin
    authService.register = apiRegister
    authService.forgotPassword = apiForgotPassword
    authService.resetPassword = apiResetPassword
    authService.changePassword = apiChangePassword
    authService.getCurrentUser = apiGetCurrentUser
    authService.logout = apiLogout
    authService.validateToken = apiValidateToken
  }
}
