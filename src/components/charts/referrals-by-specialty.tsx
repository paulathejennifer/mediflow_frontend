'use client'

import { BarChart3, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SpecialtyData {
  specialty: string
  count: number
  percentage: number
}

interface ReferralBySpecialtyProps {
  data?: { name: string; value: number }[]   // Matches your analytics service format
}

export function ReferralsBySpecialty({ data }: ReferralBySpecialtyProps) {
  let chartData: SpecialtyData[] = []

  if (data && data.length > 0) {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    chartData = data
      .map(item => ({
        specialty: item.name,
        count: item.value,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count) // Sort by highest count
  }

  const maxCount = chartData.length > 0 ? Math.max(...chartData.map(item => item.count)) : 1

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Referrals by Specialty
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Distribution of referrals across medical specialties
        </p>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No specialty data available yet
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={item.specialty} className="flex items-center gap-3">
                {/* Specialty Label */}
                <div className="w-32 text-sm font-medium text-white truncate" title={item.specialty}>
                  {item.specialty}
                </div>

                {/* Progress Bar */}
                <div className="flex-1 relative">
                  <div className="h-7 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className="h-7 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Count & Percentage */}
                <div className="flex items-center gap-3 min-w-[100px] justify-end">
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-400 to-blue-500" />
            <span>Referrals by Medical Specialty</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}