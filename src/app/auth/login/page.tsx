'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/forms/login-form'
import { useAuthStore } from '@/store/auth-store'
import { authService } from '../../../services/auth.service'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      })
      
      // Store user in Zustand store
      useAuthStore.getState().setUser(response.user)
      
      // Store tokens (in a real app, you'd use secure storage)
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        if (data.rememberMe) {
          localStorage.setItem('remember_me', 'true')
        }
      }
      
      // Redirect based on user role
      const userRole = response.user.role
      switch (userRole) {
        case 'super_admin':
          router.push('/dashboard/super-admin/dashboard')
          break
        case 'facility_admin':
          router.push('/dashboard/facility-admin/dashboard')
          break
        case 'clinician':
          router.push('/dashboard/clinician/dashboard')
          break
        default:
          router.push('/dashboard')
      }
      
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm 
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
