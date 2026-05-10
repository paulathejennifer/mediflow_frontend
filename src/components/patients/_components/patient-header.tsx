'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PatientHeaderProps {
  patientName: string
  patientDescription: string
  patientId?: string
  onEditPatient?: () => void
}

export function PatientHeader({ patientName, patientDescription, patientId, onEditPatient }: PatientHeaderProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/dashboard/super-admin/patients')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack}
          className="text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
          <p className="text-muted-foreground mt-1">{patientDescription}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline"
          onClick={onEditPatient}
          className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Patient
        </Button>
        <Button 
          onClick={() => router.push('/dashboard/super-admin/referrals/create')}
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80"
        >
          <FileText className="h-4 w-4 mr-2" />
          Create Referral
        </Button>
      </div>
    </div>
  )
}
