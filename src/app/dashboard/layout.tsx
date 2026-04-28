import { Sidebar } from '@/components/shared/sidebar'
import { Header } from '@/components/shared/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - Fixed position */}
        <div className="fixed left-0 top-0 h-full z-40">
          <Sidebar />
        </div>
        
        {/* Main content - Scrollable only */}
        <div className="flex-1 ml-72">
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Header />
          </div>
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
