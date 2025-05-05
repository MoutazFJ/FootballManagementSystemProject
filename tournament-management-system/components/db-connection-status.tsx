"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, XCircle } from "lucide-react"

export function DbConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkDbStatus() {
      try {
        const res = await fetch("/api/db-status")
        const data = await res.json()

        if (data.status === "connected") {
          setStatus("connected")
          setStats(data.stats)
        } else {
          setStatus("error")
          setError(data.message || "Unknown error")
        }
      } catch (error) {
        setStatus("error")
        setError("Failed to check database status")
      }
    }

    checkDbStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
        <CardDescription>Current status of your database connection</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : status === "connected" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Connected successfully</span>
            </div>

            {stats && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-slate-100 p-3 rounded-md">
                  <div className="text-sm text-slate-500">Tournaments</div>
                  <div className="text-xl font-bold">{stats.tournaments}</div>
                </div>
                <div className="bg-slate-100 p-3 rounded-md">
                  <div className="text-sm text-slate-500">Teams</div>
                  <div className="text-xl font-bold">{stats.teams}</div>
                </div>
                <div className="bg-slate-100 p-3 rounded-md">
                  <div className="text-sm text-slate-500">Players</div>
                  <div className="text-xl font-bold">{stats.players}</div>
                </div>
                <div className="bg-slate-100 p-3 rounded-md">
                  <div className="text-sm text-slate-500">Matches</div>
                  <div className="text-xl font-bold">{stats.matches}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Connection failed</span>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">{error}</div>
            )}
            <div className="text-sm text-slate-500">
              Please check your database connection settings in the .env file.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
