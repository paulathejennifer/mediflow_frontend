'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
  error?: string
  rememberedEmail?: string
  rememberMeChecked?: boolean
}

export function LoginForm({ onSubmit, isLoading = false, error, rememberedEmail, rememberMeChecked }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: rememberedEmail || '',
    password: '',
    rememberMe: rememberMeChecked || false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const router = useRouter()

  useEffect(() => {
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
    }
    if (rememberMeChecked) {
      setFormData(prev => ({ ...prev, rememberMe: rememberMeChecked }))
    }
  }, [rememberedEmail, rememberMeChecked])

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center gap-3">
        <Image 
          src="/images/logo(1).png" 
          alt="MediFlow" 
          width={70} 
          height={70}
          className="h-10 w-10"
        />
        <h1 className="text-2xl font-bold text-white">MediFlow</h1>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-[hsl(var(--primary))]/20 p-6">
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-center text-white">
            Sign In
          </h2>
          <p className="text-center text-gray-300">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus:bg-gray-700 ${fieldErrors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus:bg-gray-700 ${fieldErrors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-primary hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked: boolean) => handleInputChange('rememberMe', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm text-gray-200">
                Remember me
              </Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm"
              disabled={isLoading}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-gray-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        {/* <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm"
            disabled={isLoading}
          >
            Sign up
          </Button>
        </div> */}
      </div>
    </div>
  )
}
