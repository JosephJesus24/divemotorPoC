import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vehicle Showroom AI — Jeep',
  description:
    'Explora los modelos Jeep y genera variaciones de color con inteligencia artificial.',
  keywords: ['Jeep', 'vehículos', 'configurador', 'IA', 'color'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} bg-bg-primary text-text-primary min-h-screen`}>
        <NavBar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
