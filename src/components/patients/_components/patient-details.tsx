'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientInitials } from '@/components/shared'

interface PatientDetailsProps {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  lastVisit: string
  profileImage?: string
}

export function PatientDetails({
  firstName,
  lastName,
  dateOfBirth,
  gender,
  email,
  phone,
  emergencyContact,
  emergencyPhone,
  lastVisit,
  profileImage
}: PatientDetailsProps) {
  return (
    <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          Patient Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6">
          <PatientInitials 
            firstName={firstName}
            lastName={lastName}
            size="lg"
          />
          <div className="flex-1 space-y-6">
            {/* Row 1: First Name, Last Name, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="text-foreground">{firstName}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="text-foreground">{lastName}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{email || 'N/A'}</p>
              </div>
            </div>
            
            {/* Row 2: Date of Birth, Gender, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-foreground">{dateOfBirth}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-foreground">{gender}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{phone || 'N/A'}</p>
              </div>
            </div>
            
            {/* Row 3: Emergency Contact, Emergency Phone, Last Visit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="text-foreground">{emergencyContact || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emergency Phone</p>
                <p className="text-foreground">{emergencyPhone || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="text-foreground">{lastVisit}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
