import apiClient from '@/lib/axios'
import { Facility } from '@/types/facility'

export const facilitiesService = {
  getFacilities: async (params?: {
    skip?: number
    limit?: number
    county?: string
    facility_type?: string
    level?: string
  }): Promise<Facility[]> => {
    const response = await apiClient.get('/facilities/', { params })
    return response.data
  },

  getFacilityById: async (id: string): Promise<Facility> => {
    const response = await apiClient.get(`/facilities/${id}`)
    return response.data
  },
}