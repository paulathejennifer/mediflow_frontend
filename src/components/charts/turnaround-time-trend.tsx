'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LineChart as LineChartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TurnaroundData {
  week: string
  days: number
}

interface TurnaroundTimeTrendProps {
  data?: TurnaroundData[]
}

export function TurnaroundTimeTrend({ data }: TurnaroundTimeTrendProps) {
  // Default mock data if no data provided
  const defaultData: TurnaroundData[] = [
    { week: 'Week 1', days: 4.2 },
    { week: 'Week 2', days: 3.8 },
    { week: 'Week 3', days: 4.5 },
    { week: 'Week 4', days: 3.5 }
  ]

  const chartData = data && data.length > 0 ? data : defaultData

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <LineChartIcon className="h-5 w-5" />
          Turnaround Time Trend
        </CardTitle>
        <p className="text-muted-foreground text-sm">Average days to complete referrals (last 4 weeks)</p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mx-auto -ml-4">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              
              <XAxis 
                stroke="hsl(var(--muted-foreground))" 
                dataKey="week"
                tick={{ fontSize: 12 }}
              />
              
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(17, 24, 39)', // gray-900
                  border: '1px solid rgb(55, 65, 81)', // gray-700
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'rgb(156, 163, 175)' }} // gray-400
              />
              
              <Line 
                type="monotone" 
                dataKey="days" 
                stroke="#67e8f9" // emerald green
                strokeWidth={2}
                dot={{ fill: '#43dcf0', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#67e8f9' }}></div>
            <span className="text-sm text-gray-400">Avg. turnaround days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
