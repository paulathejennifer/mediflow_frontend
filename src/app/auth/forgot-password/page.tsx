'use client'

import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form'
import { authService } from '@/features/auth/services/auth.service'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)

  const handleForgotPassword = async (data: { email: string }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      await authService.forgotPassword({ email: data.email })
      setSuccess(true)
    } catch (err) {
      setError('Failed to send verification code. Please check your email and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ForgotPasswordForm 
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </div>
  )
}
