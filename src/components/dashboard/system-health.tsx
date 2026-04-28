import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemHealth } from '@/types/dashboard'

interface SystemHealthProps {
  health: SystemHealth
}

export function SystemHealth({ health }: SystemHealthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current system status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">API Response Time</span>
            <span className="text-green-600">{health.apiResponseTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Database Status</span>
            <span className="text-green-600">{health.databaseStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Server Load</span>
            <span className="text-yellow-600">{health.serverLoad}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Storage Usage</span>
            <span className="text-blue-600">{health.storageUsage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
