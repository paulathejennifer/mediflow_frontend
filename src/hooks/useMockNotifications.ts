/**
 * Mock Notifications Hook
 * 
 * Provides mock notification data and functionality for development
 * without requiring backend connectivity. Simulates real-time updates
 * and maintains the same API as the real useNotifications hook.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification, NotificationStats, UseNotificationsReturn } from './useNotifications';
import { MockNotificationsService, mockNotifications, mockStats } from '@/services/mock-notifications.service';
import { toast } from '@/lib/toast';

export function useMockNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>(mockStats);
  const [isConnected, setIsConnected] = useState(true); // Always "connected" in mock mode
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState({
    type: 'all' as 'all' | 'critical' | 'warning' | 'info',
    unreadOnly: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate stats from notifications
  const calculateStats = useCallback((notificationList: Notification[]) => {
    const now = new Date();
    const newStats = notificationList.reduce((acc, notification) => {
      acc.total++;
      
      if (!notification.is_read) {
        acc.unread++;
      }
      
      if (notification.type === 'critical') acc.critical++;
      if (notification.type === 'warning') acc.warning++;
      if (notification.type === 'info') acc.info++;
      
      if (notification.expires_at && new Date(notification.expires_at) < now) {
        acc.expired++;
      }
      
      return acc;
    }, {
      total: 0,
      unread: 0,
      critical: 0,
      warning: 0,
      info: 0,
      expired: 0
    });

    setStats(newStats);
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await MockNotificationsService.getNotifications({
        type: filters.type,
        unreadOnly: filters.unreadOnly,
        limit: 50
      });
      
      setNotifications(result.notifications);
      calculateStats(result.notifications);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters.type, filters.unreadOnly, calculateStats]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await MockNotificationsService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      // Update stats
      calculateStats(notifications.map(n => 
        n.id === notificationId 
          ? { ...n, is_read: true }
          : n
      ));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      toast.error(errorMessage);
      throw err;
    }
  }, [notifications, calculateStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await MockNotificationsService.markAllAsRead();

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );

      // Update stats
      calculateStats(notifications.map(n => ({ ...n, is_read: true })));

      toast.success('All notifications marked as read');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      toast.error(errorMessage);
      throw err;
    }
  }, [notifications, calculateStats]);

  // Handle notification action
  const handleAction = useCallback(async (notificationId: number, action: string) => {
    try {
      const result = await MockNotificationsService.handleAction(notificationId, action);
      
      // Update notification with action result
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, action_taken: action, action_result: result }
            : n
        )
      );

      toast.success(`Action "${action}" completed successfully`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to execute action: ${action}`;
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Simulate real-time notifications
  const simulateRealTimeNotification = useCallback(() => {
    const newNotification = MockNotificationsService.simulateNewNotification();
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for critical and warning notifications
    if (newNotification.type === 'critical' || newNotification.type === 'warning') {
      toast.error(newNotification.title, {
        description: newNotification.message,
        action: {
          label: 'View',
          onClick: () => handleAction(newNotification.id, 'view-details')
        }
      });
    } else {
      toast.info(newNotification.title, {
        description: newNotification.message
      });
    }

    // Update stats
    calculateStats([newNotification, ...notifications]);
  }, [notifications, calculateStats, handleAction]);

  // Initialize data
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up simulated real-time updates (every 30 seconds)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Only add new notification 20% of the time to avoid spam
      if (Math.random() < 0.2) {
        simulateRealTimeNotification();
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulateRealTimeNotification]);

  return {
    notifications,
    stats,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    handleAction,
    refreshNotifications,
    filters,
    setFilters
  };
}
