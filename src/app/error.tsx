'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error])

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full lg:flex lg:items-center lg:justify-between lg:gap-8">
        {/* Left side - Content */}
        <div className="flex-1 lg:text-left text-center lg:text-left space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Oops! <span className="text-primary">Something went wrong</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            An unexpected error occurred. Please try again or go back to the previous page.
          </p>

          {/* Go Back Button */}
          <div className="space-y-3">
            <Button
              onClick={reset}
              className="bg-primary/90 text-primary-foreground hover:bg-primary/80 px-6 py-2 mr-3"
            >
              Try Again
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-6 py-2"
            >
              Go Back
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:absolute lg:right-8 lg:top-1/2 lg:transform lg:-translate-y-1/2">
          <Image
            src="/images/500.png"
            alt="Error"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}
