'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useMockNotifications } from '@/hooks/useMockNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scrollbar } from '@/components/shared';
import { DropdownCloseButton } from '@/components/shared';
import { useAuthStore } from '@/store/auth-store';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, stats, markAsRead, markAllAsRead } = useMockNotifications();

  // Handle opening/closing animations
  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(false);
      setTimeout(() => setIsOpen(false), 200);
    } else {
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 384, // 384px ≈ w-96
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleToggle();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 18, className: 'flex-shrink-0' };

    switch (type) {
      case 'critical':
      case 'error':
        return <XCircle {...iconProps} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="text-yellow-500" />;
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-500" />;
      case 'info':
      default:
        return <Info {...iconProps} className="text-blue-500" />;
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative hover:bg-transparent hover:text-primary"
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {stats.unread > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {stats.unread > 9 ? '9+' : stats.unread}
          </Badge>
        )}
      </Button>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 transition-opacity duration-200"
              style={{ opacity: isAnimating ? 1 : 0 }}
              onClick={handleToggle}
              aria-hidden="true"
            />

            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="fixed z-50 w-96 rounded-xl border border-gray-700 bg-gray-900 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] overflow-hidden transition-all duration-200 ease-out"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                opacity: isAnimating ? 1 : 0,
              }}
            >
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-800">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    Notifications
                    {stats.unread > 0 && (
                      <Badge variant="secondary">{stats.unread}</Badge>
                    )}
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    {stats.unread > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead();
                          handleToggle();
                        }}
                        className="text-gray-400 hover:text-primary hover:bg-transparent text-sm"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Mark all read
                      </Button>
                    )}

                    <DropdownCloseButton onClick={handleToggle} />
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Scrollbar className="max-h-[420px]">
                    {recentNotifications.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-800">
                        {recentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                              !notification.is_read ? 'bg-gray-800/30' : ''
                            }`}
                            onClick={() => {
                              if (!notification.is_read) {
                                markAsRead(notification.id);
                              }
                              // Optional: navigate or open detail
                            }}
                          >
                            <div className="flex gap-3">
                              {getNotificationIcon(notification.type)}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm text-white truncate">
                                    {notification.title}
                                  </p>
                                  {!notification.is_read && (
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                                      notification.type === 'critical' 
                                        ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                                        : 'bg-blue-500'
                                    }`} />
                                  )}
                                </div>

                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                  {notification.message}
                                </p>

                                <p className="text-gray-500 text-xs mt-2">
                                  {new Date(notification.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Scrollbar>
                </CardContent>

                {notifications.length > 5 && (
                  <div className="border-t border-gray-800 p-3">
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/dashboard/super-admin/notifications');
                        handleToggle();
                      }}
                    >
                      View all notifications ({notifications.length})
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </>,
          document.body
        )}
    </>
  );
}