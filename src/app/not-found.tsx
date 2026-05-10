'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full lg:flex lg:items-center lg:justify-between lg:gap-8">
        {/* Left side - Content */}
        <div className="flex-1 lg:text-left text-center lg:text-left space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Oops! <span className="text-primary">Page Not Found</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            The page you're looking for doesn't exist. Please check the URL or go back to the previous page.
          </p>
          
          {/* Go Back Button */}
          <Button
            onClick={handleGoBack}
            className="bg-primary/90 text-primary-foreground hover:bg-primary/80 px-8 py-3 text-lg"
          >
            Go Back
          </Button>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden lg:block lg:flex-shrink-0">
          <Image
            src="/images/404.png"
            alt="Page Not Found"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}
