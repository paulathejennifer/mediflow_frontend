'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  placeholder = "Search patients, referrals, facilities...", 
  className = "" 
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        className={`pl-10 bg-gray-800 border-border rounded-md  ${className}`}
      />
    </div>
  )
}
