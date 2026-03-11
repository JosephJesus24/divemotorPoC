import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'

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
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var a = localStorage.getItem("dm_accent");
            var t = localStorage.getItem("dm_theme");
            if (a) document.documentElement.style.setProperty("--accent", a);
            if (t === "light") {
              document.documentElement.setAttribute("data-theme","light");
              document.documentElement.classList.remove("dark");
            }
          } catch(e) {}
        ` }} />
        <NavBar />
        <main className="pt-16">{children}</main>
        <ThemeCustomizer />
      </body>
    </html>
  )
}
