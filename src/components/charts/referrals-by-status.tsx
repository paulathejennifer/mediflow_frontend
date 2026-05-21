'use client'

import { PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COLORS } from '@/constants/colors'

interface FunnelData {
  stage: string
  count: number
  percentage: number
  color: string
  textColor?: string
}

interface ReferralsByStatusProps {
  data?: FunnelData[]
  isLoading?: boolean
}

export function ReferralsByStatus({ data, isLoading = false }: ReferralsByStatusProps) {
  // Calculate widths for funnel effect (percentage of max width)
  const maxWidth = 100;
  const getFunnelWidth = (percentage: number) => (percentage / 100) * maxWidth;

  if (isLoading) {
    return (
      <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Referrals by Status
          </CardTitle>
          <p className="text-muted-foreground text-sm">Referral flow and conversion rates</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No referral data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const funnelData = data

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Referrals by Status
        </CardTitle>
        <p className="text-muted-foreground text-sm">Referral flow and conversion rates</p>
      </CardHeader>
      <CardContent>
        {/* Funnel Chart */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="relative w-full max-w-xs mx-auto pl-20 pr-8">
            {funnelData.map((item, index) => (
              <div key={item.stage} className="relative mb-1">
                {/* Funnel section */}
                <div
                  className="relative mx-auto flex items-center justify-center text-white font-semibold text-xs transition-all duration-300"
                  style={{
                    width: `${getFunnelWidth(item.percentage)}%`,
                    height: '36px',
                    backgroundColor: item.color,
                    borderRadius: '3px',
                  }}
                >
                  {/* Count inside funnel */}
                  <span className={item.textColor ? '' : 'text-white'} style={{ color: item.textColor }}>{item.count}</span>
                </div>
                
                {/* Label outside funnel */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full flex items-center gap-2 mr-3">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.stage}</span>
                  <div className="w-4 h-px bg-gray-600"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Funnel metrics */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Drop-off rate</span>
            <span className="text-amber-400 font-medium">38% total loss</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Completion rate</span>
            <span className="text-emerald-400 font-medium">62% of submitted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
