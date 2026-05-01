'use client'

import { BarChart3, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReferralReasonData {
  reason: string
  count: number
  percentage: number
}

export function ReferralReasons() {
  // Mock data for referral reasons based on the enum
  const data: ReferralReasonData[] = [
    { reason: 'Consultation', count: 85, percentage: 36 },
    { reason: 'Diagnosis', count: 62, percentage: 26 },
    { reason: 'Emergency', count: 38, percentage: 16 },
    { reason: 'Follow up', count: 28, percentage: 12 },
    { reason: 'Surgery', count: 15, percentage: 6 },
    { reason: '2nd opinion', count: 9, percentage: 4 }
  ];

  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Referral Reasons
        </CardTitle>
        <p className="text-muted-foreground text-sm">Distribution of referral purposes</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.reason} className="flex items-center gap-3">
              {/* Label */}
              <div className="w-20 text-sm text-gray-400 text-right">
                {item.reason}
              </div>
              
              {/* Bar container */}
              <div className="flex-1 relative">
                {/* Background bar */}
                <div className="h-6 bg-gray-900 rounded-full">
                  {/* Filled bar */}
                  <div
                    className="h-6 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                
                {/* Count label on bar */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                  {item.count}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#67e8f9' }}></div>
            <span className="text-sm text-gray-400">Referral count by reason</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
