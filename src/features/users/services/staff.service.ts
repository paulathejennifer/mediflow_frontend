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
        let facilityName = 'Unknown Facility'
        let facilityCode = 'N/A'
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name || 'Unknown Facility'
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            console.error(`Failed to fetch facility for user ${user.id}`, error)
          }
        }
        
        // Count referrals created by this user
        const referralCount = referrals.filter((r: any) => 
          r.created_by === user.id || 
          (r.created_by && typeof r.created_by === 'object' && r.created_by.id === user.id)
        ).length
        
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

    let facilityName = 'Unknown Facility'
    let facilityCode = 'N/A'
    const referrals = await referralService.getReferrals()

    if (user.facility_id) {
      try {
        const facility = await facilityService.getFacilityById(String(user.facility_id))
        facilityName = facility.name || 'Unknown Facility'
        facilityCode = facility.facilityCode ?? 'N/A'
      } catch (error) {
        console.error(`Failed to fetch facility for user ${user.id}`, error)
      }
    }

    const referralCount = referrals.filter((r: any) => 
      r.created_by === user.id || 
      (r.created_by && typeof r.created_by === 'object' && r.created_by.id === user.id)
    ).length

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
        let facilityName = 'Unknown Facility'
        let facilityCode = 'N/A'
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name || 'Unknown Facility'
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            console.error(`Failed to fetch facility for user ${user.id}`, error)
          }
        }
        
        const referralCount = referrals.filter((r: any) => 
          r.created_by === user.id || 
          (r.created_by && typeof r.created_by === 'object' && r.created_by.id === user.id)
        ).length
        
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
    const filteredUsers = users.filter((u: any) => 
      u.is_active === (status === 'active')
    )
    const referrals = await referralService.getReferrals()
    
    const staffWithFacilityNames = await Promise.all(
      filteredUsers.map(async (user) => {
        let facilityName = 'Unknown Facility'
        let facilityCode = 'N/A'
        
        if (user.facility_id) {
          try {
            const facility = await facilityService.getFacilityById(String(user.facility_id))
            facilityName = facility.name || 'Unknown Facility'
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            console.error(`Failed to fetch facility for user ${user.id}`, error)
          }
        }
        
        const referralCount = referrals.filter((r: any) => 
          r.created_by === user.id || 
          (r.created_by && typeof r.created_by === 'object' && r.created_by.id === user.id)
        ).length
        
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