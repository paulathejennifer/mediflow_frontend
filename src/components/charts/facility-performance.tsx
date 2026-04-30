'use client'

import { Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FacilityPerformance() {
  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Building className="h-5 w-5" />
          Facility Performance
        </CardTitle>
        <p className="text-muted-foreground text-sm">Referral volume and processing time by facility</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded ${i % 3 === 0 ? 'bg-green-600' : i % 3 === 1 ? 'bg-yellow-600' : 'bg-red-600'}`}></div>
              ))}
            </div>
            <p>Heat Map</p>
            <p className="text-sm">Facility performance matrix</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
