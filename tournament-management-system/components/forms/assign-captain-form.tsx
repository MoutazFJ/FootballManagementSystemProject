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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AssignCaptainFormProps {
  teamId: string
  teamName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignCaptainForm({ teamId, teamName, open, onOpenChange }: AssignCaptainFormProps) {
  const { assignCaptain } = useAppContext()
  const [captainName, setCaptainName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    assignCaptain(teamId, captainName)
    onOpenChange(false)
    setCaptainName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Captain</DialogTitle>
            <DialogDescription>Assign a captain to {teamName}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captainName" className="text-right">
                Captain Name
              </Label>
              <Input
                id="captainName"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Assign Captain</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
