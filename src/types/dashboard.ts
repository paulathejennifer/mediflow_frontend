export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
}

export interface DashboardStats {
  totalFacilities: number
  totalUsers: number
  totalPatients: number
  totalReferrals: number
  totalDocuments: number
  activeUsers: number
}

export interface SystemHealth {
  apiResponseTime: string
  databaseStatus: string
  serverLoad: string
  storageUsage: string
}
