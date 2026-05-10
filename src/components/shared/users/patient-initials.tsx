interface PatientInitialsProps {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PatientInitials({ 
  firstName, 
  lastName, 
  size = 'md', 
  className = '' 
}: PatientInitialsProps) {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-semibold 
        text-white 
        bg-primary/90
        ${className}
      `}
    >
      {getInitials(firstName, lastName)}
    </div>
  )
}
