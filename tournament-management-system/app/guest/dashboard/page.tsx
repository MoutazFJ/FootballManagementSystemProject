"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Calendar, Users, Shield, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from "@/components/loading-spinner"

export default function GuestDashboard() {
  // Track component mounting
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get context data with detailed logging
  console.log("GuestDashboard: Component rendering")
  const context = useAppContext()
  console.log("GuestDashboard: Context received", context)
  
  const { tournaments, teams, matchResults, topScorers, loading } = context
  
  // Log specific data
  console.log("GuestDashboard: tournaments =", tournaments)
  console.log("GuestDashboard: teams =", teams)
  console.log("GuestDashboard: matchResults =", matchResults)
  console.log("GuestDashboard: topScorers =", topScorers)
  console.log("GuestDashboard: loading =", loading)

  // Track component mounting
  useEffect(() => {
    console.log("GuestDashboard: Component mounted")
    setMounted(true)
    
    // Return cleanup function
    return () => {
      console.log("GuestDashboard: Component unmounting")
    }
  }, [])

  // Safe data access with error handling
  let activeTournaments = 0
  let topScorer = null
  
  try {
    if (tournaments && Array.isArray(tournaments)) {
      // Calculate active tournaments based on dates instead of status
      const today = new Date();
      activeTournaments = tournaments.filter(t => {
        if (!t) return false;
        
        // Parse dates (handle different formats)
        const startDate = new Date(t.startDate);
        const endDate = new Date(t.endDate);
        
        // A tournament is active if today is between start and end dates
        return startDate <= today && today <= endDate;
      }).length;
      
      console.log("GuestDashboard: Active tournaments count =", activeTournaments)
      console.log("GuestDashboard: Total tournaments =", tournaments.length)
    } else {
      console.warn("GuestDashboard: tournaments is not an array or is undefined", tournaments)
    }
    
    if (topScorers && Array.isArray(topScorers) && topScorers.length > 0) {
      topScorer = topScorers[0]
      console.log("GuestDashboard: Top scorer =", topScorer)
    } else {
      console.warn("GuestDashboard: No top scorers available", topScorers)
    }
  } catch (err) {
    console.error("GuestDashboard: Error processing data", err)
    setError(err instanceof Error ? err.message : "Unknown error processing data")
  }

  // Show loading state
  if (loading) {
    console.log("GuestDashboard: Showing loading state")
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Guest Dashboard" userRole="guest" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Show error state if there was an error
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Guest Dashboard" userRole="guest" />
        <div className="flex-1 p-4 md:p-6">
          <Card className="border-red-300">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <pre className="mt-4 p-4 bg-slate-100 rounded text-xs overflow-auto">
                {JSON.stringify({ context, mounted }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  

  // Main component render
  console.log("GuestDashboard: Rendering main component")
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Guest Dashboard" userRole="guest" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tournaments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {activeTournaments} active tournaments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Matches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matchResults?.length || 0}</div>
              <p className="text-xs text-muted-foreground">View match results</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Across all tournaments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Scorer</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topScorer ? topScorer.goals : 0}</div>
              <p className="text-xs text-muted-foreground">
                {topScorer ? `Goals by ${topScorer.name}` : "No goals recorded yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Match Results</CardTitle>
              <CardDescription>Latest match results from all tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchResults && matchResults.length > 0 ? (
                  matchResults.map((match) => (
                    <div key={match.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {match.home} vs {match.away}
                        </p>
                        <p className="text-sm text-muted-foreground">{match.date}</p>
                      </div>
                      <div className="font-bold">{match.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No match results available yet.</div>
                )}
              </div>
              <div className="mt-4">
                <Link href="/guest/match-results">
                  <Button variant="outline" className="w-full">
                    View All Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tournament List</CardTitle>
              <CardDescription>All available tournaments</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="h-[240px] overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-4">
                {tournaments && tournaments.length > 0 ? (
                  tournaments.map((tournament) => (
                    <div key={tournament.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{tournament.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tournament.startDate} - {tournament.endDate}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No tournaments available yet.</div>
                )}
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      
      </main>
    </div>
  )
}