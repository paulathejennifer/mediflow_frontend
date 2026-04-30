'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FacilityData {
  name: string
  referrals: number
  avgTurnaround: string
  completionRate: string
  trend: {
    value: string
    isPositive: boolean
  }
}

export function TopReferringFacilities() {
  const facilitiesData: FacilityData[] = [
    {
      name: 'Kenyatta Hospital',
      referrals: 342,
      avgTurnaround: '2.1 days',
      completionRate: '94.2%',
      trend: {
        value: '+12.5%',
        isPositive: true
      }
    },
    {
      name: 'Riverside Medical',
      referrals: 287,
      avgTurnaround: '2.8 days',
      completionRate: '89.7%',
      trend: {
        value: '+8.3%',
        isPositive: true
      }
    },
    {
      name: "St. Mary's Hospital",
      referrals: 234,
      avgTurnaround: '3.2 days',
      completionRate: '91.1%',
      trend: {
        value: '-2.1%',
        isPositive: false
      }
    },
    {
      name: 'Nairobi Medical Center',
      referrals: 198,
      avgTurnaround: '2.5 days',
      completionRate: '87.3%',
      trend: {
        value: '+5.7%',
        isPositive: true
      }
    }
  ]

  return (
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
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Facility</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Referrals</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Avg Turnaround</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Completion Rate</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {facilitiesData.map((facility, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 font-medium">{facility.name}</td>
                  <td className="text-right py-3 px-3 font-mono">{facility.referrals.toLocaleString()}</td>
                  <td className="text-right py-3 px-3 font-mono">{facility.avgTurnaround}</td>
                  <td className="text-right py-3 px-3 font-mono">{facility.completionRate}</td>
                  <td className="text-right py-3 px-3">
                    <div className={`flex items-center justify-end text-xs font-medium ${facility.trend.isPositive ? 'text-primary' : 'text-red-400'}`}>
                      {facility.trend.isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-mono">{facility.trend.value}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
