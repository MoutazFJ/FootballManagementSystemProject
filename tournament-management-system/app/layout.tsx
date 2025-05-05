import type React from "react"
import "./globals.css"
import { AppProvider } from "@/contexts/app-context"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
