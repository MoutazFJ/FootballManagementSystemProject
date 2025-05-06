"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function RedCardsPage() {
  const { redCards } = useAppContext()
  const [selectedTeam, setSelectedTeam] = useState("all")

  const filteredRedCards = redCards.filter(
    (card) => selectedTeam === "all" || card.team.toLowerCase().includes(selectedTeam.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Players with Red Cards" userRole="guest" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="KBS">KBS</SelectItem>
                <SelectItem value="CEP">CEP</SelectItem>
                <SelectItem value="CPG">CPG</SelectItem>
                <SelectItem value="CCM">CCM</SelectItem>
                <SelectItem value="CDB">CDB</SelectItem>
                <SelectItem value="CGS">CGS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Players with Red Cards</CardTitle>
            <CardDescription>Browse players who received red cards in each team.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRedCards.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.tournament}</TableCell>
                    <TableCell>{player.match}</TableCell>
                    <TableCell>{player.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">{player.reason}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRedCards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No red cards found for the selected team.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
