import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Mi Diario Personal",
    template: "%s | Mi Diario",
  },
  description: "Tu espacio personal para reflexionar, escribir y hacer seguimiento de tu bienestar emocional día a día.",
  keywords: ["diario", "journal", "bienestar", "emociones", "reflexión", "escritura", "mood tracker"],
  authors: [{ name: "Mi Diario" }],
  creator: "Mi Diario",
  metadataBase: new URL("https://mi-diario.app"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://mi-diario.app",
    siteName: "Mi Diario Personal",
    title: "Mi Diario Personal - Tu espacio de reflexión",
    description: "Escribe, reflexiona y haz seguimiento de tu bienestar emocional cada día.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mi Diario Personal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Diario Personal",
    description: "Tu espacio personal para reflexionar y escribir día a día.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen flex bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
