import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle, FileText, Building2, Users, Zap } from 'lucide-react'

export interface KPICardData {
  title: string
  value: string | number
  trend?: {
    value: string
    isPositive: boolean
  }
  icon: React.ReactNode
}

interface KPICardProps {
  title: string
  value: string | number
  trend?: {
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
        {trend && (
          <div className={`flex items-center text-xs ${trend.isPositive ? 'text-primary' : 'text-red-400'}`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{trend.value} vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewCards({ data }: { data: KPICardData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          trend={kpi.trend}
          icon={kpi.icon}
        />
      ))}
    </div>
  )
}
