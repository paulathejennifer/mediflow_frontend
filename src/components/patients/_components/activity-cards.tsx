'use client'

import { useState } from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scrollbar } from '@/components/shared/ui/scrollbar'

interface Activity {
  title: string
  description: string
  time: string
  status?: string
  type: 'patient' | 'referral' | 'document' | 'staff'
}

export function ActivityCards() {
  const [expanded, setExpanded] = useState(false)

  const allActivities: Activity[] = [
    { title: 'Patient information updated', description: 'Dr. Smith modified contact details', time: '2 hours ago', type: 'patient' },
    { title: 'Medical history added', description: 'New diagnosis recorded', time: '1 day ago', type: 'patient' },
    { title: 'Allergy information updated', description: 'Added shellfish allergy', time: '3 days ago', type: 'patient' },

    { title: 'Referral created', description: 'Emergency referral to Kenyatta Hospital', time: '5 hours ago', status: 'pending', type: 'referral' },
    { title: 'Referral accepted', description: 'MTRH accepted cardiology referral', time: '2 days ago', status: 'completed', type: 'referral' },

    { title: 'Lab results uploaded', description: 'Blood test results from 2024-05-08', time: '6 hours ago', type: 'document' },

    { title: 'Clinician review', description: 'Dr. Johnson reviewed patient history', time: '4 hours ago', type: 'staff' },
  ]

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
            {allActivities.map((activity, index) => (
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
            ))}
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