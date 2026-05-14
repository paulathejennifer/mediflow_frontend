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
    STAFF: '/dashboard/super-admin/staff',
    STAFF_DETAIL: (id: string) => `/dashboard/super-admin/staff/${id}`,
    PATIENTS: '/dashboard/super-admin/patients',
    PATIENT_DETAIL: (id: string) => `/dashboard/super-admin/patients/${id}`,
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
    PATIENT_DETAIL: (id: string) => `/dashboard/facility-admin/patients/${id}`,
    REFERRALS: '/dashboard/facility-admin/referrals',
    REFERRAL_DETAIL: (id: string) => `/dashboard/facility-admin/referrals/${id}`,
    VOICE_NOTES: '/dashboard/facility-admin/voice-notes',
    ANALYTICS: '/dashboard/facility-admin/analytics',
    DOCUMENTS: '/dashboard/facility-admin/documents',
    NOTIFICATIONS: '/dashboard/facility-admin/notifications',
    SETTINGS: '/dashboard/facility-admin/settings'
  },
  
  // Clinician
  CLINICIAN: {
    DASHBOARD: '/dashboard/clinician',
    CLINICIANS: '/dashboard/clinician/clinicians',
    CLINICIAN_DETAIL: (id: string) => `/dashboard/clinician/clinicians/${id}`,
    PATIENTS: '/dashboard/clinician/patients',
    PATIENT_DETAIL: (id: string) => `/dashboard/clinician/patients/${id}`,
    REFERRALS: '/dashboard/clinician/referrals',
    REFERRAL_DETAIL: (id: string) => `/dashboard/clinician/referrals/${id}`,
    VOICE_NOTES: '/dashboard/clinician/voice-notes',
    ANALYTICS: '/dashboard/clinician/analytics',
    DOCUMENTS: '/dashboard/clinician/documents',
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
