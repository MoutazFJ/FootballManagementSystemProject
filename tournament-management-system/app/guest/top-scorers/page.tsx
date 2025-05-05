"use client"

import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TopScorersPage() {
  const { topScorers } = useAppContext()
  const { selectedTournament, setSelectedTournament } = useAppContext()

  const filteredScorers = topScorers.filter(
    (scorer) => selectedTournament === "all" || scorer.tournament.includes(selectedTournament),
  )

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Top Goal Scorers" userRole="guest" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tournaments</SelectItem>
                <SelectItem value="Summer">Summer Championship</SelectItem>
                <SelectItem value="Regional">Regional Tournament</SelectItem>
                <SelectItem value="Winter">Winter Cup</SelectItem>
                <SelectItem value="Spring">Spring League</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Goal Scorers</CardTitle>
            <CardDescription>Players with the highest goals scored across all tournaments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead>Avg. Goals/Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScorers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.rank}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.tournament}</TableCell>
                    <TableCell>{player.goals}</TableCell>
                    <TableCell>{player.matches}</TableCell>
                    <TableCell>{player.avg}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
