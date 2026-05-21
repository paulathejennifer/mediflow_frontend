export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'super_admin' | 'facility_admin' | 'clinician' | 'patient'
  facility_id?: number
  is_active: boolean
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
  token_type: string
  user: User
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  role?: 'super_admin' | 'facility_admin' | 'clinician' | 'patient'
  facility_id?: number
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  token_type: string
}
