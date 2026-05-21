import { KPICard } from './kpi-card'
import { Users, FileText, Building2, TrendingUp } from 'lucide-react'
import { DashboardStats } from '@/types/dashboard'

interface StatsGridProps {
  stats?: DashboardStats
  isLoading?: boolean
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const pendingReferrals = stats.totalReferrals // This would need to be calculated from status if API provided it

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Patients"
        value={stats.totalPatients.toLocaleString()}
        change={{ value: 0, trend: 'up' }}
        icon={Users}
        description="Active patients in system"
      />
      <KPICard
        title="Total Referrals"
        value={stats.totalReferrals.toLocaleString()}
        change={{ value: 0, trend: 'up' }}
        icon={FileText}
        description="Referrals in system"
      />
      <KPICard
        title="Active Facilities"
        value={stats.totalFacilities.toLocaleString()}
        change={{ value: 0, trend: 'up' }}
        icon={Building2}
        description="Healthcare providers"
      />
      <KPICard
        title="Active Users"
        value={stats.activeUsers.toLocaleString()}
        change={{ value: 0, trend: 'up' }}
        icon={TrendingUp}
        description="Active system users"
      />
    </div>
  )
}
