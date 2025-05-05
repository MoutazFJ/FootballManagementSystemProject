"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PlayersPage() {
  const { players, approvePlayer, rejectPlayer } = useAppContext()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.tournament.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprovePlayer = (playerId: string, playerName: string) => {
    approvePlayer(playerId)
    toast({
      title: "Player Approved",
      description: `${playerName} has been approved successfully.`,
    })
  }

  const handleRejectPlayer = (playerId: string, playerName: string) => {
    rejectPlayer(playerId)
    toast({
      title: "Player Rejected",
      description: `${playerName} has been rejected.`,
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Player Approvals" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search players..."
              className="w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Player Approvals</CardTitle>
            <CardDescription>Review and approve player registrations for teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.tournament}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600"
                          onClick={() => handleApprovePlayer(player.id, player.name)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleRejectPlayer(player.id, player.name)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPlayers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No pending player approvals found.
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
