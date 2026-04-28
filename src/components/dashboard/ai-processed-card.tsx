import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, Brain } from 'lucide-react'

interface AIProcessedItem {
  id: string
  patientName: string
  referralType: string
  status: 'processing' | 'completed' | 'queued'
  processingTime?: string
  confidence?: number
}

const recentItems: AIProcessedItem[] = [
  {
    id: '1',
    patientName: 'John Smith',
    referralType: 'Cardiology',
    status: 'completed',
    processingTime: '2.3s',
    confidence: 94
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    referralType: 'Orthopedics',
    status: 'processing',
    confidence: 87
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    referralType: 'Neurology',
    status: 'queued'
  }
]

const statusConfig = {
  processing: {
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Processing'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Completed'
  },
  queued: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    label: 'Queued'
  }
}

export function AIProcessedCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Processing</span>
        </CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentItems.map((item) => {
            const config = statusConfig[item.status]
            const Icon = config.icon
            
            return (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.patientName}</p>
                    <p className="text-xs text-gray-500">{item.referralType}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {config.label}
                  </Badge>
                  {item.processingTime && (
                    <p className="text-xs text-gray-500 mt-1">{item.processingTime}</p>
                  )}
                  {item.confidence && (
                    <p className="text-xs text-gray-500 mt-1">{item.confidence}% confident</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
