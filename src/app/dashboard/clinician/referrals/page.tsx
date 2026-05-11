'use client'

import { SharedReferralsPage } from '@/components/shared/pages/shared-referrals-page'
import { ROLES } from '@/constants/roles'

export default function ReferralsPage() {
  return <SharedReferralsPage userRole={ROLES.CLINICIAN} />
}
