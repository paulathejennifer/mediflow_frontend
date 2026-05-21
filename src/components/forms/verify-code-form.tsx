'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, ArrowLeft, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface VerifyCodeFormData {
  code: string
}

interface VerifyCodeFormProps {
  onSubmit: (data: VerifyCodeFormData) => Promise<void>
  onResendCode?: () => Promise<void>
  isLoading?: boolean
  error?: string
  email?: string
}

export function VerifyCodeForm({ onSubmit, onResendCode, isLoading = false, error, email }: VerifyCodeFormProps) {
  const [formData, setFormData] = useState<VerifyCodeFormData>({
    code: ''
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof VerifyCodeFormData, string>>>({})
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || email || ''

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, canResend])

  const handleInputChange = (field: keyof VerifyCodeFormData, value: string) => {
    // Only allow numbers and max 6 digits
    if (value && !/^\d*$/.test(value)) return
    if (value.length > 6) return
    
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof VerifyCodeFormData, string>> = {}

    if (!formData.code) {
      errors.code = 'Verification code is required'
    } else if (formData.code.length !== 6) {
      errors.code = 'Please enter the 6-digit code'
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

  const handleResendCode = async () => {
    setCountdown(60)
    setCanResend(false)
    if (onResendCode) {
      await onResendCode()
    }
  }

  const handleBackToForgot = () => {
    router.push('/auth/forgot-password')
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
            Verify Code
          </h2>
          <p className="text-center text-gray-300">
            Enter the 6-digit code sent to <span className="text-white font-medium">{emailFromUrl}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Verification Code Field */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-gray-200">Verification Code</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                maxLength={6}
                className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus:bg-gray-700 text-center text-2xl tracking-widest ${fieldErrors.code ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.code && (
              <p className="text-sm text-red-500">{fieldErrors.code}</p>
            )}
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="text-sm"
            >
              {canResend ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              ) : (
                `Resend code in ${countdown}s`
              )}
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
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          {/* Back to Forgot Password */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToForgot}
            className="w-full text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forgot Password
          </Button>
        </form>
      </div>
    </div>
  )
}
