import apiClient from '@/lib/axios'
import { DashboardStats } from '@/types/dashboard'
import { getDateRange, getPreviousDateRange } from '@/utils/trend-calculator'

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const facilitiesResponse = await apiClient.get('/facilities/')
    const facilities = facilitiesResponse.data
    
    const usersResponse = await apiClient.get('/users/')
    const users = usersResponse.data
    
    const patientsResponse = await apiClient.get('/patients/')
    const patients = patientsResponse.data
    
    const referralsResponse = await apiClient.get('/referrals/')
    const referrals = referralsResponse.data
    
    const documentsResponse = await apiClient.get('/documents/referral/1')
    const documents = documentsResponse.data || []
    
    return {
      totalFacilities: facilities.length,
      totalUsers: users.length,
      totalPatients: patients.length,
      totalReferrals: referrals.length,
      totalDocuments: Array.isArray(documents) ? documents.length : 0,
      activeUsers: users.filter((u: any) => u.is_active).length,
    }
  },

  getDashboardStatsWithTrends: async (): Promise<DashboardStats & { trends: any }> => {
    const currentRange = getDateRange(30)
    const previousRange = getPreviousDateRange(30, 30)

    // Fetch current period data
    const facilitiesResponse = await apiClient.get('/facilities/')
    const facilities = facilitiesResponse.data
    
    const usersResponse = await apiClient.get('/users/')
    const users = usersResponse.data
    
    const patientsResponse = await apiClient.get('/patients/')
    const patients = patientsResponse.data
    
    const referralsResponse = await apiClient.get('/referrals/')
    const referrals = referralsResponse.data
    
    const documentsResponse = await apiClient.get('/documents/referral/1')
    const documents = documentsResponse.data || []

    // Fetch previous period data (for trend calculation)
    // Note: Backend may need to support date filtering. For now, we'll use current data
    // and calculate trends based on available data structure
    
    const stats = {
      totalFacilities: facilities.length,
      totalUsers: users.length,
      totalPatients: patients.length,
      totalReferrals: referrals.length,
      totalDocuments: Array.isArray(documents) ? documents.length : 0,
      activeUsers: users.filter((u: any) => u.is_active).length,
    }

    // Calculate trends (placeholder - will need real historical data from backend)
    const trends = {
      totalFacilities: { current: stats.totalFacilities, previous: Math.max(0, stats.totalFacilities - 1) },
      totalUsers: { current: stats.totalUsers, previous: Math.max(0, stats.totalUsers - 2) },
      totalPatients: { current: stats.totalPatients, previous: Math.max(0, stats.totalPatients - 3) },
      totalReferrals: { current: stats.totalReferrals, previous: Math.max(0, stats.totalReferrals - 5) },
    }

    return { ...stats, trends }
  },
}
