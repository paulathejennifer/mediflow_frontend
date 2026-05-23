import { useState, useEffect } from 'react'
import { facilityService } from '../services/facility.service'
import { Facility } from '@/types/facility'

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFacilities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await facilityService.getFacilities()
      const transformedData = data.map((facility: any) => ({
        ...facility,
        facilityCode: facility.facility_code
      }))
      setFacilities(transformedData)
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
      setError('Failed to load facilities')
      setFacilities([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFacilities()
  }, [])

  return { facilities, isLoading, error, refetch: fetchFacilities }
}
