'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemActivityData {
  month: string
  patients: number
  referrals: number
  documents: number
}

interface SystemActivityTrendProps {
  data?: SystemActivityData[]
  isLoading?: boolean
}

export function SystemActivityTrend({ data, isLoading = false }: SystemActivityTrendProps) {
  // Mock data for development - this will be replaced with real data
  const mockData: SystemActivityData[] = [
    { month: '0', patients: 120, referrals: 80, documents: 200 },
    { month: '1', patients: 150, referrals: 95, documents: 220 },
    { month: '2', patients: 180, referrals: 110, documents: 250 },
    { month: '3', patients: 220, referrals: 130, documents: 280 },
    { month: '4', patients: 260, referrals: 155, documents: 320 },
    { month: '5', patients: 310, referrals: 185, documents: 380 },
    { month: '6', patients: 380, referrals: 220, documents: 450 }
  ]

  const chartData = data || mockData

  if (isLoading) {
    return (
      <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-white">System Activity Trend</CardTitle>
        <CardDescription>
          Time Period: Last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

            <XAxis stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />

            <Tooltip />

            <Line 
              type="monotone" 
              dataKey="patients" 
              stroke="#67E8F9"
              strokeOpacity={0.9}
              strokeWidth={2.5}
            />

            <Line 
              type="monotone" 
              dataKey="referrals" 
              stroke="#38BDF8"
              strokeOpacity={0.9}
              strokeWidth={2.5}
            />

            <Line 
              type="monotone" 
              dataKey="documents" 
              stroke="#2563EB"
              strokeOpacity={0.9}
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
