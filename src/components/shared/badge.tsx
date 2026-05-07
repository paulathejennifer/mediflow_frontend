import { cn } from '@/lib/utils'
import { COLORS } from '@/constants/colors'
const { gender, statusBadge, roles } = COLORS

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'super_admin' | 'facility_admin' | 'clinician' | 'male' | 'female' | 'other' | 'active' | 'inactive' | 'facility_level_1' | 'facility_level_2' | 'facility_level_3' | 'facility_level_4' | 'facility_level_5' | 'facility_level_6' | 'performance_low' | 'performance_medium_low' | 'performance_medium' | 'performance_medium_high' | 'performance_high'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'super_admin':
        return 'bg-badge-super-admin text-white border-badge-super-admin'
      case 'facility_admin':
        return 'bg-badge-facility-admin text-white border-badge-facility-admin'
      case 'clinician':
        return 'bg-badge-clinician text-white border-badge-clinician'
      case 'male':
        return 'bg-badge-gender-male text-white border-badge-gender-male'
      case 'female':
        return 'bg-badge-gender-female text-white border-badge-gender-female'
      case 'other':
        return 'bg-badge-gender-other text-white border-badge-gender-other'
      case 'active':
        return 'bg-badge-status-active text-gray-800 border-badge-status-active'
      case 'inactive':
        return 'bg-badge-status-inactive text-white border-badge-status-inactive'
      case 'facility_level_1':
        return 'bg-badge-facility-level-1 text-gray-800 border-badge-facility-level-1'
      case 'facility_level_2':
        return 'bg-badge-facility-level-2 text-gray-800 border-badge-facility-level-2'
      case 'facility_level_3':
        return 'bg-badge-facility-level-3 text-gray-800 border-badge-facility-level-3'
      case 'facility_level_4':
        return 'bg-badge-facility-level-4 text-white border-badge-facility-level-4'
      case 'facility_level_5':
        return 'bg-badge-facility-level-5 text-white border-badge-facility-level-5'
      case 'facility_level_6':
        return 'bg-badge-facility-level-6 text-white border-badge-facility-level-6'
      case 'performance_low':
        return 'bg-badge-performance-low text-white border-badge-performance-low'
      case 'performance_medium_low':
        return 'bg-badge-performance-medium-low text-white border-badge-performance-medium-low'
      case 'performance_medium':
        return 'bg-badge-performance-medium text-gray-800 border-badge-performance-medium'
      case 'performance_medium_high':
        return 'bg-badge-performance-medium-high text-white border-badge-performance-medium-high'
      case 'performance_high':
        return 'bg-badge-performance-high text-white border-badge-performance-high'
      case 'secondary':
        return 'bg-gray-200 text-gray-800 border-gray-300'
      case 'outline':
        return 'bg-transparent text-gray-700 border-gray-400'
      default:
        return 'bg-gray-600 text-white border-gray-500'
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getVariantStyles(),
        className
      )}
    >
      {children}
    </span>
  )
}
