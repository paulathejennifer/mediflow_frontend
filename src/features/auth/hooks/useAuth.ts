import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { getDefaultRoute } from '@/constants/routes'

export function useAuth() {
  const router = useRouter()
  const { user, isLoading, login, logout, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      const defaultRoute = getDefaultRoute(user?.role || 'clinician')
      router.push(defaultRoute)
    } catch (error) {
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    checkAuth
  }
}
