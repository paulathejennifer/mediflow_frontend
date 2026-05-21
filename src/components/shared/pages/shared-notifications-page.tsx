'use client'

import { NotificationCenter } from '@/components/notifications/notification-center'

export function SharedNotificationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your notifications and alerts
        </p>
      </div>

      {/* Notification Center */}
      <NotificationCenter />
    </div>
  )
}
