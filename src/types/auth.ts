export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'super_admin' | 'facility_admin' | 'clinician'
  facility_id?: string
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  role?: 'super_admin' | 'facility_admin' | 'clinician'
  facility_id?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}
