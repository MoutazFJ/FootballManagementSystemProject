"use client"

import type React from "react"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddMatchForm() {
  console.log("Rendering AddMatchForm")
  const { addMatch, teams, tournaments } = useAppContext()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [tournament, setTournament] = useState("")
  const [homeTeam, setHomeTeam] = useState("")
  const [awayTeam, setAwayTeam] = useState("")
  const [venue, setVenue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", { date, tournament, homeTeam, awayTeam, venue })
    addMatch({
      date,
      tournament,
      home: homeTeam,
      away: awayTeam,
      venue,
      status: "Scheduled",
    })
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    console.log("Form reset")
    setDate("")
    setTournament("")
    setHomeTeam("")
    setAwayTeam("")
    setVenue("")
  }

  // Filter teams by selected tournament
  const filteredTeams = teams.filter((team) => team.tournament.includes(tournament))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => {
            console.log("Add Match button clicked")
            setOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Match
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Match</DialogTitle>
            <DialogDescription>Schedule a new match. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                placeholder="e.g., May 15, 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tournament" className="text-right">
                Tournament
              </Label>
              <Select value={tournament} onValueChange={setTournament} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="homeTeam" className="text-right">
                Home Team
              </Label>
              <Select value={homeTeam} onValueChange={setHomeTeam} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awayTeam" className="text-right">
                Away Team
              </Label>
              <Select value={awayTeam} onValueChange={setAwayTeam} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeams
                    .filter((team) => team.name !== homeTeam)
                    .map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="venue" className="text-right">
                Venue
              </Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Match</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
