"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"

export function DbStatusDisplay() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    async function checkDbStatus() {
      try {
        // Check connection status
        const res = await fetch("/api/db-status")
        const data = await res.json()

        if (data.status === "connected") {
          setStatus("connected")
          setDbInfo(data)

          // Get table information
          const tablesRes = await fetch("/api/db-tables")
          const tablesData = await tablesRes.json()

          if (tablesData.success) {
            setTables(tablesData.tables)
          }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
          <CardDescription>Current status of your Neon PostgreSQL database connection</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : status === "connected" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="bg-green-500">
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last checked: {new Date(dbInfo?.timestamp).toLocaleString()}
                </span>
              </div>

              {dbInfo?.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="text-sm text-slate-500">Tournaments</div>
                    <div className="text-xl font-bold">{dbInfo.stats.tournaments || 0}</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="text-sm text-slate-500">Teams</div>
                    <div className="text-xl font-bold">{dbInfo.stats.teams || 0}</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="text-sm text-slate-500">Players</div>
                    <div className="text-xl font-bold">{dbInfo.stats.players || 0}</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="text-sm text-slate-500">Matches</div>
                    <div className="text-xl font-bold">{dbInfo.stats.matches || 0}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Error</Badge>
                <span className="text-sm font-medium text-red-500">Connection failed</span>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">{error}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {status === "connected" && tables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>Available tables in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Row Count</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.rowCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={table.rowCount > 0 ? "success" : "outline"}
                        className={table.rowCount > 0 ? "bg-green-500" : ""}
                      >
                        {table.rowCount > 0 ? "Populated" : "Empty"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
