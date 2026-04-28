import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, PieChart, LineChart, TrendingUp, Stethoscope, Building } from 'lucide-react'

export function DetailedAnalytics() {
  return (
    <div className="space-y-6">
      {/* Row 1: Referral Trends and Referrals by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Referral Trends
            </CardTitle>
            <p className="text-muted-foreground text-sm">Monthly referral volume and outcomes</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Stacked Area Chart</p>
                <p className="text-sm">Total referrals (blue) • Completed referrals (green)</p>
                <p className="text-xs">Jul → Jan</p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-400">Total referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-400">Completed referrals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Referrals by Status
            </CardTitle>
            <p className="text-muted-foreground text-sm">Current distribution of referral statuses</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Pie/Donut Chart</p>
                <p className="text-sm">Status distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Turnaround Time Trend and Facility Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Turnaround Time Trend
            </CardTitle>
            <p className="text-muted-foreground text-sm">Average days to complete referrals</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-2" />
                <p>Line Graph</p>
                <p className="text-sm">Days across weeks 1-5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Building className="h-5 w-5" />
              Facility Performance
            </CardTitle>
            <p className="text-muted-foreground text-sm">Referral volume and processing time by facility</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded ${i % 3 === 0 ? 'bg-green-600' : i % 3 === 1 ? 'bg-yellow-600' : 'bg-red-600'}`}></div>
                  ))}
                </div>
                <p>Heat Map</p>
                <p className="text-sm">Facility performance matrix</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Referrals by Specialty and Top Referring Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Referrals by Specialty
            </CardTitle>
            <p className="text-muted-foreground text-sm">Distribution across medical specialties</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Bar Chart</p>
                <p className="text-sm">Specialty breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
