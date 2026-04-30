import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { ReferralsByStatus } from '@/components/charts/referrals-by-status'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { FacilityPerformance } from '@/components/charts/facility-performance'
import { ReferralsBySpecialty } from '@/components/charts/referrals-by-specialty'

export function DetailedAnalytics() {
  return (
    <div className="space-y-6">
      {/* Row 1: Referral Trends and Referrals by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralTrends />
        <ReferralsByStatus />
      </div>

      {/* Row 2: Turnaround Time Trend and Facility Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TurnaroundTimeTrend />
        <FacilityPerformance />
      </div>

      {/* Row 3: Referrals by Specialty and Top Referring Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralsBySpecialty />

        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Referring Facilities
            </CardTitle>
            <p className="text-muted-foreground text-sm">Facility performance rankings</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Facility</th>
                    <th className="text-right py-2 text-muted-foreground">Referrals</th>
                    <th className="text-right py-2 text-muted-foreground">Avg Turnaround</th>
                    <th className="text-right py-2 text-muted-foreground">Completion Rate</th>
                    <th className="text-right py-2 text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="border-b border-border">
                    <td className="py-2">Kenyatta Hospital</td>
                    <td className="text-right">342</td>
                    <td className="text-right">2.1 days</td>
                    <td className="text-right">94.2%</td>
                    <td className="text-right text-green-400">↗ +12.5%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">Riverside Medical</td>
                    <td className="text-right">287</td>
                    <td className="text-right">2.8 days</td>
                    <td className="text-right">89.7%</td>
                    <td className="text-right text-green-400">↗ +8.3%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">St. Mary's Hospital</td>
                    <td className="text-right">234</td>
                    <td className="text-right">3.2 days</td>
                    <td className="text-right">91.1%</td>
                    <td className="text-right text-red-400">↘ -2.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Nairobi Medical Center</td>
                    <td className="text-right">198</td>
                    <td className="text-right">2.5 days</td>
                    <td className="text-right">87.3%</td>
                    <td className="text-right text-green-400">↗ +5.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
