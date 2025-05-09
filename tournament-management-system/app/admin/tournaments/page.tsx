"use client"

import type React from "react"

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
import { Label } from "@/components/ui/label"

export default function TournamentsPage() {
  const { tournaments, deleteTournament, updateTournamentDates, loading } = useAppContext()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null)

  // Add state for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tournamentToEdit, setTournamentToEdit] = useState<{
    id: string
    name: string
    startDate: string
    endDate: string
  } | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Add handler for edit button click
  const handleEditClick = (tournament: {
    id: string
    name: string
    startDate: string
    endDate: string
  }) => {
    setTournamentToEdit(tournament)

    // Format dates for input fields (assuming dates are in format "Month Day, Year")
    const formatDateForInput = (dateString: string) => {
      try {
        const date = new Date(dateString)
        return date.toISOString().split("T")[0] // Format as YYYY-MM-DD
      } catch (e) {
        return ""
      }
    }

    setStartDate(formatDateForInput(tournament.startDate))
    setEndDate(formatDateForInput(tournament.endDate))
    setEditDialogOpen(true)
  }

  // Handle form submission
  const handleUpdateDates = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tournamentToEdit || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Both start and end dates are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateTournamentDates(tournamentToEdit.id, startDate, endDate)

      toast({
        title: "Success",
        description: `Dates for ${tournamentToEdit.name} have been updated.`,
      })

      setEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tournament dates.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium">{tournament.name}</TableCell>
                      <TableCell>{tournament.startDate}</TableCell>
                      <TableCell>{tournament.endDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleEditClick({
                                id: tournament.id,
                                name: tournament.name,
                                startDate: tournament.startDate,
                                endDate: tournament.endDate,
                              })
                            }
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
                      <TableCell colSpan={4} className="text-center py-4">
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

      {/* Delete confirmation dialog */}
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

      {/* Edit tournament dates dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateDates}>
            <DialogHeader>
              <DialogTitle>Edit Tournament Dates</DialogTitle>
              <DialogDescription>Update the start and end dates for {tournamentToEdit?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Dates"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}