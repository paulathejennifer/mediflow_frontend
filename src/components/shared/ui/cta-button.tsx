'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, ChevronDown, X, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROLES, UserRole } from '@/constants/roles'
import { FacilityCreationModal } from '@/components/modals/facility-creation-modal'
import { UserCreationModal } from '@/components/modals/user-creation-modal'
import { PatientCreationModal } from '@/components/modals/patient-creation-modal'
import { AdminCreationModal } from '@/components/modals/admin-creation-modal'

interface CTAButtonProps {
  userRole: UserRole
}

export function CTAButton({ userRole }: CTAButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  
  // Modal states
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [adminFacility, setAdminFacility] = useState<any>(null)

  const getDropdownOptions = () => {
    switch (userRole) {
      case ROLES.SUPER_ADMIN:
        return [
          { label: 'Create User', action: 'create-user' },
          { label: 'Create Facility', action: 'create-facility' }
        ]
      case ROLES.FACILITY_ADMIN:
        return [
          { label: 'Create Patient', action: 'create-patient' },
          { label: 'Create Referral', action: 'create-referral' }
        ]
      case ROLES.CLINICIAN:
        return [
          { label: 'Create Patient', action: 'create-patient' },
          { label: 'Create Referral', action: 'create-referral' }
        ]
      default:
        return []
    }
  }

  const handleToggle = () => {
    if (isDropdownOpen) {
      setIsAnimating(false)
      setTimeout(() => setIsDropdownOpen(false), 200)
    } else {
      setIsDropdownOpen(true)
      setTimeout(() => setIsAnimating(true), 10)
    }
  }

  const handleAction = (action: string) => {
    handleToggle()
    
    switch (action) {
      case 'create-user':
        setIsUserModalOpen(true)
        break
      case 'create-facility':
        setIsFacilityModalOpen(true)
        break
      case 'create-patient':
        setIsPatientModalOpen(true)
        break
      case 'create-referral':
        // TODO: Implement referral creation modal
        break
      default:
        break
    }
  }

  const handleFacilityCreated = (newFacility: any) => {
    // In production, this would refresh data or show notification
  }

  const handleUserCreated = (newUser: any) => {
    // In production, this would refresh data or show notification
  }

  const handlePatientCreated = (newPatient: any) => {
    // In production, this would refresh data or show notification
  }

  const handleCreateAdmin = (facility: any) => {
    setAdminFacility(facility)
    setIsAdminModalOpen(true)
  }

  // Update position when opening
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const dropdownWidth = 180 // min-w-[180px]
      const gap = 10

      let left = rect.right - dropdownWidth

      // Ensure dropdown doesn't go off screen
      if (left < gap) {
        left = gap
      }
      if (left + dropdownWidth > window.innerWidth - gap) {
        left = window.innerWidth - dropdownWidth - gap
      }

      setPosition({
        top: rect.bottom + gap,
        left,
      })
    }
  }, [isDropdownOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleToggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dropdownOptions = getDropdownOptions()

  return (
    <>
      <Button 
        ref={buttonRef}
        className="h-9 px-4 text-sm bg-primary/90 hover:bg-primary/80"
        onClick={handleToggle}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create
        <ChevronDown className="h-4 w-4 ml-2" />
        
      </Button>

      {isDropdownOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 transition-opacity duration-200"
              style={{ opacity: isAnimating ? 1 : 0 }}
              onClick={handleToggle}
              aria-hidden="true"
            />

            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="fixed z-50 rounded-xl border border-gray-700 bg-gray-900 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] overflow-hidden transition-all duration-200 ease-out"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                opacity: isAnimating ? 1 : 0,
              }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-800 ml-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Create</span>
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-gray-800"
                  onClick={handleToggle}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2">
                {dropdownOptions.map((option) => (
                  <button
                    key={option.action}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => handleAction(option.action)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body
        )}
      
      {/* Facility Creation Modal */}
      <FacilityCreationModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        onSuccess={handleFacilityCreated}
        onCreateAdmin={handleCreateAdmin}
      />
      
      {/* User Creation Modal */}
      <UserCreationModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={handleUserCreated}
      />
      
      {/* Patient Creation Modal */}
      <PatientCreationModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={handlePatientCreated}
      />
      
      {/* Admin Creation Modal */}
      <AdminCreationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleUserCreated}
        facility={adminFacility}
      />
    </>
  )
}
