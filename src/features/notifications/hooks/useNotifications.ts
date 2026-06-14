import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

export interface AppNotification {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  details: Record<string, any>;
  actions: string[];
  created_at: string;
  expires_at?: string;
  is_read: boolean;
  backend_source: string;
  roles?: string[];
  action_result?: { message?: string };
}

export interface NotificationFilters {
  type: string;
  isRead: string;
  unreadOnly: boolean;
}

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  // Mismatch Fix: Check for 'access_token' (used by Auth Service) as well as 'token'
  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('access_token') || localStorage.getItem('token')) 
    : null;
  const wsRef = useRef<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({ 
    type: 'all', 
    isRead: 'all',
    unreadOnly: false 
  });
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Derived stats for the UI
  const stats = useMemo(() => ({
    total: notifications.length,
    unread: unreadCount,
    critical: notifications.filter(n => n.type === 'critical' && !n.is_read).length,
    warning: notifications.filter(n => n.type === 'warning' && !n.is_read).length,
    info: notifications.filter(n => n.type === 'info' && !n.is_read).length,
  }), [notifications, unreadCount]);

  const connect = useCallback(() => {
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) return;

    // Respect NEXT_PUBLIC_WS_URL from env if available, otherwise derive from API URL
    const cleanApiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
      ? `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}` 
      : (() => {
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const apiHost = cleanApiUrl.replace(/^https?:\/\//, '');
          return `${protocol}//${apiHost}/websocket/notifications?token=${token}`;
        })();

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 30000);
        ws.onclose = () => clearInterval(pingInterval);
      };

      ws.onmessage = (event) => {
        try {
          const message = event.data;
          if (message === 'ping' || message === 'pong') {
            return; // Ignore WebSocket keep-alive messages
          }
          const notification: AppNotification = JSON.parse(message);
          setNotifications(prev => [notification, ...prev].slice(0, 100));
          if (!notification.is_read) {
            setUnreadCount(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        if (token && event.code !== 1000) {
           reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [token]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [token]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [token]);

  const handleAction = useCallback(async (notificationId: number, actionId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/actions/${actionId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Refresh to get updated status/details
        await loadNotifications();
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
    }
  }, [token]);

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const deleted = notifications.find(n => n.id === notificationId);
        return deleted && !deleted.is_read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [token, notifications]);

  const loadNotifications = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('NEXT_PUBLIC_API_URL is undefined. Requests will default to frontend host, causing 405 errors.');
    }

    setIsLoading(true);
    setError(null);
    try {
      // Ensure no double slashes if NEXT_PUBLIC_API_URL ends with one
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      let url = `${baseUrl}/notifications?limit=50`;
      if (filters.type !== 'all') url += `&type=${filters.type}`;
      if (filters.unreadOnly) url += `&is_read=false`;
      else if (filters.isRead !== 'all') url += `&is_read=${filters.isRead === 'read'}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data: AppNotification[] = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: AppNotification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else if (!isAuthenticated) {
      wsRef.current?.close(1000, 'Logout');
    }
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [token, isAuthenticated, connect]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadNotifications();
    }
  }, [token, isAuthenticated, loadNotifications]);

  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    notifications,
    isConnected,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleAction,
    refresh: loadNotifications,
    refreshNotifications: loadNotifications,
    isLoading,
    error,
    stats,
    filters,
    setFilters: updateFilters,
  };
};