import apiClient from '@/lib/axios'
import { DashboardStats } from '@/types/dashboard'
import { analyticsService } from './analytics.service'

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const data = await analyticsService.getDashboardKpis()

    return {
      totalFacilities: data.total_facilities || 0,
      totalUsers: data.total_users || 0,
      totalPatients: data.total_patients || 0,
      totalReferrals: data.total_referrals_30d || 0,
      totalDocuments: data.total_documents || 0,
      activeUsers: data.active_users || data.total_users || 0,
    }
  },

  getDashboardStatsWithTrends: async (): Promise<DashboardStats & { trends: any }> => {
    const data = await analyticsService.getDashboardKpis()

    const stats = {
      totalFacilities: data.total_facilities || 0,
      totalUsers: data.total_users || 0,
      totalPatients: data.total_patients || 0,
      totalReferrals: data.total_referrals_30d || 0,
      totalDocuments: data.total_documents || 0,
      activeUsers: data.active_users || data.total_users || 0,
    }

    const trends = {
      totalFacilities: { 
        current: stats.totalFacilities, 
        percentage: 0 
      },
      totalUsers: { 
        current: stats.totalUsers, 
        percentage: data.total_users_trend 
      },
      totalPatients: { 
        current: stats.totalPatients, 
        percentage: data.total_patients_trend 
      },
      totalReferrals: { 
        current: stats.totalReferrals, 
        percentage: data.total_referrals_trend 
      },
      totalDocuments: {
        current: stats.totalDocuments,
        percentage: data.total_documents_trend
      }
    }

    return { ...stats, trends }
  },
}
