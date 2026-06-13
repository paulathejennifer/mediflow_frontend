import { Calendar, MapPin, FileText } from 'lucide-react'
import { ActionDropdown } from '@/components/shared'
import { useRouter } from 'next/navigation'
import { formatTableDate } from '@/utils/date-utils'
import { referralService } from '@/features/referrals/services/referral.service'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'

interface Referral {
  id: string
  patient: string
  condition: string
  priority: 'high' | 'medium' | 'low' | 'emergency'
  status: 'draft' | 'pending' | 'submitted' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled' | 'in_transit' | 'received'
  receivingFacility: string
  date: string
  toFacilityId?: string | number
}

interface RecentReferralsTableProps {
  referrals: Referral[]
  userRole: 'super-admin' | 'facility-admin' | 'clinician'
  onViewMore?: () => void
  onActionComplete?: () => void
}

export function RecentReferralsTable({ referrals, userRole, onViewMore, onActionComplete }: RecentReferralsTableProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  // Only slice to 5 items if we are in "Recent" mode (dashboard)
  const displayedReferrals = onViewMore ? referrals.slice(0, 5) : referrals

  const truncateCondition = (text: string) => {
    const words = text.split(' ')
    if (words.length <= 3) return text
    return words.slice(0, 3).join(' ') + '...'
  }

  const handleViewDetails = (referralId: string) => {
    if (!referralId) {
      console.warn('⚠️ [NAVIGATION] Missing referral ID');
      return
    }
    
    // Normalize the role for the path and ensure absolute routing
    const pathRole = String(userRole).replace('_', '-');
    // Ensure ID is clean of any existing hashtags before building path
    const cleanId = String(referralId).replace('#', '');
    const targetPath = `/dashboard/${pathRole}/referrals/${cleanId}`;

    console.log(`🚀 [NAVIGATION] Moving to: ${targetPath}`);
    router.push(targetPath);
  }

  const handleAccept = async (id: string) => {
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10)
      await referralService.acceptReferral(numericId)
      toast.success(`Referral #${id} accepted`)
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast.error("Failed to accept referral")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10)
      await referralService.rejectReferral(numericId)
      toast.error(`Referral #${id} rejected`)
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast.error("Failed to reject referral")
    }
  }

  const handleComplete = async (id: string) => {
    try {
      // Remove any non-numeric characters and ensure no trailing slashes in logic
      const numericId = parseInt(String(id).replace(/\D/g, ''), 10)
      await referralService.completeReferral(numericId)

      toast.success(`Referral #${id} completed`)
      if (onActionComplete) {
        onActionComplete()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast.error("Failed to complete referral")
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1100px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[140px]">Referral ID</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Patient</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Condition</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Priority</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Receiving Facility</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[140px]">Date</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {displayedReferrals.map((referral) => {
            const referralToId = referral.toFacilityId || (referral as any).to_facility_id
            const currentFacilityId = user?.facility_id

            return (
              <tr key={referral.id} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    {referral.id}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-foreground text-sm">{referral.patient}</div>
                    <div className="text-xs text-muted-foreground">MRN: {referral.id.slice(-6)}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground" title={referral.condition}>
                  {truncateCondition(referral.condition)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    referral.priority === 'low' ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : referral.priority === 'medium' ? 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                    : referral.priority === 'high' ? 'bg-orange-600/10 text-orange-600 border-orange-600/20'
                    : 'bg-red-600/10 text-red-600 border-red-600/20'
                  }`}>
                    {referral.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    referral.status === 'draft' ? 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                    : referral.status === 'pending' ? 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                    : referral.status === 'submitted' ? 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                    : referral.status === 'accepted' ? 'bg-blue-600/10 text-blue-600 border-blue-600/20'
                    : referral.status === 'in_progress' ? 'bg-purple-600/10 text-purple-600 border-purple-600/20'
                    : referral.status === 'completed' ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : referral.status === 'rejected' ? 'bg-red-600/10 text-red-600 border-red-600/20'
                    : 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                  }`}>
                    {referral.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {referral.receivingFacility}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatTableDate(referral.date)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionDropdown
                    type="referral"
                    userRole={userRole}
                    referralStatus={referral.status}
                    referralToId={referralToId}
                    currentFacilityId={currentFacilityId}
                    onAccept={() => handleAccept(referral.id)}
                    onReject={() => handleReject(referral.id)}
                    onComplete={() => handleComplete(referral.id)}
                    onViewProfile={() => handleViewDetails(referral.id)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
