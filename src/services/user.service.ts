import { User } from '@/types/auth'
import apiClient from '@/lib/axios'

// Data Abstraction Layer - Switch between mock and real API here
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true'

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@mediflow.com',
    role: 'super_admin',
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
    role: 'facility_admin',
    facility_id: 'facility-1',
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
    role: 'clinician',
    facility_id: 'facility-1',
    is_active: true,
    email_verified: true,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z',
  }
]

// Mock Service Functions
const mockGetUserById = async (userId: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const user = mockUsers.find(u => u.id === userId)
  if (!user) {
    throw new Error('User not found')
  }
  
  return user
}

const mockGetUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockUsers
}

const mockUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updated_at: new Date().toISOString() }
  return mockUsers[userIndex]
}

const mockDeleteUser = async (userId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  mockUsers.splice(userIndex, 1)
}

// Real API Service Functions
const apiGetUserById = async (userId: string): Promise<User> => {
  const response = await apiClient.get(`/api/v1/users/${userId}`)
  return response.data
}

const apiGetUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/api/v1/users')
  return response.data
}

const apiUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const response = await apiClient.put(`/api/v1/users/${userId}`, updates)
  return response.data
}

const apiDeleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/users/${userId}`)
}

// Export Service Functions - These automatically switch between mock and real API
export const userService = {
  getUserById: USE_MOCK_DATA ? mockGetUserById : apiGetUserById,
  getUsers: USE_MOCK_DATA ? mockGetUsers : apiGetUsers,
  updateUser: USE_MOCK_DATA ? mockUpdateUser : apiUpdateUser,
  deleteUser: USE_MOCK_DATA ? mockDeleteUser : apiDeleteUser,
}

// Helper function to switch between mock and real API
export const setUseMockUserData = (useMock: boolean) => {
  // This can be used to dynamically switch between mock and real API
  // In a real implementation, you might use a context or state management
  if (useMock) {
    userService.getUserById = mockGetUserById
    userService.getUsers = mockGetUsers
    userService.updateUser = mockUpdateUser
    userService.deleteUser = mockDeleteUser
  } else {
    userService.getUserById = apiGetUserById
    userService.getUsers = apiGetUsers
    userService.updateUser = apiUpdateUser
    userService.deleteUser = apiDeleteUser
  }
}
