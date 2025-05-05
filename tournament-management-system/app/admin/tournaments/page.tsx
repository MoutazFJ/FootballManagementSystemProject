"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { AddTournamentForm } from "@/components/forms/add-tournament-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function TournamentsPage() {
  const { tournaments, deleteTournament, loading } = useAppContext()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null)

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteClick = (id: string) => {
    setTournamentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (tournamentToDelete) {
      deleteTournament(tournamentToDelete)
      setDeleteDialogOpen(false)
      toast({
        title: "Tournament Deleted",
        description: "The tournament has been successfully deleted.",
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Tournaments" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tournaments..."
              className="w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddTournamentForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tournaments</CardTitle>
            <CardDescription>Manage your tournaments, add teams, and track progress.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tournament Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium">{tournament.name}</TableCell>
                      <TableCell>{tournament.startDate}</TableCell>
                      <TableCell>{tournament.endDate}</TableCell>
                      <TableCell>{tournament.teams}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            tournament.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : tournament.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tournament.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Edit Tournament",
                                description: "Tournament edit functionality would open here.",
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(tournament.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTournaments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No tournaments found. Try a different search or add a new tournament.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tournament? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
