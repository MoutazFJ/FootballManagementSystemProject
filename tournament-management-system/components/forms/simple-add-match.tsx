"use client"

import type React from "react"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleAddMatch() {
  const { addMatch, teams, tournaments } = useAppContext()
  const [date, setDate] = useState("")
  const [tournament, setTournament] = useState("")
  const [homeTeam, setHomeTeam] = useState("")
  const [awayTeam, setAwayTeam] = useState("")
  const [venue, setVenue] = useState("")
  const [showForm, setShowForm] = useState(false)

  // Filter teams by selected tournament
  const filteredTeams = teams.filter((team) => team.tournament.includes(tournament))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting match form", { date, tournament, homeTeam, awayTeam, venue })

    addMatch({
      date,
      tournament,
      home: homeTeam,
      away: awayTeam,
      venue,
      status: "Scheduled",
    })

    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setDate("")
    setTournament("")
    setHomeTeam("")
    setAwayTeam("")
    setVenue("")
  }

  if (!showForm) {
    return <Button onClick={() => setShowForm(true)}>Add Match (Simple)</Button>
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Match</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              placeholder="e.g., May 15, 2025"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournament">Tournament</Label>
            <Select value={tournament} onValueChange={setTournament} required>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="homeTeam">Home Team</Label>
            <Select value={homeTeam} onValueChange={setHomeTeam} required>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="awayTeam">Away Team</Label>
            <Select value={awayTeam} onValueChange={setAwayTeam} required>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowForm(false)
              resetForm()
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Match</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
