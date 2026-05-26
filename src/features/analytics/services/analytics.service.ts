import apiClient from '@/lib/axios'

export interface SystemActivityData {
  month: string
  patients: number
  referrals: number
  documents: number
}

export interface AnalyticsMetrics {
  totalPatients: number
  totalPatientsTrend: number
  totalReferrals: number
  totalReferralsTrend: number
  totalDocuments: number
  totalDocumentsTrend: number
  growthRate: number
  activeUsers: number
  totalUsers: number
  totalUsersTrend: number
  activeUsersTrend: number
  cliniciansCount: number
  cliniciansTrend: number
  facilityAdminsCount: number
  facilityAdminsTrend: number
  total_facilities?: number
  // Trend data for overview cards (Legacy support)
  turnaroundTrend?: number
  completionRateTrend?: number
  pendingTrend?: number
  recentAvgTurnaround?: number
  recentCompletionRate?: number
  recentPending?: number
}

export interface SystemHealthData {
  healthScore: number
  uptime: number
  errorRate: number
  avgResponseTime: number
}

export interface ApiRequestsData {
  totalRequests: number
  requestsLast24h: number
  trend: number
  breakdown: {
    referrals: number
    patients: number
    documents: number
  }
}

export interface ReferralVolumeData {
  month: string
  incoming: number
  outgoing: number
  total?: number
}

export interface TurnaroundData {
  week: string
  days: number
}

export interface ReferralTrendData {
  month: string
  total: number
  completed: number
}

export interface StatusData {
  name: string
  value: number
}

export interface ReasonData {
  name: string
  value: number
}

export interface FacilityPerformanceData {
  facility: string
  total_referrals: number
  completed_referrals: number
  completion_rate: number
  avg_turnaround_days: number
}

export const analyticsService = {
  /**
   * Unified KPI Fetcher
   * Used by Dashboard, Patients, Staff, Facilities, and Referrals pages
   * to ensure consistent trend calculation across the platform.
   */
  getDashboardKpis: async (): Promise<AnalyticsMetrics> => {
    const response = await apiClient.get('/analytics/dashboard')
    const data = response.data
    
    // Map backend snake_case to frontend camelCase for consistency across all pages
    return {
      totalPatients: data.total_patients || 0,
      totalPatientsTrend: data.total_patients_trend || 0,
      totalReferrals: data.total_referrals_30d || 0,
      totalReferralsTrend: data.total_referrals_trend || 0,
      totalDocuments: data.total_documents || 0,
      totalDocumentsTrend: data.total_documents_trend || 0,
      totalUsers: data.total_users || 0,
      totalUsersTrend: data.total_users_trend || 0,
      activeUsers: data.active_users || data.total_users || 0,
      activeUsersTrend: data.active_users_trend || 0,
      cliniciansCount: data.clinicians_count || 0,
      cliniciansTrend: data.clinicians_trend || 0,
      facilityAdminsCount: data.facility_admins_count || 0,
      facilityAdminsTrend: data.facility_admins_trend || 0,
      total_facilities: data.total_facilities,
      growthRate: data.total_patients_trend || 0, // Fallback for components using growthRate
    } as AnalyticsMetrics
  },

  // Get system activity trend (patients, referrals, documents over months)
  getSystemActivityTrend: async (months: number = 6): Promise<SystemActivityData[]> => {
    const response = await apiClient.get('/analytics/system-activity', {
      params: { months }
    })
    return response.data.data || []
  },

  // Get overall analytics metrics
  getAnalyticsMetrics: async (): Promise<AnalyticsMetrics> => {
    const response = await apiClient.get('/analytics/metrics')
    return response.data
  },

  // Get referral volume (incoming vs outgoing by month)
  getReferralVolume: async (months: number = 6): Promise<ReferralVolumeData[]> => {
    const response = await apiClient.get('/analytics/referrals/volume', {
      params: { months }
    })
    return response.data.data || []
  },

  // Get turnaround time trend (weekly)
  getTurnaroundTimeTrend: async (weeks: number = 4): Promise<TurnaroundData[]> => {
    const response = await apiClient.get('/analytics/referrals/turnaround-time', {
      params: { weeks }
    })
    return response.data.data || []
  },

  // Get referrals by status
  getReferralsByStatus: async (): Promise<StatusData[]> => {
    const response = await apiClient.get('/analytics/referrals/by-status')
    const labels = response.data.labels || []
    const data = response.data.data || []
    return labels.map((label: string, index: number) => ({
      name: label,
      value: data[index] || 0
    }))
  },

  // Get referrals by priority
  getReferralsByPriority: async (): Promise<StatusData[]> => {
    const response = await apiClient.get('/analytics/referrals/by-priority')
    const labels = response.data.labels || []
    const data = response.data.data || []
    return labels.map((label: string, index: number) => ({
      name: label,
      value: data[index] || 0
    }))
  },

  // Get referrals by reason
  getReferralsByReason: async (): Promise<ReasonData[]> => {
    const response = await apiClient.get('/analytics/referrals/by-reason')
    const labels = response.data.labels || []
    const data = response.data.data || []
    return labels.map((label: string, index: number) => ({
      name: label,
      value: data[index] || 0
    }))
  },

  // Get referral trend (daily over specified period)
  getReferralTrend: async (days: number = 30): Promise<{ labels: string[]; data: number[] }> => {
    const response = await apiClient.get('/analytics/referrals/trend', {
      params: { days }
    })
    return {
      labels: response.data.labels || [],
      data: response.data.data || []
    }
  },

  // Get top referring facilities (super admin only)
  getTopReferringFacilities: async (limit: number = 10): Promise<{ labels: string[]; data: number[] }> => {
    const response = await apiClient.get('/analytics/facilities/top-referring', {
      params: { limit }
    })
    return {
      labels: response.data.labels || [],
      data: response.data.data || []
    }
  },

  // Get facility performance (super admin only)
  getFacilityPerformance: async (limit: number = 10): Promise<FacilityPerformanceData[]> => {
    const response = await apiClient.get('/analytics/facilities/performance', {
      params: { limit }
    })
    return response.data.data || []
  },

  // Get referral analytics summary
  getReferralAnalytics: async (days: number = 30) => {
    const response = await apiClient.get('/analytics/referrals', {
      params: { days }
    })
    return response.data
  },

  // Get system health (super admin only)
  getSystemHealth: async (): Promise<SystemHealthData> => {
    const response = await apiClient.get('/analytics/system-health')
    return response.data
  },

  // Get API request statistics (super admin only)
  getApiRequests: async (days: number = 1): Promise<ApiRequestsData> => {
    const response = await apiClient.get('/analytics/api-requests', {
      params: { days }
    })
    return response.data
  }
}
