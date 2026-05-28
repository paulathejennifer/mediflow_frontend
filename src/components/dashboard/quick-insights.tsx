import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared'
import { TrendingUp, AlertTriangle, Activity, Clock, Users, MapPin, Zap, LucideIcon, Award, CheckCircle, Globe, Target } from 'lucide-react'

interface Insight {
  icon: LucideIcon
  text: string
  color: string
}

interface QuickInsightData {
  label: string
  value: string
}

interface QuickInsightsProps {
  insights?: QuickInsightData[]
  isLoading?: boolean
}

export function QuickInsights({ insights = [], isLoading = false }: QuickInsightsProps) {
  if (isLoading) {
    return (
      <Card className="bg-background border border-border rounded-2xl h-[400px]">
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="h-full bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (insights.length === 0) {
    return (
      <Card className="bg-background border border-border rounded-2xl h-[400px]">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            QUICK INSIGHTS
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <p className="text-muted-foreground">No insights available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background border border-border rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1 h-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
          QUICK INSIGHTS
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
          <Scrollbar className="h-full">
        <div className="space-y-4">
          {insights.map((insight, index) => {
            let IconComponent: LucideIcon = Activity
            let iconColor = 'text-primary'

            switch (insight.label) {
              case 'Top Contributor':
                IconComponent = Award
                iconColor = 'text-yellow-500'
                break
              case 'Active Hub':
                IconComponent = MapPin
                iconColor = 'text-blue-500'
                break
              case 'SLA Compliance':
                IconComponent = CheckCircle
                iconColor = 'text-green-500'
                break
              case 'Network Milestone':
                IconComponent = Globe
                iconColor = 'text-purple-500'
                break
              case 'User Engagement':
                IconComponent = Users
                iconColor = 'text-indigo-500'
                break
              default:
                IconComponent = Activity
                iconColor = 'text-gray-500'
            }

            return (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground">{insight.label}</p>
                  <p className="text-xs text-muted-foreground">{insight.value}</p>
                </div>
              </div>
            )
          })}
        </div>
          </Scrollbar>
      </CardContent>
    </Card>
  )
}
