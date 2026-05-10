import { Badge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Calendar, MapPin } from 'lucide-react'
import { ActionDropdown } from '@/components/shared'

interface Referral {
  id: string
  patient: string
  condition: string
  priority: 'high' | 'medium' | 'low'
  status: 'draft' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
  receivingFacility: string
  date: string
}

interface RecentReferralsTableProps {
  referrals: Referral[]
  userRole: 'facility-admin' | 'clinician'
}

interface RecentReferralsTableProps {
  referrals: Referral[]
  userRole: 'facility-admin' | 'clinician'
  onViewMore?: () => void
}

export function RecentReferralsTable({ referrals, userRole, onViewMore }: RecentReferralsTableProps) {
  const displayedReferrals = referrals.slice(0, 5)

  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1000px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[200px]">Patient</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Condition</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Priority</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Receiving Facility</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[120px]">Date</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {displayedReferrals.map((referral) => (
            <tr key={referral.id} className="border-b border-gray-800 hover:bg-gray-900">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{referral.patient}</div>
                    <div className="text-xs text-muted-foreground">MRN: {referral.id.slice(-6)}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{referral.condition}</td>
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
                  {referral.date}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <ActionDropdown
                  type="referral"
                  userRole={userRole}
                  onViewDetails={() => console.log('View details:', referral.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* View More Button */}
      {referrals.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewMore}
            className="text-primary hover:text-primary/80"
          >
            View More Referrals
          </Button>
        </div>
      )}
    </div>
  )
}
