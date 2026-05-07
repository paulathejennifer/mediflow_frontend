'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { User, Settings, LogOut, ChevronDown, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/badge'
import { DropdownCloseButton } from '@/components/shared/dropdown-close-button'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Handle opening/closing animations
  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(false)
      setTimeout(() => setIsOpen(false), 200)
    } else {
      setIsOpen(true)
      setTimeout(() => setIsAnimating(true), 10)
    }
  }

  // Update position when opening
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()

    const dropdownWidth = 192 // w-56
    const gap = 10

    let left = rect.left

    // 1. Default: align left edge with button
    if (left + dropdownWidth > window.innerWidth) {
      // 2. If overflowing right → shift left
      left = window.innerWidth - dropdownWidth - gap
    }

    if (left < gap) {
      // 3. If overflowing left → clamp
      left = gap
    }

    setPosition({
      top: rect.bottom + gap,
      left,
    })
  }, [isOpen])

  // Close on outside click
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleToggle()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSettings = () => {
    // Navigate to settings
    handleToggle()
  }

  const handleLogout = () => {
    // Handle logout logic
    handleToggle()
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        className="flex items-center space-x-3 hover:bg-transparent p-2"
        onClick={handleToggle}
      >
        {/* Avatar */}
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-black" />
        </div>
        
        {/* Profile Content */}
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      {isOpen &&
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
              className="fixed z-50 w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] overflow-hidden transition-all duration-200 ease-out"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                opacity: isAnimating ? 1 : 0,
              }}
            >
              {/* Profile Info Section */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Dr. Sarah Johnson</p>
                  <DropdownCloseButton onClick={handleToggle} />
                </div>
                <p className="text-xs text-gray-400 mt-1">sarah.johnson@mediflow.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Role */}
                <div className="px-4 py-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-300" />
                  <Badge variant="super_admin">super admin</Badge>
                </div>

                {/* Divider */}
                {/* <div className=" border-gray-800 my-2"></div> */}

                {/* Settings */}
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                {/* Divider */}
                <div className="border-t border-gray-800 my-2"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
