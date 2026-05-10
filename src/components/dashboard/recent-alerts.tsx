'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scrollbar } from '@/components/shared'
import { ChevronDown, ChevronRight, Circle } from 'lucide-react'

interface AlertItem {
  id: string
  time: string
  status: 'success' | 'warning' | 'info' | 'danger'
  title: string
  details: string[]
}

const alertData: AlertItem[] = [
  {
    id: '1',
    time: '15 minutes ago',
    status: 'success',
    title: 'Facility: "Riverside Medical Center" successfully onboarded',
    details: [
      'Added 24 clinicians to the system',
      'Facility Level: Level 4 (Regional Hospital)',
      'Location: Kilimani, Nairobi'
    ]
  },
  {
    id: '2',
    time: '2 hours ago',
    status: 'warning',
    title: 'AI Service Health Check: Whisper Large-v3 processing delay detected',
    details: [
      'Current queue: 12 voice notes pending',
      'Average processing time: 4.2 minutes (normal: 2.3)'
    ]
  },
  {
    id: '3',
    time: '4 hours ago',
    status: 'info',
    title: 'Bulk user activation completed at "St. Mary\'s Hospital"',
    details: [
      '15 clinicians activated successfully',
      '2 accounts pending verification',
      'Role assignments: 12 clinicians, 3 facility admins'
    ]
  },
  {
    id: '4',
    time: '6 hours ago',
    status: 'success',
    title: 'System milestone achieved: 10,000th referral processed',
    details: [
      'Total processing time: 1.8 minutes average',
      'AI accuracy: 98.7% for this batch',
      'Facilities involved: 127 across 12 counties'
    ]
  },
  {
    id: '5',
    time: '8 hours ago',
    status: 'warning',
    title: 'Security audit completed successfully',
    details: [
      '45,892 user sessions analyzed',
      '3 suspicious login attempts blocked',
      '2 facilities required password policy updates',
      'Overall security score: 97.3/100',
      'Next audit scheduled: 30 days'
    ]
  }
]

function getStatusColor(status: AlertItem['status']) {
  switch (status) {
    case 'success': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'info': return 'text-blue-500'
    case 'danger': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

function getStatusIcon(status: AlertItem['status']) {
  return <Circle className={`h-3 w-3 ${getStatusColor(status)} fill-current`} />
}

export function RecentAlerts() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <Card className="bg-background border border-border rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1 h-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">Recent Alerts / Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
          <Scrollbar className="h-full">
        <div className="space-y-4">
          {alertData.map((alert, index) => (
            <div 
              key={alert.id} 
              className={`border-l-2 border-primary/50 pl-4 cursor-pointer transition-colors hover:bg-gray-800/30 ${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900'}`}
              onClick={() => toggleExpanded(alert.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(alert.status)}
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-foreground font-medium text-sm mb-2">{alert.title}</p>

                  {expandedItems.has(alert.id) && (
                    <div className="ml-5 space-y-1">
                      {alert.details.map((detail, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  {expandedItems.has(alert.id) ? (
                    <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
          </Scrollbar>
      </CardContent>
    </Card>
  )
}
