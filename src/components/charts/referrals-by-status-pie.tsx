'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COLORS } from '@/constants/colors'

interface StatusData {
  name: string
  value: number
}

interface ReferralsByStatusPieProps {
  data?: StatusData[]
}

// Map status names to colors (only key workflow statuses are displayed)
const statusColorMap: Record<string, string> = {
  'submitted': COLORS.referralStatus.submitted,
  'accepted': COLORS.referralStatus.accepted,
  'in_transit': COLORS.referralStatus.in_transit,
  'in_progress': COLORS.referralStatus.in_transit,
  'completed': COLORS.referralStatus.completed,
}

function getColorForStatus(name: string): string {
  const lowerName = name.toLowerCase()
  return statusColorMap[lowerName] || '#6B7280'
}

export function ReferralsByStatusPie({ data }: ReferralsByStatusPieProps) {
  // Use real data only. If empty, show empty state.
  const chartData = data || []

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Referrals by Status
        </CardTitle>
        <p className="text-muted-foreground text-sm">Distribution of referral statuses</p>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No referral data found for this period
          </div>
        ) : (
        <div className="relative w-full max-w-md mx-auto -ml-4">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorForStatus(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17, 24, 39)', // gray-900
                  border: '1px solid rgb(55, 65, 81)', // gray-700
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'rgb(255, 255, 255)' }} // white (foreground)
                itemStyle={{ color: 'rgb(255, 255, 255)' }} // white (foreground)
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  )
}
