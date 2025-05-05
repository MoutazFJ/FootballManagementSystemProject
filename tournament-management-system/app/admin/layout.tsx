import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
