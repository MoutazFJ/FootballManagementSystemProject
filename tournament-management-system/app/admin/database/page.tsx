"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DbConnectionStatus } from "@/components/db-connection-status"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DatabasePage() {
  const { toast } = useToast()
  const [seedingDb, setSeedingDb] = useState(false)

  const handleSeedDatabase = async () => {
    setSeedingDb(true)
    try {
      const res = await fetch("/api/seed-db", { method: "POST" })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Database Seeded",
          description: "Sample data has been added to your database.",
        })
      } else {
        throw new Error(data.message || "Failed to seed database")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setSeedingDb(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Database Management" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <DbConnectionStatus />

          <Card>
            <CardHeader>
              <CardTitle>Database Actions</CardTitle>
              <CardDescription>Manage your database data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Seed Database</h3>
                <p className="text-sm text-slate-500">Add sample data to your database for testing purposes.</p>
                <Button onClick={handleSeedDatabase} disabled={seedingDb} className="mt-2">
                  {seedingDb ? (
                    <>
                      <LoadingSpinner /> <span className="ml-2">Seeding...</span>
                    </>
                  ) : (
                    "Seed Database"
                  )}
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Database Schema</h3>
                <p className="text-sm text-slate-500">View your database schema and relationships.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Prisma Studio",
                      description: "Run 'npm run prisma:studio' in your terminal to open Prisma Studio.",
                    })
                  }}
                  className="mt-2"
                >
                  Open Schema Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Database Migrations</CardTitle>
              <CardDescription>Manage your database schema changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Create Migration</h3>
                <p className="text-sm text-slate-500">
                  Create a new migration when you've made changes to your Prisma schema.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Create Migration",
                      description:
                        "Run 'npm run db:create-migration migration-name' in your terminal to create a new migration.",
                    })
                  }}
                  className="mt-2"
                >
                  View Migration Instructions
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Reset Database</h3>
                <p className="text-sm text-slate-500">
                  Reset your database to a clean state. Warning: This will delete all data.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Reset Database",
                      description: "Run 'npm run db:reset' in your terminal to reset your database.",
                      variant: "destructive",
                    })
                  }}
                  className="mt-2"
                >
                  View Reset Instructions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
              <CardDescription>Backup and restore your database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Backup Instructions</h3>
                <p className="text-sm text-slate-500">
                  Regular backups are important to prevent data loss. Use your database's native backup tools.
                </p>
                <div className="bg-slate-100 p-3 rounded-md text-sm mt-2">
                  <p className="font-medium">PostgreSQL:</p>
                  <code className="text-xs">pg_dump -U username -d soccer_tournament &gt; backup.sql</code>

                  <p className="font-medium mt-2">MySQL:</p>
                  <code className="text-xs">mysqldump -u username -p soccer_tournament &gt; backup.sql</code>

                  <p className="font-medium mt-2">SQLite:</p>
                  <code className="text-xs">sqlite3 dev.db .dump &gt; backup.sql</code>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Restore Instructions</h3>
                <p className="text-sm text-slate-500">Restore your database from a backup file.</p>
                <div className="bg-slate-100 p-3 rounded-md text-sm mt-2">
                  <p className="font-medium">PostgreSQL:</p>
                  <code className="text-xs">psql -U username -d soccer_tournament &lt; backup.sql</code>

                  <p className="font-medium mt-2">MySQL:</p>
                  <code className="text-xs">mysql -u username -p soccer_tournament &lt; backup.sql</code>

                  <p className="font-medium mt-2">SQLite:</p>
                  <code className="text-xs">sqlite3 dev.db &lt; backup.sql</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
