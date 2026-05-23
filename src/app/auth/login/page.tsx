'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/forms/login-form'
import { useAuthStore } from '@/store/auth-store'
import { authService } from '@/features/auth/services/auth.service'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [rememberedEmail, setRememberedEmail] = useState<string>('')
  const [rememberMeChecked, setRememberMeChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for remember me preference on page load
    if (typeof window !== 'undefined') {
      const rememberMe = localStorage.getItem('remember_me')
      const savedEmail = localStorage.getItem('remembered_email')
      
      if (rememberMe === 'true' && savedEmail) {
        setRememberedEmail(savedEmail)
        setRememberMeChecked(true)
      }
    }
  }, [])

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      })
      
      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token)
        
        if (data.rememberMe) {
          localStorage.setItem('remember_me', 'true')
          localStorage.setItem('remembered_email', data.email)
        } else {
          localStorage.removeItem('remember_me')
          localStorage.removeItem('remembered_email')
        }
      }
      
      // Get user info to determine role
      const user = await authService.getCurrentUser()
      
      // Store user in Zustand store
      useAuthStore.getState().setUser(user)
      
      // Redirect based on user role
      const userRole = user.role
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
        rememberedEmail={rememberedEmail}
        rememberMeChecked={rememberMeChecked}
      />
    </div>
  )
}
