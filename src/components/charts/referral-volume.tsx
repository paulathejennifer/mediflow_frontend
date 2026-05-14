'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReferralVolumeData {
  month: string
  incoming: number
  outgoing: number
}

export function ReferralVolume() {
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

  // Mock data for referral volume (last 6 months)
  const generateMockData = (): ReferralVolumeData[] => {
    const monthNames = generateMonthNames();
    return [
      { month: monthNames[0], incoming: 145, outgoing: 138 },
      { month: monthNames[1], incoming: 162, outgoing: 155 },
      { month: monthNames[2], incoming: 178, outgoing: 172 },
      { month: monthNames[3], incoming: 195, outgoing: 188 },
      { month: monthNames[4], incoming: 210, outgoing: 205 },
      { month: monthNames[5], incoming: 235, outgoing: 228 }
    ];
  };

  const data = generateMockData();

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
            <BarChart data={data}>
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
