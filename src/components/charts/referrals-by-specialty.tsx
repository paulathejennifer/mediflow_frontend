import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export function ReferralsBySpecialty() {
  const specialties = [
    { name: 'Cardiology', count: 245, percentage: 28.5 },
    { name: 'Orthopedics', count: 189, percentage: 22.0 },
    { name: 'Neurology', count: 156, percentage: 18.2 },
    { name: 'Pediatrics', count: 134, percentage: 15.6 },
    { name: 'General Surgery', count: 135, percentage: 15.7 },
  ]

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Referrals by Specialty
        </CardTitle>
        <p className="text-muted-foreground text-sm">Distribution of referrals across medical specialties</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {specialties.map((specialty, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{specialty.name}</span>
                <span className="text-muted-foreground">{specialty.count} ({specialty.percentage}%)</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${specialty.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
