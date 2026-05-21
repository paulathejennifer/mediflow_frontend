'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VerifyCodeForm } from '@/components/forms/verify-code-form'
import { authService } from '@/services/auth.service'

export default function VerifyCodePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const handleVerifyCode = async (data: { code: string }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      const response = await authService.verifyCode({ 
        email: email,
        code: data.code 
      })
      
      if (response.valid) {
        // Code is valid, redirect to reset password page with email and code
        router.push(`/auth/reset-password?email=${email}&code=${data.code}`)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (err) {
      setError('Failed to verify code. Please check the code and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      await authService.forgotPassword({ email })
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <VerifyCodeForm 
        onSubmit={handleVerifyCode}
        onResendCode={handleResendCode}
        isLoading={isLoading}
        error={error}
        email={email}
      />
    </div>
  )
}
