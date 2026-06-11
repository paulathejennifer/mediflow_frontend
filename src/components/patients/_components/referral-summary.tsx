'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, History } from 'lucide-react'

interface ReferralData {
  id: string
  condition: string
  to: string
  date: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'in-progress'
}

interface ReferralSummaryProps {
  referrals: ReferralData[]
  onViewDetails?: (refId: string) => void
}

export function ReferralSummary({ referrals, onViewDetails }: ReferralSummaryProps) {
  return (
    <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <History className="h-5 w-5 mr-2 text-blue-500" />
          Referral Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-2">{referrals.length}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-orange-400 mb-2">
              {referrals.filter(r => r.status === 'pending' || r.status === 'in-progress').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Referrals</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {referrals.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Referrals</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Referral History</h3>
          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((referral, index) => (
                <div 
                  key={referral.id} 
                  className="flex items-start justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => onViewDetails?.(referral.id)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{referral.condition}</p>
                    <p className="text-sm text-muted-foreground">To: {referral.to}</p>
                    <p className="text-sm text-muted-foreground">Date: {referral.date}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-center ${
                      referral.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : referral.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {referral.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-center ${
                      referral.status === 'pending'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : referral.status === 'in-progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No referral history available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
