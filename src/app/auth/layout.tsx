import { Toaster } from 'sonner'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min flex items-center justify-center">
      <Toaster richColors position="top-right" />
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  )
}
