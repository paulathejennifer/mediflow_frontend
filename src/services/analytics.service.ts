import apiClient from '@/lib/axios'

export interface SystemActivityData {
  month: string
  patients: number
  referrals: number
  documents: number
}

export interface AnalyticsMetrics {
  totalPatients: number
  totalReferrals: number
  totalDocuments: number
  growthRate: number
  activeUsers: number
}

export const analyticsService = {
  getSystemActivityTrend: async (): Promise<SystemActivityData[]> => {
    const response = await apiClient.get('/referrals/')
    const referrals = response.data
    
    const patientsResponse = await apiClient.get('/patients/')
    const patients = patientsResponse.data
    
    const documentsResponse = await apiClient.get('/documents/')
    const documents = documentsResponse.data
    
    const usersResponse = await apiClient.get('/users/')
    const users = usersResponse.data
    
    return [
      { month: '0', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '1', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '2', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '3', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '4', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '5', patients: patients.length, referrals: referrals.length, documents: documents.length },
      { month: '6', patients: patients.length, referrals: referrals.length, documents: documents.length }
    ]
  },

  getAnalyticsMetrics: async (): Promise<AnalyticsMetrics> => {
    const patientsResponse = await apiClient.get('/patients/')
    const patients = patientsResponse.data
    
    const referralsResponse = await apiClient.get('/referrals/')
    const referrals = referralsResponse.data
    
    const usersResponse = await apiClient.get('/users/')
    const users = usersResponse.data
    
    return {
      totalPatients: patients.length,
      totalReferrals: referrals.length,
      totalDocuments: 0,
      growthRate: 0,
      activeUsers: users.filter((u: any) => u.is_active).length
    }
  },
}
