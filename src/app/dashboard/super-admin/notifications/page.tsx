'use client'

import { NotificationCenter } from '@/components/notifications/notification-center'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">Manage your notifications and alerts</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-3">
        <NotificationCenter />
      </div>
    </div>
  )
}
