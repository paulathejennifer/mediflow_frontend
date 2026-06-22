import apiClient from '@/lib/axios'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  gender?: string
  role: 'super_admin' | 'facility_admin' | 'clinician' | 'patient'
  facility_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
  lastLogin?: string | null
}

export interface CreateUserRequest {
  first_name: string
  last_name: string
  email: string
  phone?: string        // ← add ? to make it optional
  gender?: string
  password: string
  role: 'super_admin' | 'facility_admin' | 'clinician' | 'patient'
  facility_id?: number
  is_active?: boolean
}

export interface UpdateUserRequest {
  first_name?: string
  phone?: string
  is_active?: boolean
}

export const userService = {
  createUser: async (data: CreateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.post('/users/', data)
      return response.data
    } catch (error: any) {
      console.error('Create user error:', error.response?.status, error.response?.data)
      throw error
    }
  },

  getUsers: async (params?: {
    skip?: number
    limit?: number
    role?: string
    facility_id?: number
  }): Promise<User[]> => {
    const response = await apiClient.get('/users/', { params })
    return response.data
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  updateUser: async (
    userId: number,
    data: UpdateUserRequest
  ): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, data)
    return response.data
  },
}
