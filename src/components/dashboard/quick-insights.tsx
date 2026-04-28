import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared/scrollbar'
import { TrendingUp, AlertTriangle, Activity, Clock, Users, MapPin, Zap } from 'lucide-react'

export function QuickInsights() {
  const insights = [
    {
      icon: <TrendingUp className="h-4 w-4 text-orange-400" />,
      text: 'Pending referrals spike in Nairobi (+18%)'
    },
    {
      icon: <Activity className="h-4 w-4 text-blue-400" />,
      text: 'Cardiology load increasing'
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      text: 'Kenyatta Hospital top contributor'
    },
    {
      icon: <Clock className="h-4 w-4 text-red-400" />,
      text: 'Average processing time up 15% this week'
    },

    {
      icon: <MapPin className="h-4 w-4 text-purple-400" />,
      text: 'Coast region showing 23% growth'
    },
        {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      text: 'Aga Khan top contributor'
    },
  ]

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
                {insight.icon}
              </div>
              <span className="text-muted-foreground text-sm hover:text-primary/80">{insight.text}</span>
            </div>
          ))}
        </div>
          </Scrollbar>
      </CardContent>
    </Card>
  )
}
