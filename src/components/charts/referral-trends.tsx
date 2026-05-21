'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReferralData {
  month: string
  total: number
  completed: number
}

interface ReferralTrendsProps {
  data?: ReferralData[]
}

export function ReferralTrends({ data }: ReferralTrendsProps) {
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
  const transformData = (incomingData: ReferralData[]) => {
    const monthNames = generateMonthNames();
    return incomingData.slice(0, 6).map((item, index) => ({
      ...item,
      month: monthNames[index] || item.month
    }));
  };

  const chartData = data ? transformData(data) : []

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Referral Trends
        </CardTitle>
        <p className="text-muted-foreground text-sm">Monthly referral volume and outcomes</p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mx-auto -ml-4">
          <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
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
            
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#2563EB" // blue (same as documents in system activity)
              fill="#2563EB"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#67e8f9" // light cyan (same as patients in system activity)
              fill="#67e8f9"
              fillOpacity={0.7}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2563EB' }}></div>
            <span className="text-sm text-gray-400">Total referrals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#67E8F9' }}></div>
            <span className="text-sm text-gray-400">Completed referrals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
