import { userService, User } from './user.service'
import { facilitiesService } from './facilities.service'
import { referralService } from './referral.service'

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
            const facility = await facilitiesService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        // Count referrals created by this user
        const referralCount = referrals.filter(r => r.created_by === user.id).length
        
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
        const facility = await facilitiesService.getFacilityById(String(user.facility_id))
        facilityName = facility.name
        facilityCode = facility.facilityCode ?? 'N/A'
      } catch (error) {
        facilityName = 'Unknown Facility'
        facilityCode = 'N/A'
      }
    }

    const referralCount = referrals.filter(r => r.created_by === id).length
    
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
            const facility = await facilitiesService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        const referralCount = referrals.filter(r => r.created_by === user.id).length
        
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
            const facility = await facilitiesService.getFacilityById(String(user.facility_id))
            facilityName = facility.name
            facilityCode = facility.facilityCode ?? 'N/A'
          } catch (error) {
            facilityName = 'Unknown Facility'
            facilityCode = 'N/A'
          }
        }
        
        const referralCount = referrals.filter(r => r.created_by === user.id).length
        
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
