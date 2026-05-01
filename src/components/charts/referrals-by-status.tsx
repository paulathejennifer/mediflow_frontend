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

export function ReferralsByStatus() {
  // Mock data for referral funnel (excluding draft)
  const funnelData: FunnelData[] = [
    { stage: 'Submitted', count: 235, percentage: 100, color: COLORS.referralStatus.submitted },
    { stage: 'Accepted', count: 198, percentage: 84, color: COLORS.referralStatus.accepted },
    { stage: 'In Transit', count: 176, percentage: 75, color: COLORS.referralStatus.in_transit },
    { stage: 'Received', count: 162, percentage: 69, color: COLORS.referralStatus.received, textColor: '#2563EB'  },
    { stage: 'Completed', count: 145, percentage: 62, color: COLORS.referralStatus.completed, textColor: '#2563EB' }
  ];

  // Calculate widths for funnel effect (percentage of max width)
  const maxWidth = 100;
  const getFunnelWidth = (percentage: number) => (percentage / 100) * maxWidth;

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
