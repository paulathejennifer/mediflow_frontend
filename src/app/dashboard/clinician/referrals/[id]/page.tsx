'use client'

import { SharedReferralDetailsPage } from '@/components/shared/pages/shared-referral-details-page'
import { ROLES } from '@/constants/roles'

export default function ReferralDetailsPage() {
  return <SharedReferralDetailsPage userRole={ROLES.CLINICIAN} />
}
