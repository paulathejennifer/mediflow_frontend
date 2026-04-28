import { UserRole } from './roles'
import { ROUTES } from './routes'

export interface NavLink {
  title: string
  href: string
  icon?: string
  children?: NavLink[]
}

export const NAV_LINKS: Record<UserRole, NavLink[]> = {
  super_admin: [
    {
      title: 'Dashboard',
      href: ROUTES.SUPER_ADMIN.DASHBOARD,
      icon: 'LayoutDashboard'
    },
    {
      title: 'Facilities',
      href: ROUTES.SUPER_ADMIN.FACILITIES,
      icon: 'Building2'
    },
    {
      title: 'Users',
      href: ROUTES.SUPER_ADMIN.USERS,
      icon: 'Users'
    },
    {
      title: 'Patients',
      href: ROUTES.SUPER_ADMIN.PATIENTS,
      icon: 'UserCheck'
    },
    {
      title: 'Referrals',
      href: ROUTES.SUPER_ADMIN.REFERRALS,
      icon: 'FileText'
    },
    {
      title: 'Analytics',
      href: ROUTES.SUPER_ADMIN.ANALYTICS,
      icon: 'BarChart3'
    },
    {
      title: 'Audit Logs',
      href: ROUTES.SUPER_ADMIN.AUDIT_LOGS,
      icon: 'ScrollText'
    },
    {
      title: 'Settings',
      href: ROUTES.SUPER_ADMIN.SETTINGS,
      icon: 'Settings'
    }
  ],
  
  facility_admin: [
    {
      title: 'Dashboard',
      href: ROUTES.FACILITY_ADMIN.DASHBOARD,
      icon: 'LayoutDashboard'
    },
    {
      title: 'Clinicians',
      href: ROUTES.FACILITY_ADMIN.CLINICIANS,
      icon: 'Stethoscope'
    },
    {
      title: 'Patients',
      href: ROUTES.FACILITY_ADMIN.PATIENTS,
      icon: 'UserCheck'
    },
    {
      title: 'Referrals',
      href: ROUTES.FACILITY_ADMIN.REFERRALS,
      icon: 'FileText'
    },
    {
      title: 'Documents',
      href: ROUTES.FACILITY_ADMIN.DOCUMENTS,
      icon: 'FolderOpen'
    },
    {
      title: 'Voice Notes',
      href: ROUTES.FACILITY_ADMIN.VOICE_NOTES,
      icon: 'Mic'
    },
    {
      title: 'Reports',
      href: ROUTES.FACILITY_ADMIN.REPORTS,
      icon: 'ChartBar'
    },
    {
      title: 'Settings',
      href: ROUTES.FACILITY_ADMIN.SETTINGS,
      icon: 'Settings'
    }
  ],
  
  clinician: [
    {
      title: 'Dashboard',
      href: ROUTES.CLINICIAN.DASHBOARD,
      icon: 'LayoutDashboard'
    },
    {
      title: 'Patients',
      href: ROUTES.CLINICIAN.PATIENTS,
      icon: 'UserCheck'
    },
    {
      title: 'Referrals',
      href: ROUTES.CLINICIAN.REFERRALS,
      icon: 'FileText'
    },
    {
      title: 'Documents',
      href: ROUTES.CLINICIAN.DOCUMENTS,
      icon: 'FolderOpen'
    },
    {
      title: 'Voice Notes',
      href: ROUTES.CLINICIAN.VOICE_NOTES,
      icon: 'Mic'
    },
    {
      title: 'Reports',
      href: ROUTES.CLINICIAN.REPORTS,
      icon: 'ChartBar'
    },
    {
      title: 'Settings',
      href: ROUTES.CLINICIAN.SETTINGS,
      icon: 'Settings'
    }
  ]
}
