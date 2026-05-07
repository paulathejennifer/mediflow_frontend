'use client'

import { Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/search-bar'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown'
import { CTAButton } from '@/components/shared/cta-button'
import { ROLES } from '@/constants/roles'

export function Header() {
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
          <CTAButton userRole={ROLES.SUPER_ADMIN} />
          

          
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-transparent">
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
