"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { useAppContext } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Add these new imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssignCaptainFormProps {
  teamId: string
  teamName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignCaptainForm({ teamId, teamName, open, onOpenChange }: AssignCaptainFormProps) {
  const { assignCaptain , getPlayersByTeamId, currentTeamPlayers } = useAppContext()
  const [captainName, setCaptainName] = useState("")
  const [selectedPlayerId, setSelectedPlayerId] = useState("")


  useEffect(() => {
    if (open) {
      getPlayersByTeamId(Number(teamId))
    }
  }, [open, teamId, getPlayersByTeamId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPlayerId) {
      assignCaptain(teamId, selectedPlayerId)
      onOpenChange(false)
      setSelectedPlayerId("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Captain</DialogTitle>
            <DialogDescription>Select a captain for {teamName}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captain" className="text-right">
                Select Player
              </Label>
              <Select
                value={selectedPlayerId}
                onValueChange={setSelectedPlayerId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a player" />
                </SelectTrigger>
                <SelectContent>
                  {currentTeamPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedPlayerId}>
              Assign Captain
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}