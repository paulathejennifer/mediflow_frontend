import { userService } from './user.service'
import { facilityService } from '@/features/facilities/services/facility.service'
import { referralService } from '@/features/referrals/services/referral.service'
import { User } from './user.service'

export interface StaffMember extends User {
  facility: string
  facilityCode: string
  referralCount: number
}

export const staffService = {
  getStaff: async (): Promise<StaffMember[]> => {
    const users = await userService.getUsers()
    const referrals = await referralService.getReferrals()
    
    const staffWithFacilityNames = await Promise.all(
      users.map(async (user) => {
        let facilityName = ''
        let facilityCode = ''
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        // Count referrals created by this user
        const referralCount = 0
        
        return {
          ...user,
          facility: facilityName,
          facilityCode,
          referralCount,
        }
      })
    )
    
    return staffWithFacilityNames
  },

  getStaffById: async (id: number): Promise<StaffMember | undefined> => {
    const user = await userService.getUserById(id)

    if (!user) return undefined

    let facilityName = ''
    let facilityCode = ''
    const referrals = await referralService.getReferrals()

    if (user.facility_id) {
      try {
        const facility = await facilityService.getFacilityById(String(user.facility_id))
        facilityName = facility.name
        facilityCode = facility.facilityCode ?? 'N/A'
      } catch (error) {
        facilityName = 'Unknown Facility'
        facilityCode = 'N/A'
      }
    }

    const referralCount = 0
    
    return {
      ...user,
      facility: facilityName,
      facilityCode,
      referralCount,
    }
  },
  getStaffByRole: async (role: string): Promise<StaffMember[]> => {
    const users = await userService.getUsers({ role })
    const referrals = await referralService.getReferrals()
    
    const staffWithFacilityNames = await Promise.all(
      users.map(async (user) => {
        let facilityName = ''
        let facilityCode = ''
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        const referralCount = 0
        
        return {
          ...user,
          facility: facilityName,
          facilityCode,
          referralCount,
        }
      })
    )
    
    return staffWithFacilityNames
  },

  getStaffByStatus: async (status: string): Promise<StaffMember[]> => {
    const users = await userService.getUsers()
    const filteredUsers = users.filter((u: any) => u.is_active === (status === 'active'))
    const referrals = await referralService.getReferrals()
    
    const staffWithFacilityNames = await Promise.all(
      filteredUsers.map(async (user) => {
        let facilityName = ''
        let facilityCode = ''
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        const referralCount = 0
        
        return {
          ...user,
          facility: facilityName,
          facilityCode,
          referralCount,
        }
      })
    )
    
    return staffWithFacilityNames
  },
}
