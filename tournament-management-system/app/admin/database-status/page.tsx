import { DbStatusDisplay } from "@/components/db-status-display"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function DatabaseStatusPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Database Status" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <DbStatusDisplay />
      </main>
    </div>
  )
}
