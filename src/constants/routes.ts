import { UserRole } from './roles'

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Super Admin
  SUPER_ADMIN: {
    DASHBOARD: '/dashboard/super-admin',
    FACILITIES: '/dashboard/super-admin/facilities',
    FACILITY_DETAIL: (id: string) => `/dashboard/super-admin/facilities/${id}`,
    USERS: '/dashboard/super-admin/users',
    USER_DETAIL: (id: string) => `/dashboard/super-admin/users/${id}`,
    PATIENTS: '/dashboard/super-admin/patients',
    REFERRALS: '/dashboard/super-admin/referrals',
    AUDIT_LOGS: '/dashboard/super-admin/audit-logs',
    ANALYTICS: '/dashboard/super-admin/analytics',
    NOTIFICATIONS: '/dashboard/super-admin/notifications',
    SETTINGS: '/dashboard/super-admin/settings'
  },
  
  // Facility Admin
  FACILITY_ADMIN: {
    DASHBOARD: '/dashboard/facility-admin',
    CLINICIANS: '/dashboard/facility-admin/clinicians',
    CLINICIAN_DETAIL: (id: string) => `/dashboard/facility-admin/clinicians/${id}`,
    PATIENTS: '/dashboard/facility-admin/patients',
    REFERRALS: '/dashboard/facility-admin/referrals',
    DOCUMENTS: '/dashboard/facility-admin/documents',
    VOICE_NOTES: '/dashboard/facility-admin/voice-notes',
    REPORTS: '/dashboard/facility-admin/reports',
    NOTIFICATIONS: '/dashboard/facility-admin/notifications',
    SETTINGS: '/dashboard/facility-admin/settings'
  },
  
  // Clinician
  CLINICIAN: {
    DASHBOARD: '/dashboard/clinician',
    PATIENTS: '/dashboard/clinician/patients',
    REFERRALS: '/dashboard/clinician/referrals',
    DOCUMENTS: '/dashboard/clinician/documents',
    VOICE_NOTES: '/dashboard/clinician/voice-notes',
    REPORTS: '/dashboard/clinician/reports',
    NOTIFICATIONS: '/dashboard/clinician/notifications',
    SETTINGS: '/dashboard/clinician/settings'
  }
} as const

export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return ROUTES.SUPER_ADMIN.DASHBOARD
    case 'facility_admin':
      return ROUTES.FACILITY_ADMIN.DASHBOARD
    case 'clinician':
      return ROUTES.CLINICIAN.DASHBOARD
    default:
      return ROUTES.LOGIN
  }
}
