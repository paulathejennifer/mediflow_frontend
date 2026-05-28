import apiClient from '@/lib/axios'

export interface Facility {
  id: string
  name: string
  email: string
  facilityCode: string
  phone: string
  type: 'hospital' | 'clinic' | 'health_center' | 'dispensary'
  level: number
  county: string
  address: string
  performance: number
  joined: string
  status: 'active' | 'inactive'
  referrals?: number
}

export interface CreateFacilityRequest {
  name: string
  facility_code?: string
  type: string
  level: string
  county: string
  address?: string
  phone?: string
  email?: string
  is_active?: boolean
}

interface ApiFacilitySummary {
  id: number
  name: string
  facility_code: string
  type: string
  level: string
  county: string
  address?: string
  phone?: string
  email?: string
  created_at?: string
  performance_score?: number
}

interface ApiFacilityResponse extends ApiFacilitySummary {
  address?: string
  phone?: string
  email?: string
  is_active?: boolean
}

function mapSummaryToFacility(f: ApiFacilitySummary): Facility {
  const levelNum = parseInt(String(f.level).replace(/\D/g, ''), 10) || 1
  return {
    id: String(f.id),
    name: f.name,
    email: f.email || '',
    facilityCode: f.facility_code,
    phone: f.phone || '',
    type: f.type as Facility['type'],
    level: levelNum,
    county: f.county,
    address: f.address || '',
    performance: f.performance_score ?? 0,
    joined: f.created_at || new Date().toISOString(),
    status: 'active',
    referrals: 0,
  }
}

function mapResponseToFacility(f: ApiFacilityResponse): Facility {
  const base = mapSummaryToFacility(f)
  return {
    ...base,
    email: f.email || '',
    phone: f.phone || '',
    address: f.address || '',
    joined: f.created_at || base.joined,
    status: f.is_active === false ? 'inactive' : 'active',
  }
}

export const getPerformanceVariant = (score: number): string => {
  if (score >= 80) return 'performance_high'
  if (score >= 60) return 'performance_medium_high'
  if (score >= 40) return 'performance_medium'
  if (score >= 20) return 'performance_medium_low'
  return 'performance_low'
}

export const getLevelVariant = (level: number): string => {
  return `facility_level_${level}` as const
}

export const facilityService = {
  getFacilities: async (params?: {
    skip?: number
    limit?: number
    county?: string
    facility_type?: string
    level?: string
  }): Promise<Facility[]> => {
    const response = await apiClient.get<ApiFacilitySummary[]>('/facilities/', { params })
    return response.data.map(mapSummaryToFacility)
  },

  getFacilityById: async (id: string): Promise<Facility> => {
    const response = await apiClient.get<ApiFacilityResponse>(`/facilities/${id}`)
    return mapResponseToFacility(response.data)
  },

  createFacility: async (data: CreateFacilityRequest): Promise<Facility> => {
    // Clean the level (strip "level_" prefix) to ensure backend validation passes
    const payload = {
      name: data.name,
      facility_code: data.facility_code || undefined,
      type: data.type,
      level: data.level.replace('level_', ''),
      county: data.county,
      address: data.address,
      phone: data.phone,
      email: data.email,
      is_active: data.is_active ?? true,
    }
    const response = await apiClient.post<ApiFacilityResponse>('/facilities/', payload)
    return mapResponseToFacility(response.data)
  },
}

// Re-export for backward compatibility
export const facilitiesService = facilityService
