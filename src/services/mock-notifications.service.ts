// Mock Notifications Service
// Provides sample notification data for development without backend connectivity

import { Notification, NotificationStats } from '@/hooks/useNotifications'

// Sample notification data
export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'critical',
    title: 'System Maintenance Required',
    message: 'Database backup failed. Immediate attention required.',
    details: {
      service: 'database',
      error_code: 'DB_BACKUP_001',
      last_successful_backup: '2026-04-29T02:00:00Z',
      retry_count: 3
    },
    actions: ['retry-backup', 'view-logs', 'contact-admin'],
    roles: ['admin', 'super_admin'],
    backend_source: 'database_service',
    timestamp: '2026-04-30T14:30:00Z',
    expires_at: '2026-05-02T14:30:00Z',
    is_read: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'High CPU Usage Detected',
    message: 'Server CPU usage exceeded 80% threshold.',
    details: {
      server: 'web-server-01',
      current_usage: 87,
      threshold: 80,
      duration: '15 minutes'
    },
    actions: ['view-metrics', 'restart-service'],
    roles: ['admin', 'devops'],
    backend_source: 'monitoring_service',
    timestamp: '2026-04-30T14:15:00Z',
    expires_at: '2026-05-01T14:15:00Z',
    is_read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'New User Registration',
    message: '5 new users registered in the last hour.',
    details: {
      user_count: 5,
      time_period: '1 hour',
      new_users: ['john.doe', 'jane.smith', 'bob.wilson', 'alice.brown', 'charlie.davis']
    },
    actions: ['view-users'],
    roles: ['admin', 'super_admin'],
    backend_source: 'auth_service',
    timestamp: '2026-04-30T13:45:00Z',
    expires_at: '2026-05-07T13:45:00Z',
    is_read: true,
    read_at: '2026-04-30T13:50:00Z'
  },
  {
    id: 4,
    type: 'critical',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected.',
    details: {
      ip_address: '192.168.1.100',
      attempt_count: 10,
      time_period: '5 minutes',
      username: 'admin'
    },
    actions: ['block-ip', 'view-logs', 'reset-password'],
    roles: ['admin', 'super_admin', 'security'],
    backend_source: 'auth_service',
    timestamp: '2026-04-30T12:30:00Z',
    expires_at: '2026-05-01T12:30:00Z',
    is_read: false
  },
  {
    id: 5,
    type: 'warning',
    title: 'Disk Space Low',
    message: 'Server disk usage reached 85% capacity.',
    details: {
      server: 'file-server-02',
      current_usage: 85,
      total_capacity: '1TB',
      available_space: '150GB'
    },
    actions: ['cleanup-files', 'expand-storage'],
    roles: ['admin', 'devops'],
    backend_source: 'monitoring_service',
    timestamp: '2026-04-30T11:00:00Z',
    expires_at: '2026-05-02T11:00:00Z',
    is_read: true,
    read_at: '2026-04-30T11:30:00Z'
  },
  {
    id: 6,
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for tonight at 2:00 AM.',
    details: {
      maintenance_type: 'security_updates',
      scheduled_time: '2026-05-01T02:00:00Z',
      duration: '2 hours',
      affected_services: ['api', 'database', 'auth']
    },
    actions: ['reschedule', 'view-details'],
    roles: ['admin', 'super_admin', 'devops'],
    backend_source: 'maintenance_service',
    timestamp: '2026-04-30T10:00:00Z',
    expires_at: '2026-05-01T10:00:00Z',
    is_read: true,
    read_at: '2026-04-30T10:15:00Z'
  },
  {
    id: 7,
    type: 'warning',
    title: 'API Rate Limit Warning',
    message: 'API rate limit approaching threshold.',
    details: {
      endpoint: '/api/v1/referrals',
      current_rate: 950,
      limit: 1000,
      time_window: '1 hour'
    },
    actions: ['view-stats', 'increase-limit'],
    roles: ['admin', 'devops'],
    backend_source: 'api_gateway',
    timestamp: '2026-04-30T09:30:00Z',
    expires_at: '2026-05-01T09:30:00Z',
    is_read: false
  },
  {
    id: 8,
    type: 'info',
    title: 'Backup Completed Successfully',
    message: 'Daily system backup completed successfully.',
    details: {
      backup_type: 'daily_full',
      size: '2.5GB',
      duration: '45 minutes',
      location: 's3://mediflow-backups/daily/'
    },
    actions: ['view-report'],
    roles: ['admin', 'super_admin'],
    backend_source: 'backup_service',
    timestamp: '2026-04-30T08:00:00Z',
    expires_at: '2026-05-07T08:00:00Z',
    is_read: true,
    read_at: '2026-04-30T08:05:00Z'
  }
]

// Calculate mock stats
export const mockStats: NotificationStats = {
  total: mockNotifications.length,
  unread: mockNotifications.filter(n => !n.is_read).length,
  critical: mockNotifications.filter(n => n.type === 'critical').length,
  warning: mockNotifications.filter(n => n.type === 'warning').length,
  info: mockNotifications.filter(n => n.type === 'info').length,
  expired: mockNotifications.filter(n => {
    if (!n.expires_at) return false
    return new Date(n.expires_at) < new Date()
  }).length
}

// Mock service class
export class MockNotificationsService {
  static async getNotifications(filters?: {
    type?: 'all' | 'critical' | 'warning' | 'info'
    unreadOnly?: boolean
    limit?: number
  }): Promise<{ notifications: Notification[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filteredNotifications = [...mockNotifications]
    
    // Apply filters
    if (filters?.type && filters.type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === filters.type)
    }
    
    if (filters?.unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.is_read)
    }
    
    if (filters?.limit) {
      filteredNotifications = filteredNotifications.slice(0, filters.limit)
    }
    
    return { notifications: filteredNotifications }
  }
  
  static async markAsRead(notificationId: number): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const notification = mockNotifications.find(n => n.id === notificationId)
    if (notification) {
      notification.is_read = true
      notification.read_at = new Date().toISOString()
    }
  }
  
  static async markAllAsRead(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    mockNotifications.forEach(notification => {
      if (!notification.is_read) {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
      }
    })
  }
  
  static async handleAction(notificationId: number, action: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const notification = mockNotifications.find(n => n.id === notificationId)
    if (notification) {
      notification.action_taken = action
      notification.action_result = {
        success: true,
        timestamp: new Date().toISOString(),
        message: `Action "${action}" completed successfully`
      }
    }
    
    return { success: true, message: 'Action completed' }
  }
  
  // Simulate real-time notification addition
  static simulateNewNotification(): Notification {
    const newNotification: Notification = {
      id: mockNotifications.length + 1,
      type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)] as 'critical' | 'warning' | 'info',
      title: 'New Real-time Notification',
      message: 'This is a simulated real-time notification.',
      details: { simulated: true, timestamp: new Date().toISOString() },
      actions: ['view-details'],
      roles: ['admin'],
      backend_source: 'mock_service',
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_read: false
    }
    
    mockNotifications.unshift(newNotification)
    return newNotification
  }
}
