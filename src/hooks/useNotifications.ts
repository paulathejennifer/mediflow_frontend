/**
 * WebSocket Hook for Real-Time Notifications
 * 
 * This hook manages WebSocket connections for real-time notifications,
 * including connection management, message handling, and reconnection logic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/lib/toast';

// Types for notification system
export interface Notification {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  details: Record<string, any>;
  actions: string[];
  roles: string[];
  backend_source: string;
  timestamp: string;
  expires_at?: string;
  is_read?: boolean;
  read_at?: string;
  action_taken?: string;
  action_result?: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  critical: number;
  warning: number;
  info: number;
  expired: number;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  stats: NotificationStats;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  handleAction: (notificationId: number, action: string) => Promise<any>;
  refreshNotifications: () => Promise<void>;
  filters: {
    type: 'all' | 'critical' | 'warning' | 'info';
    unreadOnly: boolean;
  };
  setFilters: (filters: Partial<{ type: 'all' | 'critical' | 'warning' | 'info'; unreadOnly: boolean }>) => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/websocket/notifications';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export function useNotifications(): UseNotificationsReturn {
  const { token, user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    critical: 0,
    warning: 0,
    info: 0,
    expired: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState({
    type: 'all' as 'all' | 'critical' | 'warning' | 'info',
    unreadOnly: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type !== 'all') {
        params.append('notification_type', filters.type);
      }
      
      if (filters.unreadOnly) {
        params.append('unread_only', 'true');
      }
      
      params.append('limit', '50');

      const response = await fetch(`${API_BASE}/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      calculateStats(data.notifications || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, filters.type, filters.unreadOnly, calculateStats]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (!token || !user) return;

    try {
      const wsUrl = `${WS_URL}?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Send initial ping
        if (wsRef.current) {
          wsRef.current.send('ping');
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = event.data;
          
          // Handle ping/pong
          if (message === 'pong') {
            return;
          }

          // Handle stats message
          if (message.startsWith('stats:')) {
            return;
          }

          // Parse notification
          const notification: Notification = JSON.parse(message);
          
          // Add to notifications list
          setNotifications(prev => [notification, ...prev]);
          
          // Show toast for critical and warning notifications
          if (notification.type === 'critical' || notification.type === 'warning') {
            toast.error(notification.title, {
              description: notification.message,
              action: {
                label: 'View',
                onClick: () => handleAction(notification.id, 'view-details')
              }
            });
          } else {
            toast.info(notification.title, {
              description: notification.message
            });
          }

          // Update stats
          calculateStats([notification, ...notifications]);
        } catch (err) {
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        
        // Attempt reconnection if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectWebSocket();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to reconnect to notification service');
          toast.error('Lost connection to notification service');
        }
      };

      wsRef.current.onerror = (error) => {
        setError('WebSocket connection error');
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to notification service';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [token, user, notifications, calculateStats]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }

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
  }, [token, notifications, calculateStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
      }

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
  }, [token, notifications, calculateStats]);

  // Handle notification action
  const handleAction = useCallback(async (notificationId: number, action: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/actions/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to execute action: ${response.statusText}`);
      }

      const result = await response.json();
      
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
  }, [token]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Initialize connection and fetch data
  useEffect(() => {
    if (token && user) {
      fetchNotifications();
      connectWebSocket();
    }

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [token, user]);

  // Reconnect when filters change
  useEffect(() => {
    fetchNotifications();
  }, [filters.type, filters.unreadOnly, fetchNotifications]);

  // Ping interval to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected]);

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
