import apiClient from '@/lib/axios'
import { DashboardStats } from '@/types/dashboard'
import { analyticsService } from './analytics.service'

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const data = await analyticsService.getDashboardKpis()

    return {
      totalFacilities: data.total_facilities || 0,
      totalUsers: data.totalUsers,
      totalPatients: data.totalPatients,
      totalReferrals: data.totalReferrals,
      totalDocuments: data.totalDocuments,
      activeUsers: data.activeUsers,
    }
  },

  getDashboardStatsWithTrends: async (): Promise<DashboardStats & { trends: any }> => {
    const data = await analyticsService.getDashboardKpis()

    const stats = {
      totalFacilities: data.total_facilities || 0,
      totalUsers: data.totalUsers,
      totalPatients: data.totalPatients,
      totalReferrals: data.totalReferrals,
      totalDocuments: data.totalDocuments,
      activeUsers: data.activeUsers,
    }

    const trends = {
      totalFacilities: { 
        current: stats.totalFacilities, 
        percentage: 0 
      },
      totalUsers: { 
        current: stats.totalUsers, 
        percentage: data.totalUsersTrend 
      },
      totalPatients: { 
        current: stats.totalPatients, 
        percentage: data.totalPatientsTrend 
      },
      totalReferrals: { 
        current: stats.totalReferrals, 
        percentage: data.totalReferralsTrend 
      },
      totalDocuments: {
        current: stats.totalDocuments,
        percentage: data.totalDocumentsTrend
      }
    }

    return { ...stats, trends }
  },
}
