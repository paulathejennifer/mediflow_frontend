'use client'

import { ROLES } from '@/constants/roles'
import { SharedDashboardPage } from '@/components/shared/pages/shared-dashboard-page'

export default function FacilityAdminDashboard() {
  return <SharedDashboardPage userRole={ROLES.FACILITY_ADMIN} />
}
