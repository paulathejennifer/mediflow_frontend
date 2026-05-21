'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
  // Generate month names for the last 6 months
  const generateMonthNames = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthNames = [];
    
    // Generate exactly 6 months (5 months back + current month)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthNames.push(months[date.getMonth()]);
    }
    
    return monthNames; // This should already be exactly 6 months
  };

  // Transform any incoming data to use month names (limit to 6 months)
  const transformData = (incomingData: SystemActivityData[]) => {
    const monthNames = generateMonthNames();
    return incomingData.slice(0, 6).map((item, index) => ({
      ...item,
      month: monthNames[index] || item.month
    }));
  };

  const chartData = data ? transformData(data) : []

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
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

            <XAxis 
            stroke="hsl(var(--muted-foreground))" 
            dataKey="month"
            tick={{ fontSize: 12 }}
          />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 13 }}/>

            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(17, 24, 39)', // gray-900
                border: '1px solid rgb(55, 65, 81)', // gray-700
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'rgb(156, 163, 175)' }} // gray-400
            />

            <Area 
              type="monotone" 
              dataKey="patients" 
              stackId="1"
              stroke="#67E8F9"
              fill="#67E8F9"
              fillOpacity={0.6}
              strokeWidth={2}
            />

            <Area 
              type="monotone" 
              dataKey="referrals" 
              stackId="1"
              stroke="#38BDF8"
              fill="#38BDF8"
              fillOpacity={0.4}
              strokeWidth={2}
            />

            <Area 
              type="monotone" 
              dataKey="documents" 
              stackId="1"
              stroke="#2563EB"
              fill="#2563EB"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
