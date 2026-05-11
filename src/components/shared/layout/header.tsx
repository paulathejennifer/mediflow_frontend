'use client'

import { Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar, Scrollbar } from '@/components/shared'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown'
import { CTAButton } from '@/components/shared'
import { ROLES } from '@/constants/roles'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

export function Header() {
  const router = useRouter()
  const { user } = useAuthStore()

  const handleSettingsClick = () => {
    const userRole = user?.role
    if (userRole === 'super_admin') {
      router.push('/dashboard/super-admin/settings')
    } else if (userRole === 'facility_admin') {
      router.push('/dashboard/facility-admin/settings')
    } else if (userRole === 'clinician') {
      router.push('/dashboard/clinician/settings')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-sm">
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="max-w-md w-full">
            <SearchBar className="w-[350px] " />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* CTA Button */}
          <CTAButton userRole={user?.role || ROLES.CLINICIAN} />
          

          
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-foreground hover:text-primary hover:bg-transparent"
            onClick={handleSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
