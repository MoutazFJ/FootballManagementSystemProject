"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail } from "lucide-react"

export default function PlayersPage() {
  const { persons } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")

  const getKfupmEmail = (kfupmId: string) => {
    return `s${kfupmId}@kfupm.edu.sa`
  }

  const filteredPeople = persons.filter((person) => {
    const searchLower = searchQuery.toLowerCase()
    const email = getKfupmEmail(person.id)
    
    return (
      person.name?.toLowerCase().includes(searchLower) ||
      person.team?.toLowerCase().includes(searchLower) ||
      person.role?.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    )
  })

  const getMailtoLink = (person: { id: string; name: string }) => {
    const email = getKfupmEmail(person.id)
    const subject = encodeURIComponent("Tournament Management System Notification")
    const body = encodeURIComponent(`Dear ${person.name},\n\nThis is a notification from the Tournament Management System. You have a match tommorrow.\n\nBest regards,\nTournament Management Team`)
    return `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Player Emails" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search people..."
              className="w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Send emails to players, coaches, and staff members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>KFUPM Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map((person,index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          person.role === "Player"
                            ? "bg-blue-100 text-blue-800"
                            : person.role === "Head Coach"
                            ? "bg-purple-100 text-purple-800"
                            : person.role === "Assistant Coach"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {person.role}
                      </span>
                    </TableCell>
                    <TableCell>{person.team}</TableCell>
                    <TableCell>{getKfupmEmail(person.id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800"
                          asChild
                        >
                          <a
                            href={getMailtoLink(person)}
                            title={`Send email to ${person.name}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPeople.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No people found. Try a different search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}