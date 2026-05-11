'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  User, 
  Building, 
  FileText, 
  Mic, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Brain,
  Clock,
  Send
} from 'lucide-react'
import { 
  mockReferralsData, 
  Referral, 
  Document, 
  VoiceNote, 
  TimelineEvent, 
  AIAnalysis 
} from '@/services/referral.service'
import { ROLES, UserRole } from '@/constants/roles'

interface SharedReferralDetailsPageProps {
  userRole: UserRole
}

export function SharedReferralDetailsPage({ userRole }: SharedReferralDetailsPageProps) {
  const params = useParams()
  const router = useRouter()
  const referralId = params.id as string
  const [referral, setReferral] = useState<Referral | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const foundReferral = mockReferralsData.find(r => r.id === referralId)
    setReferral(foundReferral || null)
  }, [referralId])

  const handleGoBack = () => {
    router.back()
  }

  if (!isMounted) {
    return null
  }

  if (!referral) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Referral Not Found</h2>
          <p className="text-muted-foreground">The referral you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(' at', ' •')
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-orange-600/10 text-orange-600 border-orange-600/20'
      case 'medium':
        return 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
      case 'low':
        return 'bg-green-600/10 text-green-600 border-green-600/20'
      default:
        return 'bg-gray-600/10 text-gray-600 border-gray-600/20'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
      case 'accepted':
        return 'bg-blue-600/10 text-blue-600 border-blue-600/20'
      case 'completed':
        return 'bg-green-600/10 text-green-600 border-green-600/20'
      case 'in_progress':
        return 'bg-chart-5/10 text-chart-5 border-chart-5/20'
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'cancelled':
        return 'bg-muted/10 text-muted border-muted/20'
      case 'draft':
        return 'bg-muted/10 text-muted border-muted/20'
      default:
        return 'bg-gray-600/10 text-gray-600 border-gray-600/20'
    }
  }

  const getTimelineIconClass = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-primary text-primary-foreground'
      case 'submitted':
        return 'bg-chart-5 text-white'
      case 'accepted':
        return 'bg-success text-success-foreground'
      case 'in_progress':
        return 'bg-warning text-warning-foreground'
      case 'completed':
        return 'bg-success text-success-foreground'
      case 'rejected':
        return 'bg-destructive text-destructive-foreground'
      case 'updated':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-success'
    if (score >= 5) return 'text-warning'
    return 'text-destructive'
  }

  const createdDate = formatDate(referral.date)

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* LEFT SECTION */}
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="text-muted-foreground hover:text-foreground hover:bg-transparent mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Referral Details</h1>
              <div className="inline-flex items-center px-3 py-1 rounded-md border border-border/30 bg-background/50">
                <span className="text-sm font-mono text-foreground">{referral.id.slice(0, 6).toUpperCase()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Created {createdDate}</p>
          </div>
        </div>
        
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getPriorityBadgeClass(referral.priority)} text-xs font-semibold px-3 py-1.5`}>
            {referral.priority.charAt(0).toUpperCase() + referral.priority.slice(1)} Priority
          </Badge>
          <Badge className={`${getStatusBadgeClass(referral.status)} text-xs font-semibold px-3 py-1.5`}>
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-2 space-y-6">
          {/* PATIENT & FACILITY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PATIENT CARD */}
            <Card className="bg-gray-900/60 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-sm text-foreground">{referral.patient}</p>
                <p className="text-sm text-muted-foreground">MRN: {referral.id.slice(-6)}</p>
                <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
                <Button 
                  variant="link" 
                  className="text-sm text-primary p-0 h-auto"
                  onClick={() => router.push(`/dashboard/${userRole === ROLES.SUPER_ADMIN ? 'super-admin' : userRole === ROLES.FACILITY_ADMIN ? 'facility-admin' : 'clinician'}/patients/${referral.patientId}`)}
                >
                  View Patient Profile
                </Button>
              </CardContent>
            </Card>

            {/* FACILITY CARD */}
            <Card className="bg-gray-900/60 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <Building className="h-4 w-4 text-primary" />
                  Receiving Facility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-sm text-foreground">{referral.receivingFacility}</p>
                <p className="text-sm text-muted-foreground capitalize">specialty center</p>
                <p className="text-sm text-muted-foreground">10 Heart Street, Ikoyi, Lagos</p>
              </CardContent>
            </Card>
          </div>

          {/* REFERRAL INFORMATION CARD */}
          <Card className="bg-gray-900/60 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Referral Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* REASON FOR REFERRAL */}
              <div>
                <p className="text-sm font-semibold mb-1 text-foreground">Reason for Referral</p>
                <p className="text-sm text-foreground">{referral.reason || referral.condition}</p>
              </div>
              
              <Separator />
              
              {/* CLINICAL NOTES */}
              <div>
                <p className="text-sm font-semibold mb-2 text-foreground">Clinical Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {referral.clinicalNotes || 'No clinical notes provided.'}
                </p>
              </div>
              
              <Separator />
              
              {/* REFERRING CLINICIAN */}
              {referral.referringClinician && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-foreground">Referring Clinician</p>
                  <p className="text-sm text-foreground">{referral.referringClinician.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {referral.referringClinician.department} • {referral.referringClinician.facility}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ATTACHMENTS CARD */}
          <Card className="bg-gray-900/60 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="mb-4 bg-gray-800/60 border border-border/50">
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents ({referral.attachments?.documents.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="voiceNotes" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice Notes ({referral.attachments?.voiceNotes.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="mt-0">
                  {(!referral.attachments?.documents || referral.attachments.documents.length === 0) ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No documents attached
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {referral.attachments.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg gap-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size} KB • {doc.uploader}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="default" 
                            className="bg-primary/80 text-primary-foreground"
                          >
                            AI: {doc.aiStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="voiceNotes" className="mt-0">
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No voice notes attached
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* ACTIVITY TIMELINE CARD */}
          <Card className="bg-gray-900/60 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {/* VERTICAL LINE */}
                <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-border"></div>
                
                {referral.timeline?.map((event, index) => (
                  <div key={event.id} className="relative pl-10 pb-6" style={{ paddingBottom: index === (referral.timeline?.length || 0) - 1 ? '0' : '1.5rem' }}>
                    {/* ICON */}
                    <div className="absolute left-0 h-8 w-8 rounded-full flex items-center justify-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        event.action === 'created' ? 'bg-blue-600 text-white' :
                        event.action === 'submitted' ? 'bg-green-600 text-white' :
                        getTimelineIconClass(event.action)
                      }`}>
                        {event.action === 'created' ? <FileText className="h-4 w-4" /> :
                         event.action === 'submitted' ? <Send className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    {/* CONTENT */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{event.action.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">By {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR - AI ANALYSIS PANEL */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900/60 border-border/50 lg:sticky lg:top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Brain className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {referral.aiAnalysis ? (
                <>
                  {/* QUALITY SCORE */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-foreground">Quality Score</p>
                      <p className={`text-2xl font-bold text-yellow-600`}>
                        {referral.aiAnalysis.completeness_score}/10
                      </p>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${referral.aiAnalysis.completeness_score * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <Separator />

                  {/* PATIENT SUMMARY */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Patient Summary</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {referral.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* MISSING INFORMATION */}
                  {referral.aiAnalysis.missing_info.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <p className="text-sm font-semibold text-foreground">Missing Information</p>
                        </div>
                        <div className="space-y-2">
                          {referral.aiAnalysis.missing_info.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 px-3 py-2 border border-yellow-600/20 bg-yellow-600/5 rounded-md">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" />
                              <p className="text-sm text-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* RISK FACTORS */}
                  {referral.aiAnalysis.risks.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">Risk Factors</p>
                        <div className="flex flex-wrap gap-2">
                          {referral.aiAnalysis.risks.map((risk, index) => (
                            <Badge key={index} variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 text-xs px-3 py-1">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* RECOMMENDATIONS */}
                  {referral.aiAnalysis.recommendations.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <p className="text-sm font-semibold text-foreground">Recommendations</p>
                        </div>
                        <div className="space-y-2">
                          {referral.aiAnalysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="relative mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                              <p className="text-sm text-foreground">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No AI analysis available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
