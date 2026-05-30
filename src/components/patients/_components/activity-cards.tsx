'use client'

import { useState } from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared/ui/scrollbar'
import { formatRelativeTime } from '@/utils/date-utils'

interface Activity {
  title: string
  description: string
  time: string
  status?: string
  type: 'patient' | 'referral' | 'document' | 'staff'
}

interface ReferralData {
  id: string
  condition: string
  to: string
  date: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'in-progress'
}

interface ActivityCardsProps {
  referrals?: ReferralData[]
  registrationDate?: string
}

export function ActivityCards({ referrals = [], registrationDate }: ActivityCardsProps) {
  const [expanded, setExpanded] = useState(false)

  // Transform real data into the Activity format
  const allActivities: Activity[] = [
    ...referrals.map(r => ({
      title: `Referral to ${r.to}`,
      description: `Reason: ${r.condition}`,
      time: r.date,
      status: r.status,
      type: 'referral' as const
    })),
    ...(registrationDate ? [{
      title: 'Patient Registered',
      description: 'Initial record created in the system',
      time: registrationDate,
      type: 'patient' as const
    }] : [])
  ]
  .sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
  .map(activity => ({
    ...activity,
    time: formatRelativeTime(activity.time)
  }))

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'patient':
        return 'bg-blue-500'
      case 'referral':
        return 'bg-cyan-500'
      case 'document':
        return 'bg-purple-500'
      case 'staff':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative">
          
          {/* CONTENT */}
          <Scrollbar
            className={`
              space-y-3 transition-all duration-500
              ${expanded ? 'max-h-[1000px]' : 'max-h-56'}
            `}
          >
            {allActivities.length > 0 ? allActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                    {activity.status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity recorded</p>
                <p className="text-xs text-muted-foreground/50">New referrals and updates will appear here</p>
              </div>
            )}
          </Scrollbar>

          {/* FADE EFFECT */}
          {!expanded && (
            <div className="absolute bottom-14 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
          )}

          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-primary rounded-lg px-4 py-2 animate-bounce"
          >
            <span className="inline-block">
              {expanded ? 'Show Less' : 'Click to Show More'}
            </span>

            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}