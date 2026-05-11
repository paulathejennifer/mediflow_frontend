'use client'

import { ROLES } from '@/constants/roles'
import { SharedCliniciansPage } from '@/components/shared/pages/shared-clinicians-page'

export default function CliniciansPage() {
  return <SharedCliniciansPage userRole={ROLES.CLINICIAN} />
}
