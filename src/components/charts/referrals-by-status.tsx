'use client'

import { PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ReferralsByStatus() {
  return (
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
  )
}
