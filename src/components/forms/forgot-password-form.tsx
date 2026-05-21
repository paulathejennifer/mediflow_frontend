'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ForgotPasswordFormData {
  email: string
}

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
  isLoading?: boolean
  error?: string
  success?: boolean
}

export function ForgotPasswordForm({ onSubmit, isLoading = false, error, success }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({})
  const router = useRouter()

  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ForgotPasswordFormData, string>> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
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
            Forgot Password
          </h2>
          <p className="text-center text-gray-300">
            {success 
              ? 'Verification code sent successfully'
              : 'Enter your email to receive a verification code'
            }
          </p>
        </div>
        {success ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-medium">Check your email</p>
                <p className="text-gray-400 text-sm">
                  We've sent a 6-digit verification code to <span className="text-white font-medium">{formData.email}</span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/auth/verify-code?email=${formData.email}`)}
              className="w-full"
              disabled={isLoading}
            >
              Enter Verification Code
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToLogin}
              className="w-full"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        ) : (
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-gray-900"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>

            {/* Back to Login */}
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToLogin}
              className="w-full text-gray-400 hover:text-white hover:bg-transparent"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
