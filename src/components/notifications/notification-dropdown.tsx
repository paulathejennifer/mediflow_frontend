'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useMockNotifications } from '@/hooks/useMockNotifications'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared/scrollbar'

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const { notifications, stats, markAsRead, markAllAsRead } = useMockNotifications()

  // Manage backdrop overlay at document level
  useEffect(() => {
    let backdrop: HTMLDivElement | null = null
    
    if (isOpen) {
      // Create backdrop element
      backdrop = document.createElement('div')
      backdrop.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-out z-[9998]'
      backdrop.style.position = 'fixed'
      backdrop.style.top = '0'
      backdrop.style.left = '0'
      backdrop.style.right = '0'
      backdrop.style.bottom = '0'
      backdrop.style.opacity = '0'
      backdrop.style.transition = 'opacity 300ms ease-out'
      backdrop.addEventListener('click', () => setIsOpen(false))
      document.body.appendChild(backdrop)
      
      // Trigger fade-in animation
      requestAnimationFrame(() => {
        if (backdrop) {
          backdrop.style.opacity = '1'
        }
      })
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      if (backdrop) {
        document.body.removeChild(backdrop)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, setIsOpen])

  // Track button position for dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8, // spacing below button
        left: rect.right - 384 // align right edge (384px = w-96)
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-primary hover:bg-transparent relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {stats.unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {stats.unread > 9 ? '9+' : stats.unread}
          </span>
        )}
      </Button>

      {createPortal(
        <>
          {/* Dropdown with glow effect */}
          <div 
            className="fixed w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] z-[10000] transition-all duration-300 ease-out transform"
            style={{
              top: position.top,
              left: position.left,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  {/* <Bell className="h-5 w-5 text-white" /> */}
                  <h3 className="font-semibold text-white">Notifications</h3>
                  {stats.unread > 0 && (
                    <Badge variant="default" className="text-secondary">
                      {stats.unread}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {stats.unread > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-gray-400 hover:text-primary hover:bg-transparent"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-primary hover:bg-gray-700 p-2 h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <Scrollbar className="max-h-96">
                {recentNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-800 transition-colors cursor-pointer ${
                          !notification.is_read ? 'bg-gray-800/50' : ''
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium truncate ${
                                !notification.is_read ? 'text-white' : 'text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                                  notification.type === 'critical' 
                                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                                    : 'bg-blue-500'
                                }`}></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Scrollbar>

              {/* Footer */}
              {notifications.length > 5 && (
                <div className="p-3 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-400 hover:text-white hover:bg-transparent"
                    onClick={() => {
                      // Navigate to full notifications page
                      window.location.href = '/dashboard/super-admin/notifications'
                    }}
                  >
                    View all notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </>,
        document.body
      )}
    </div>
  )
}
