'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>
  isLoading?: boolean
  error?: string
  success?: boolean
}

export function ResetPasswordForm({ onSubmit, isLoading = false, error, success }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({})
  const router = useRouter()

  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  const handleInputChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {}
    const requirements = getPasswordRequirements(formData.newPassword)

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (!requirements.minLength) {
      errors.newPassword = 'Password must be at least 8 characters'
    } else if (!requirements.hasUpper) {
      errors.newPassword = 'Password must contain at least one uppercase letter'
    } else if (!requirements.hasLower) {
      errors.newPassword = 'Password must contain at least one lowercase letter'
    } else if (!requirements.hasNumber) {
      errors.newPassword = 'Password must contain at least one number'
    } else if (!requirements.hasSpecial) {
      errors.newPassword = 'Password must contain at least one special character'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  const handleBackToLogin = () => {
    router.push('/auth/login')
  }

  const requirements = getPasswordRequirements(formData.newPassword)

  if (success) {
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
              Password Reset Successful
            </h2>
            <p className="text-center text-gray-300">
              Your password has been successfully reset
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-medium">All done!</p>
                <p className="text-gray-400 text-sm">
                  You can now sign in with your new password
                </p>
              </div>
            </div>
            <Button
              onClick={handleBackToLogin}
              className="w-full text-gray-900"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
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
            Reset Password
          </h2>
          <p className="text-center text-gray-300">
            Enter your new password below
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-200">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus:bg-gray-700 ${fieldErrors.newPassword ? 'border-red-500' : ''}`}
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
            {fieldErrors.newPassword && (
              <p className="text-sm text-red-500">{fieldErrors.newPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="space-y-1 p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center text-xs">
                <span className={`mr-2 ${requirements.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                  {requirements.minLength ? '✓' : '○'}
                </span>
                <span className={`${requirements.minLength ? 'text-green-500' : 'text-gray-400'}`}>At least 8 characters</span>
              </div>
              <div className="flex items-center text-xs">
                <span className={`mr-2 ${requirements.hasUpper ? 'text-green-500' : 'text-gray-500'}`}>
                  {requirements.hasUpper ? '✓' : '○'}
                </span>
                <span className={`${requirements.hasUpper ? 'text-green-500' : 'text-gray-400'}`}>One uppercase letter</span>
              </div>
              <div className="flex items-center text-xs">
                <span className={`mr-2 ${requirements.hasLower ? 'text-green-500' : 'text-gray-500'}`}>
                  {requirements.hasLower ? '✓' : '○'}
                </span>
                <span className={`${requirements.hasLower ? 'text-green-500' : 'text-gray-400'}`}>One lowercase letter</span>
              </div>
              <div className="flex items-center text-xs">
                <span className={`mr-2 ${requirements.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                  {requirements.hasNumber ? '✓' : '○'}
                </span>
                <span className={`${requirements.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>One number</span>
              </div>
              <div className="flex items-center text-xs">
                <span className={`mr-2 ${requirements.hasSpecial ? 'text-green-500' : 'text-gray-500'}`}>
                  {requirements.hasSpecial ? '✓' : '○'}
                </span>
                <span className={`${requirements.hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>One special character</span>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus:bg-gray-700 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-primary hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
            )}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          {/* Back to Login */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToLogin}
            className="w-full text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  )
}
