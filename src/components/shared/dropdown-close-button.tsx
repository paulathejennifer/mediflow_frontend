import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DropdownCloseButtonProps {
  onClick: () => void
  className?: string
}

export function DropdownCloseButton({ onClick, className }: DropdownCloseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-8 w-8 text-gray-400 hover:text-foreground hover:bg-gray-800 ${className || ''}`}
    >
      <X size={18} />
    </Button>
  )
}
