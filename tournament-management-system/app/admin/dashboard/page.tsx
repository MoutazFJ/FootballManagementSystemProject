"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, Shield } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DbConnectionStatus } from "@/components/db-connection-status"

export default function AdminDashboard() {
  const { tournaments, teams, matches, players, loading } = useAppContext()
  const [dbStatus, setDbStatus] = useState<{ status: string; stats?: any } | null>(null)
  const [checkingDb, setCheckingDb] = useState(true)
  console.log("xxxxxxxxxx")
  console.log(tournaments)
  // Check database connection status
  useEffect(() => {
    async function checkDbStatus() {
      try {
        const res = await fetch("/api/db-status")
        const data = await res.json()
        setDbStatus(data)
      } catch (error) {
        console.error("Error checking database status:", error)
        setDbStatus({ status: "error" })
      } finally {
        setCheckingDb(false)
      }
    }

    checkDbStatus()
  }, [])

  if (loading || checkingDb) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Admin Dashboard" userRole="admin" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Count active tournaments
  const activeTournaments = tournaments.filter((t) => t.status === "Active").length

  // Count upcoming matches
  const upcomingMatches = matches.filter((m) => m.status === "Scheduled").length

  // Count pending player approvals
  const pendingApprovals = players.length

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Admin Dashboard" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tournaments.length}</div>
              <p className="text-xs text-muted-foreground">{activeTournaments} active tournaments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">Across all tournaments</p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Matches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingMatches}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingMatches > 0 ? "Next match coming soon" : "No upcoming matches"}
              </p>
            </CardContent>
          </Card> */}
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Player Approvals</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Pending approvals</p>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Tournaments</CardTitle>
              <CardDescription>Recently created or updated tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tournaments.slice(0, 4).map((tournament) => (
                  <div key={tournament.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tournament.name}</p>
                      <p className="text-sm text-muted-foreground">{tournament.teams} teams</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        tournament.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : tournament.status === "Completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tournament.status}
                    </div>
                  </div>
                ))}
                {tournaments.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No tournaments found. Create your first tournament to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <DbConnectionStatus />
        </div>
      </main>
    </div>
  )
}