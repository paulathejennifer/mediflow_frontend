import { KPICard } from './kpi-card'
import { Users, FileText, Building2, TrendingUp } from 'lucide-react'

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Patients"
        value="1,234"
        change={{ value: 12, trend: 'up' }}
        icon={Users}
        description="Active patients in system"
      />
      <KPICard
        title="Pending Referrals"
        value="89"
        change={{ value: 8, trend: 'down' }}
        icon={FileText}
        description="Awaiting processing"
      />
      <KPICard
        title="Active Facilities"
        value="24"
        change={{ value: 3, trend: 'up' }}
        icon={Building2}
        description="Healthcare providers"
      />
      <KPICard
        title="Monthly Growth"
        value="15.3%"
        change={{ value: 2.1, trend: 'up' }}
        icon={TrendingUp}
        description="Referral volume increase"
      />
    </div>
  )
}
