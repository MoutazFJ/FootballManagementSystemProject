"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, UserPlus, Users } from "lucide-react"
import { AddTeamForm } from "@/components/forms/add-team-form"
import { AssignCaptainForm } from "@/components/forms/assign-captain-form"
import { useToast } from "@/hooks/use-toast"

export default function TeamsPage() {
  const { teams } = useAppContext()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [assignCaptainDialogOpen, setAssignCaptainDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string } | null>(null)

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tournament.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAssignCaptain = (teamId: string, teamName: string) => {
    setSelectedTeam({ id: teamId, name: teamName })
    setAssignCaptainDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Teams" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search teams..."
              className="w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddTeamForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
            <CardDescription>Manage teams, assign captains, and approve players.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.tournament}</TableCell>
                    <TableCell>{team.captain}</TableCell>
                    <TableCell>{team.players}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          team.status === "Complete" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {team.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Team"
                          onClick={() => {
                            toast({
                              title: "Edit Team",
                              description: "Team edit functionality would open here.",
                            })
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Assign Captain"
                          onClick={() => handleAssignCaptain(team.id, team.name)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Manage Players"
                          onClick={() => {
                            toast({
                              title: "Manage Players",
                              description: "Player management functionality would open here.",
                            })
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeams.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No teams found. Try a different search or add a new team.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {selectedTeam && (
        <AssignCaptainForm
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          open={assignCaptainDialogOpen}
          onOpenChange={setAssignCaptainDialogOpen}
        />
      )}
    </div>
  )
}
