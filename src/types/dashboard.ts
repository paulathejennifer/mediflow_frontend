export interface DashboardStats {
  totalFacilities: number
  totalUsers: number
  totalPatients: number
  totalReferrals: number
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
}

export interface SystemHealth {
  apiResponseTime: string
  databaseStatus: string
  serverLoad: string
  storageUsage: string
}

export interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
  systemHealth: SystemHealth
}
