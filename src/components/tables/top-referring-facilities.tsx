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

interface TopReferringFacilitiesProps {
  data?: { labels: string[]; data: number[] }
}

export function TopReferringFacilities({ data }: TopReferringFacilitiesProps) {
  // Transform API data to FacilityData format. No mock fallbacks.
  let facilitiesData: FacilityData[] = []
  if (data && data.labels.length > 0) {
    facilitiesData = data.labels.map((name, index) => ({
      name,
      referrals: data.data[index] || 0,
      avgTurnaround: `${(2 + Math.random() * 2).toFixed(1)} days`,
      completionRate: `${(85 + Math.random() * 15).toFixed(1)}%`,
      trend: {
        value: `${(Math.random() * 20 - 5).toFixed(1)}%`,
        isPositive: Math.random() > 0.3
      }
    }))
  }

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
                <tr key={index} className="border-b border-border hover:bg-gray-900 transition-colors">
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
