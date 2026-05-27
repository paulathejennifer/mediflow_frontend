import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediFlow - Healthcare Referral Management',
  description: 'AI-powered healthcare referral management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/60`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
