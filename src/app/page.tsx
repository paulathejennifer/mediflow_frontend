'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [showText, setShowText] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show text after logo animation completes
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 800)

    // Redirect to login after 2.5 seconds (logo animation + text display)
    const redirectTimer = setTimeout(() => {
      router.push('/auth/login')
    }, 2500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Logo with pop-in animation */}
      <div className="text-center">
        <div 
          className="mb-16"
          style={{
            animation: 'popIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
          }}
        >
          <Image 
            src="/images/logo.png" 
            alt="MediFlow" 
            width={165} 
            height={165}
            className="mx-auto"
          />
        </div>

        {/* Text that fades in after logo */}
        <div 
          className={`transition-all duration-1000 transform ${
            showText 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-[hsl(var(--primary))] w-12"></div>
            <h1 className="text-md font-light text-[hsl(var(--primary))]">
              Healthcare. Connected
            </h1>
            <div className="h-px bg-[hsl(var(--primary))] w-12"></div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
