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

export function AddTournamentForm() {
  console.log("Rendering AddTournamentForm")
  const { addTournament } = useAppContext()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState<"Active" | "Planning" | "Completed">("Planning")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Tournament form submitted", { name, startDate, endDate, status })
    addTournament({
      name,
      startDate,
      endDate,
      teams: 0,
      status,
    })
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setStartDate("")
    setEndDate("")
    setStatus("Planning")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => {
            console.log("Add Tournament button clicked")
            setOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Tournament</DialogTitle>
            <DialogDescription>Create a new tournament. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="text"
                placeholder="e.g., May 15, 2025"
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
                type="text"
                placeholder="e.g., Aug 30, 2025"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Tournament</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
