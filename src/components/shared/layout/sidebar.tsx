'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Scrollbar } from '@/components/shared'
import { UserProfileCard } from '@/components/shared'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Bell,
  User,
  FileAudio,
  ChevronRight
} from 'lucide-react'

const navigationItems = {
  [ROLES.SUPER_ADMIN]: [
    { name: 'Dashboard', href: ROUTES.SUPER_ADMIN.DASHBOARD + '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: ROUTES.SUPER_ADMIN.ANALYTICS, icon: BarChart3 },
    { name: 'Staff', href: ROUTES.SUPER_ADMIN.STAFF, icon: Users },
    { name: 'Patients', href: ROUTES.SUPER_ADMIN.PATIENTS, icon: User },
    { name: 'Facilities', href: ROUTES.SUPER_ADMIN.FACILITIES, icon: Building2 },
    { name: 'Notifications', href: ROUTES.SUPER_ADMIN.NOTIFICATIONS, icon: Bell },
    { name: 'Settings', href: ROUTES.SUPER_ADMIN.SETTINGS, icon: Settings },
  ],

  [ROLES.FACILITY_ADMIN]: [
    { name: 'Dashboard', href: ROUTES.FACILITY_ADMIN.DASHBOARD + '/dashboard', icon: LayoutDashboard },
    { name: 'Clinicians', href: ROUTES.FACILITY_ADMIN.CLINICIANS, icon: Users },
    { name: 'Patients', href: ROUTES.FACILITY_ADMIN.PATIENTS, icon: User },
    { name: 'Referrals', href: ROUTES.FACILITY_ADMIN.REFERRALS, icon: FileText },
    { name: 'Voice Notes', href: ROUTES.FACILITY_ADMIN.VOICE_NOTES, icon: FileAudio },
    { name: 'Analytics', href: ROUTES.FACILITY_ADMIN.ANALYTICS, icon: BarChart3 },
    { name: 'Documents', href: ROUTES.FACILITY_ADMIN.DOCUMENTS, icon: FileText },
    { name: 'Notifications', href: ROUTES.FACILITY_ADMIN.NOTIFICATIONS, icon: Bell },
    { name: 'Settings', href: ROUTES.FACILITY_ADMIN.SETTINGS, icon: Settings },
  ],

  [ROLES.CLINICIAN]: [
    { name: 'Dashboard', href: ROUTES.CLINICIAN.DASHBOARD + '/dashboard', icon: LayoutDashboard },
    { name: 'Clinicians', href: ROUTES.CLINICIAN.CLINICIANS, icon: Users },
    { name: 'Patients', href: ROUTES.CLINICIAN.PATIENTS, icon: User },
    { name: 'Referrals', href: ROUTES.CLINICIAN.REFERRALS, icon: FileText },
    { name: 'Voice Notes', href: ROUTES.CLINICIAN.VOICE_NOTES, icon: FileAudio },
    { name: 'Analytics', href: ROUTES.CLINICIAN.ANALYTICS, icon: BarChart3 },
    { name: 'Documents', href: ROUTES.CLINICIAN.DOCUMENTS, icon: FileText },
    { name: 'Notifications', href: ROUTES.CLINICIAN.NOTIFICATIONS, icon: Bell },
    { name: 'Settings', href: ROUTES.CLINICIAN.SETTINGS, icon: Settings },
  ],

  [ROLES.PATIENT]: []
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const userRole = user?.role
  const navigation =
    userRole ? navigationItems[userRole] : []
  
  if (!user) {
  return null // Don't render sidebar for unauthenticated users
}

return (
    <aside className="w-72 min-h-screen border-r border-border bg-background/95 backdrop-blur-xl flex flex-col">

      {/* LOGO */}
      <div className="h-20 px-6 flex items-center bg-gray-900">
        <Link href={navigation[0]?.href || '/dashboard'} className="flex items-center gap-3 group">

          <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-primary/40 shadow-lg shadow-primary/20">
            <Image
              src="/images/logo(1).png"
              alt="MediFlow Logo"
              fill
              className="object-contain p-1"
            />
          </div>

          <div className="leading-tight">
            <p className="text-foreground font-semibold text-lg tracking-tight">
              MediFlow
            </p>

            <p className="text-xs text-primary/70">
              Smart Healthcare Ops
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="h-[calc(100vh-14rem)] px-4 py-5 overflow-y-auto">

        <p className="px-3 mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground sticky top-0 bg-background/95 backdrop-blur-xl pb-2">
          Navigation
        </p>

        <nav className="space-y-1.5">
          {navigation.map((item: { name: string; href: string; icon: any }) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',

                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/15 text-foreground border border-primary/30 shadow-lg shadow-primary/15'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >

                {/* LEFT ACTIVE BAR */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary shadow-md shadow-primary/60" />
                )}

                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                    )}
                  />

                  <span>{item.name}</span>
                </div>

                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isActive
                      ? 'text-primary opacity-100'
                      : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                  )}
                />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* USER PROFILE CARD */}
      <UserProfileCard />
    </aside>
  )
}