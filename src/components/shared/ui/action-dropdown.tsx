'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, UserPlus, FileText, Settings, Ban, CheckCircle, Building, Users, BarChart3, ArrowRightLeft, Download, Trash2, type LucideIcon } from 'lucide-react'

interface Action {
  label: string
  icon: LucideIcon
  onClick?: (() => void) | undefined
  show: boolean
  isDanger?: boolean
}

interface ActionDropdownProps {
  type: 'staff' | 'patient' | 'facility' | 'clinician' | 'referral' | 'document'
  userRole: 'super-admin' | 'facility-admin' | 'clinician'
  isActive?: boolean
  onViewProfile?: () => void
  onEdit?: () => void
  onActivate?: () => void
  onDeactivate?: () => void
  onCreateReferral?: () => void
  onManageStaff?: () => void
  onManagePermissions?: () => void
  onTransferFacility?: () => void
  onViewAnalytics?: () => void
  onViewDetails?: () => void
  onDownload?: () => void
  onDelete?: () => void
}

export function ActionDropdown({
  type,
  userRole,
  isActive = true,
  onViewProfile,
  onEdit,
  onActivate,
  onDeactivate,
  onCreateReferral,
  onManageStaff,
  onManagePermissions,
  onTransferFacility,
  onViewAnalytics,
  onViewDetails,
  onDownload,
  onDelete
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = 200 // Approximate height of dropdown
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
  }, [isOpen])

  const getActions = (): Action[] => {
    const baseActions: Action[] = [
      {
        label: 'View Profile',
        icon: Eye,
        onClick: onViewProfile,
        show: true
      },
      {
        label: 'Edit',
        icon: Edit,
        onClick: onEdit,
        show: true
      }
    ]

    if (type === 'staff') {
      return [
        ...baseActions,
        ...(userRole === 'super-admin' ? [{
          label: 'Manage Permissions',
          icon: Settings,
          onClick: onManagePermissions,
          show: true
        } as Action] : []),
        {
          label: isActive ? 'Deactivate' : 'Activate',
          icon: isActive ? Ban : CheckCircle,
          onClick: isActive ? onDeactivate : onActivate,
          show: true
        }
      ].filter(action => action.show)
    }

    if (type === 'patient') {
      return [
        ...baseActions,
        {
          label: 'Create Referral',
          icon: FileText,
          onClick: onCreateReferral,
          show: true
        }
      ].filter(action => action.show)
    }

    if (type === 'referral') {
      return [
        {
          label: 'View Details',
          icon: Eye,
          onClick: onViewDetails,
          show: true
        }
      ].filter(action => action.show)
    }

    if (type === 'document') {
      return [
        {
          label: 'View',
          icon: Eye,
          onClick: onViewDetails,
          show: true
        },
        {
          label: 'Download',
          icon: Download,
          onClick: onDownload,
          show: true
        },
        {
          label: 'Delete',
          icon: Trash2,
          onClick: onDelete,
          show: true,
          isDanger: true
        }
      ].filter(action => action.show)
    }

    if (type === 'facility') {
      return [
        ...baseActions,
        {
          label: 'Manage Staff',
          icon: Users,
          onClick: onManageStaff,
          show: true
        },
        ...(userRole === 'super-admin' ? [{
          label: 'View Analytics',
          icon: BarChart3,
          onClick: onViewAnalytics,
          show: true
        } as Action] : []),
        ...(userRole === 'super-admin' ? [{
          label: isActive ? 'Deactivate Facility' : 'Activate Facility',
          icon: isActive ? Ban : CheckCircle,
          onClick: isActive ? onDeactivate : onActivate,
          show: true
        } as Action] : [])
      ].filter(action => action.show)
    }

    if (type === 'clinician') {
      return [
        ...baseActions,
        ...(userRole === 'super-admin' || userRole === 'facility-admin' ? [{
          label: 'Manage Permissions',
          icon: Settings,
          onClick: onManagePermissions,
          show: true
        } as Action] : [])
      ].filter(action => action.show)
    }

    return baseActions
  }

  const actions = getActions()

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 hover:bg-gray-800"
      >
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[999]" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-[1000] ${
            dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          }`}>
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick?.()
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                    action.isDanger
                      ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
