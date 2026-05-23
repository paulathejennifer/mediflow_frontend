'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReferralVolumeData {
  month: string
  incoming: number
  outgoing: number
}

interface ReferralVolumeProps {
  data?: ReferralVolumeData[]
  isLoading?: boolean
}

export function ReferralVolume({ data, isLoading = false }: ReferralVolumeProps) {
  // Generate month names for the last 6 months
  const generateMonthNames = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthNames = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthNames.push(months[date.getMonth()]);
    }
    
    return monthNames;
  };

  // Transform any incoming data to use month names (limit to 6 months)
  const transformData = (incomingData: ReferralVolumeData[]) => {
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
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Referral Volume
        </CardTitle>
        <p className="text-muted-foreground text-sm">Monthly incoming vs outgoing referrals (last 6 months)</p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mx-auto -ml-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              
              <XAxis 
                stroke="hsl(var(--muted-foreground))" 
                dataKey="month"
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
              
              <Legend />
              
              <Bar 
                dataKey="incoming" 
                fill="#2563EB" // blue
                name="Incoming"
                radius={[4, 4, 0, 0]}
              />
              
              <Bar 
                dataKey="outgoing" 
                fill="#67e8f9" // light cyan
                name="Outgoing"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
