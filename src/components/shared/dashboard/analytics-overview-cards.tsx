import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Building2, Users, Zap, Activity } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  trend: {
    value: string
    isPositive: boolean
  }
  icon: React.ReactNode
}

function KPICard({ title, value, trend, icon }: KPICardProps) {
  return (
    <Card className="
bg-background
border border-border
rounded-2xl
transition-all duration-300
hover:border-primary/40
hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)]
hover:-translate-y-1
">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-primary bg-primary/20 rounded-lg p-2">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
        <div className={`flex items-center text-xs ${trend.isPositive ? 'text-primary' : 'text-red-400'}`}>
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{trend.value} vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsOverviewCards() {
  const analyticsData = [
    {
      title: 'New Facilities',
      value: '12',
      trend: {
        value: '+15%',
        isPositive: true
      },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Active Users',
      value: '2,847',
      trend: {
        value: '+12.3%',
        isPositive: true
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'System Health',
      value: '98.5%',
      trend: {
        value: '+1.2%',
        isPositive: true
      },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'API Requests (24h)',
      value: '1.2M',
      trend: {
        value: '-5.4%',
        isPositive: false
      },
      icon: <Zap className="h-5 w-5" />
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {analyticsData.map((data, index) => (
        <KPICard
          key={index}
          title={data.title}
          value={data.value}
          trend={data.trend}
          icon={data.icon}
        />
      ))}
    </div>
  )
}
