import { ROLES } from './roles'

export enum PERMISSIONS {
  // Staff Management
  VIEW_STAFF = 'view_staff',
  EDIT_STAFF = 'edit_staff',
  MANAGE_PERMISSIONS = 'manage_permissions',
  ACTIVATE_DEACTIVATE_STAFF = 'activate_deactivate_staff',
  
  // Patient Management
  VIEW_PATIENTS = 'view_patients',
  EDIT_PATIENTS = 'edit_patients',
  CREATE_PATIENTS = 'create_patients',
  CREATE_REFERRALS = 'create_referrals',
  TRANSFER_PATIENTS = 'transfer_patients',
  
  // Facility Management
  VIEW_FACILITIES = 'view_facilities',
  EDIT_FACILITIES = 'edit_facilities',
  MANAGE_FACILITY_STAFF = 'manage_facility_staff',
  VIEW_FACILITY_ANALYTICS = 'view_facility_analytics',
  ACTIVATE_DEACTIVATE_FACILITIES = 'activate_deactivate_facilities',
  
  // System Management
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SYSTEM = 'manage_system',
  MANAGE_ROLES = 'manage_roles',
  
  // Clinical Operations
  VIEW_REFERRALS = 'view_referrals',
  MANAGE_REFERRALS = 'manage_referrals',
  VIEW_VOICE_NOTES = 'view_voice_notes',
  MANAGE_VOICE_NOTES = 'manage_voice_notes'
}

export const ROLE_PERMISSIONS: Record<string, PERMISSIONS[]> = {
  [ROLES.SUPER_ADMIN]: [
    // Global access to everything
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.EDIT_STAFF,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.ACTIVATE_DEACTIVATE_STAFF,
    
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.CREATE_REFERRALS,
    PERMISSIONS.TRANSFER_PATIENTS,
    
    PERMISSIONS.VIEW_FACILITIES,
    PERMISSIONS.EDIT_FACILITIES,
    PERMISSIONS.MANAGE_FACILITY_STAFF,
    PERMISSIONS.VIEW_FACILITY_ANALYTICS,
    PERMISSIONS.ACTIVATE_DEACTIVATE_FACILITIES,
    
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.MANAGE_ROLES,
    
    PERMISSIONS.VIEW_REFERRALS,
    PERMISSIONS.MANAGE_REFERRALS,
    PERMISSIONS.VIEW_VOICE_NOTES,
    PERMISSIONS.MANAGE_VOICE_NOTES
  ],
  
  [ROLES.FACILITY_ADMIN]: [
    // Facility-limited access
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.EDIT_STAFF,
    PERMISSIONS.ACTIVATE_DEACTIVATE_STAFF,
    
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.CREATE_REFERRALS,
    
    PERMISSIONS.VIEW_FACILITIES,
    PERMISSIONS.EDIT_FACILITIES,
    PERMISSIONS.MANAGE_FACILITY_STAFF,
    
    PERMISSIONS.VIEW_REFERRALS,
    PERMISSIONS.MANAGE_REFERRALS,
    PERMISSIONS.VIEW_VOICE_NOTES,
    PERMISSIONS.MANAGE_VOICE_NOTES
  ],
  
  [ROLES.CLINICIAN]: [
    // Patient management only
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.CREATE_REFERRALS,
    
    PERMISSIONS.VIEW_REFERRALS,
    PERMISSIONS.MANAGE_REFERRALS,
    PERMISSIONS.VIEW_VOICE_NOTES,
    PERMISSIONS.MANAGE_VOICE_NOTES
  ]
}

export const hasPermission = (userRole: string, permission: PERMISSIONS): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions?.includes(permission) || false
}

export const canAccessResource = (userRole: string, resource: 'staff' | 'patients' | 'facilities' | 'analytics' | 'system'): boolean => {
  switch (resource) {
    case 'staff':
      return hasPermission(userRole, PERMISSIONS.VIEW_STAFF)
    case 'patients':
      return hasPermission(userRole, PERMISSIONS.VIEW_PATIENTS)
    case 'facilities':
      return hasPermission(userRole, PERMISSIONS.VIEW_FACILITIES)
    case 'analytics':
      return hasPermission(userRole, PERMISSIONS.VIEW_ANALYTICS)
    case 'system':
      return hasPermission(userRole, PERMISSIONS.MANAGE_SYSTEM)
    default:
      return false
  }
}

export const getActionPermissions = (userRole: string, actionType: 'staff' | 'patient' | 'facility') => {
  const baseActions = {
    view_profile: hasPermission(userRole, PERMISSIONS.VIEW_STAFF) || hasPermission(userRole, PERMISSIONS.VIEW_PATIENTS) || hasPermission(userRole, PERMISSIONS.VIEW_FACILITIES),
    edit: hasPermission(userRole, PERMISSIONS.EDIT_STAFF) || hasPermission(userRole, PERMISSIONS.EDIT_PATIENTS) || hasPermission(userRole, PERMISSIONS.EDIT_FACILITIES)
  }
  
  switch (actionType) {
    case 'staff':
      return {
        ...baseActions,
        manage_permissions: hasPermission(userRole, PERMISSIONS.MANAGE_PERMISSIONS),
        activate_deactivate: hasPermission(userRole, PERMISSIONS.ACTIVATE_DEACTIVATE_STAFF)
      }
    
    case 'patient':
      return {
        ...baseActions,
        create_referral: hasPermission(userRole, PERMISSIONS.CREATE_REFERRALS),
        transfer_facility: hasPermission(userRole, PERMISSIONS.TRANSFER_PATIENTS)
      }
    
    case 'facility':
      return {
        ...baseActions,
        manage_staff: hasPermission(userRole, PERMISSIONS.MANAGE_FACILITY_STAFF),
        view_analytics: hasPermission(userRole, PERMISSIONS.VIEW_FACILITY_ANALYTICS),
        activate_deactivate: hasPermission(userRole, PERMISSIONS.ACTIVATE_DEACTIVATE_FACILITIES)
      }
    
    default:
      return baseActions
  }
}
