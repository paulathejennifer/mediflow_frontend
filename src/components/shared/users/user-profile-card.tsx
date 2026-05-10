'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function UserProfileCard() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout()
      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('remember_me')
      }
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) return null

  return (
    <div className="p-4 border-t border-border">
      <div className={cn(
        "rounded-2xl bg-background border border-border px-4 py-3 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35] hover:-translate-y-1",
        "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)]"
      )}>
        {/* User Avatar and Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 p-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
