import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared'
import { TrendingUp, AlertTriangle, Activity, Clock, Users, MapPin, Zap, LucideIcon } from 'lucide-react'

interface Insight {
  icon: LucideIcon
  text: string
  color: string
}

interface QuickInsightsProps {
  insights?: Insight[]
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
        <div className="space-y-5">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="scale-110">
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <span className="text-muted-foreground text-sm hover:text-primary">{insight.text}</span>
            </div>
          ))}
        </div>
          </Scrollbar>
      </CardContent>
    </Card>
  )
}
