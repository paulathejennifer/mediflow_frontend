import { DashboardData, DashboardStats, ActivityItem, SystemHealth } from '@/types/dashboard'
import apiClient from '@/lib/axios'

// Data Abstraction Layer - Switch between mock and real API here
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true'

// Mock Data
const mockDashboardStats: DashboardStats = {
  totalFacilities: 24,
  totalUsers: 1248,
  totalPatients: 8432,
  totalReferrals: 3847,
}

const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'New facility registered',
    description: 'St. Mary\'s Hospital',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'System maintenance completed',
    description: 'Database optimization',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    title: 'New admin user added',
    description: 'John Doe - Facility Admin',
    timestamp: '1 day ago',
  },
]

const mockSystemHealth: SystemHealth = {
  apiResponseTime: '124ms',
  databaseStatus: 'Healthy',
  serverLoad: '45%',
  storageUsage: '67%',
}

const mockDashboardData: DashboardData = {
  stats: mockDashboardStats,
  recentActivity: mockRecentActivity,
  systemHealth: mockSystemHealth,
}

// Mock Service Functions
const mockGetDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockDashboardStats
}

const mockGetRecentActivity = async (): Promise<ActivityItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockRecentActivity
}

const mockGetSystemHealth = async (): Promise<SystemHealth> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockSystemHealth
}

const mockGetDashboardData = async (): Promise<DashboardData> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockDashboardData
}

// Real API Service Functions
const apiGetDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/api/v1/dashboard/stats')
  return response.data
}

const apiGetRecentActivity = async (): Promise<ActivityItem[]> => {
  const response = await apiClient.get('/api/v1/dashboard/activity')
  return response.data
}

const apiGetSystemHealth = async (): Promise<SystemHealth> => {
  const response = await apiClient.get('/api/v1/dashboard/health')
  return response.data
}

const apiGetDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/api/v1/dashboard')
  return response.data
}

// Export Service Functions - These automatically switch between mock and real API
export const dashboardService = {
  getDashboardStats: USE_MOCK_DATA ? mockGetDashboardStats : apiGetDashboardStats,
  getRecentActivity: USE_MOCK_DATA ? mockGetRecentActivity : apiGetRecentActivity,
  getSystemHealth: USE_MOCK_DATA ? mockGetSystemHealth : apiGetSystemHealth,
  getDashboardData: USE_MOCK_DATA ? mockGetDashboardData : apiGetDashboardData,
}

// Helper function to switch between mock and real API
export const setUseMockDashboardData = (useMock: boolean) => {
  if (useMock) {
    dashboardService.getDashboardStats = mockGetDashboardStats
    dashboardService.getRecentActivity = mockGetRecentActivity
    dashboardService.getSystemHealth = mockGetSystemHealth
    dashboardService.getDashboardData = mockGetDashboardData
  } else {
    dashboardService.getDashboardStats = apiGetDashboardStats
    dashboardService.getRecentActivity = apiGetRecentActivity
    dashboardService.getSystemHealth = apiGetSystemHealth
    dashboardService.getDashboardData = apiGetDashboardData
  }
}
