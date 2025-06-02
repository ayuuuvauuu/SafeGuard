import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SafeGuard - Women Safety App",
  description: "Your personal safety companion with real-time location sharing and emergency alerts",
  manifest: "/manifest.json",
  themeColor: "#7e22ce",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SafeGuard",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  applicationName: "SafeGuard",
  formatDetection: {
    telephone: true,
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"


import './globals.css'