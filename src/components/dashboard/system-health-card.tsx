import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface HealthCheck {
  name: string
  status: 'healthy' | 'warning' | 'error'
  message: string
}

const healthChecks: HealthCheck[] = [
  { name: 'API Server', status: 'healthy', message: 'All systems operational' },
  { name: 'Database', status: 'healthy', message: 'Connection stable' },
  { name: 'AI Processing', status: 'warning', message: 'Slight delay in processing' },
  { name: 'Email Service', status: 'healthy', message: 'Deliveries normal' },
]

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

const statusColors = {
  healthy: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

export function SystemHealthCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthChecks.map((check) => {
            const Icon = statusIcons[check.status]
            return (
              <div key={check.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${statusColors[check.status]}`} />
                  <span className="text-sm font-medium">{check.name}</span>
                </div>
                <span className="text-xs text-gray-500">{check.message}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
