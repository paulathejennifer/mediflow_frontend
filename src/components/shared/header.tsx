'use client'

import { Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/search-bar'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-sm">
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="max-w-md w-full">
            <SearchBar />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-transparent">
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* Profile */}
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-black" />
            </div>
            
            {/* Profile Content */}
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
