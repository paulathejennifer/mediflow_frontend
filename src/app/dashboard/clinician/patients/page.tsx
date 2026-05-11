'use client'

import { ROLES } from '@/constants/roles'
import { SharedPatientsPage } from '@/components/shared/pages/shared-patients-page'

export default function PatientsPage() {
  return <SharedPatientsPage userRole={ROLES.CLINICIAN} />
}
