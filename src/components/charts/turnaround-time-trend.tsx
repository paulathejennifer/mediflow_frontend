'use client'

import { LineChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TurnaroundTimeTrend() {
  return (
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
  )
}
