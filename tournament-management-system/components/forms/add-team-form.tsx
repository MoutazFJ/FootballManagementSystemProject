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

export function AddTeamForm() {
  console.log("Rendering AddTeamForm")
  const { addTeam, tournaments } = useAppContext()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [tournament, setTournament] = useState("")
  const [players, setPlayers] = useState("0")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Team form submitted", { name, tournament, players })
    addTeam({
      name,
      tournament,
      captain: "Not Assigned",
      players: Number.parseInt(players),
      status: "Incomplete",
    })
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setTournament("")
    setPlayers("0")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => {
            console.log("Add Team button clicked")
            setOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team</DialogTitle>
            <DialogDescription>Create a new team for a tournament. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Team Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
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
              <Label htmlFor="players" className="text-right">
                Initial Players
              </Label>
              <Input
                id="players"
                type="number"
                min="0"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
