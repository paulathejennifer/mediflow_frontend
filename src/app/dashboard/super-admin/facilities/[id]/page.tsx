'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react'
import { facilityService, Facility } from '@/features/facilities/services/facility.service'
import { toast } from '@/lib/toast'

export default function FacilityProfilePage() {
  const params = useParams()
  const router = useRouter()
  const facilityId = params.id as string

  const [facility, setFacility] = useState<Facility | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFacility = async () => {
      try {
        setIsLoading(true)
        const data = await facilityService.getFacilities()
        const found = data.find((f: Facility) => f.id.toString() === facilityId)

        if (found) {
          setFacility({
            ...found,
            // Ensure status is consistent with isActive
            status: found.isActive === false ? 'inactive' : 'active',
            performance: found.performance ?? 75,
          })
        }
      } catch (error) {
        console.error('Failed to load facility:', error)
        toast.error('Error fetching facility details')
      } finally {
        setIsLoading(false)
      }
    }

    if (facilityId) loadFacility()
  }, [facilityId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading facility profile...</p>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold text-foreground">Facility Not Found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{facility.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Level {facility.level} {facility.type}
              </Badge>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {facility.county} County
              </span>
            </div>
          </div>
        </div>

        <Badge 
          className={`${
            facility.status === 'active' 
              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}
        >
          {facility.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/60 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-primary" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Facility Code</p>
                  <p className="font-mono text-white">{facility.facilityCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-white">{facility.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm text-white">{facility.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-white">{facility.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-900/60 border-border/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-white">Assigned Clinicians</span>
              </div>
              <span className="text-xl font-bold text-white">--</span>
            </Card>

            <Card className="bg-gray-900/60 border-border/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-white">Active Referrals</span>
              </div>
              <span className="text-xl font-bold text-white">--</span>
            </Card>
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900/60 border-border/50 border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-4">
                {Math.round(facility.performance)}%
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${facility.performance}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Score based on referral response time, data completeness, and successful patient outcomes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}