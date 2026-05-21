'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { authService } from '@/services/auth.service'

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const handleResetPassword = async (data: { newPassword: string; confirmPassword: string }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      await authService.resetPassword({
        token: token,
        new_password: data.newPassword
      })
      setSuccess(true)
    } catch (err) {
      setError('Failed to reset password. The verification code may have expired. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ResetPasswordForm 
        onSubmit={handleResetPassword}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </div>
  )
}
