'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FacilityData } from '@/features/analytics/services/analytics.service' // Import the new interface

interface TopReferringFacilitiesProps {
  data?: FacilityData[]
}

export function TopReferringFacilities({ data }: TopReferringFacilitiesProps) {
  // Use the data directly from the analytics service
  const facilitiesData: FacilityData[] = data || [];

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
                  <td className="text-right py-3 px-3 font-mono">{Number(facility.referrals || 0).toLocaleString()}</td>
                  <td className="text-right py-3 px-3 font-mono">{facility.avg_turnaround}</td>
                  <td className="text-right py-3 px-3 font-mono">{facility.completion_rate}</td>
                  <td className="text-right py-3 px-3">
                    <div className={`flex items-center justify-end text-xs font-medium ${facility.trend.is_positive ? 'text-primary' : 'text-red-400'}`}>
                      {facility.trend.is_positive ? (
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
