'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ForbiddenPage() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Left side - Content */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Oops! <span className="text-primary">Forbidden</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            You don't have permission to access this resource. Please contact your administrator or go back to the previous page.
          </p>
          
          {/* Go Back Button */}
          <Button
            onClick={handleGoBack}
            className="bg-primary/90 text-primary-foreground hover:bg-primary/80 px-8 py-3 text-lg"
          >
            Go Back
          </Button>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:absolute lg:right-8 lg:top-1/2 lg:transform lg:-translate-y-1/2">
        <Image
          src="/images/403.png"
          alt="Forbidden Access"
          width={400}
          height={400}
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
