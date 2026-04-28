'use client'

import { DetailedAnalytics } from '@/components/dashboard/detailed-analytics'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed system analytics and insights</p>
        </div>
        
        <div className="mt-8">
          <DetailedAnalytics />
        </div>
      </div>
    </div>
  )
}
