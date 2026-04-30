'use client'

import { BarChart3, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ReferralsBySpecialty() {
  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Referrals by Specialty
        </CardTitle>
        <p className="text-muted-foreground text-sm">Distribution across medical specialties</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p>Bar Chart</p>
            <p className="text-sm">Specialty breakdown</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
