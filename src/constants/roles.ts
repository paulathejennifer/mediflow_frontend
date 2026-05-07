export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  FACILITY_ADMIN: 'facility_admin', 
  CLINICIAN: 'clinician',
  PATIENT: 'patient',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'manage_facilities',
    'manage_users', 
    'view_all_patients',
    'view_all_referrals',
    'manage_system_settings',
    'view_analytics',
    'manage_audit_logs'
  ],
  [ROLES.FACILITY_ADMIN]: [
    'manage_clinicians',
    'view_facility_patients',
    'view_facility_referrals',
    'manage_facility_settings',
    'view_facility_analytics',
    'manage_documents'
  ],
  [ROLES.CLINICIAN]: [
    'view_assigned_patients',
    'create_referrals',
    'view_own_referrals',
    'manage_voice_notes',
    'view_reports'
  ],
  [ROLES.PATIENT]: [
    'view_own_profile',
    'view_own_medical_records',
    'view_own_appointments',
    'update_own_info'
  ]
} as const
