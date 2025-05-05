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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SendReminderFormProps {
  matchId: string
  homeTeam: string
  awayTeam: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendReminderForm({ matchId, homeTeam, awayTeam, open, onOpenChange }: SendReminderFormProps) {
  const { sendMatchReminder } = useAppContext()
  const [message, setMessage] = useState(
    `Dear Team Members,\n\nThis is a reminder about your upcoming match: ${homeTeam} vs ${awayTeam}.\n\nPlease arrive at least 30 minutes before the scheduled start time.\n\nRegards,\nTournament Management Team`,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMatchReminder(matchId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send Match Reminder</DialogTitle>
            <DialogDescription>
              Send an email reminder to all players of {homeTeam} and {awayTeam}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
                rows={8}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Send Reminder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
