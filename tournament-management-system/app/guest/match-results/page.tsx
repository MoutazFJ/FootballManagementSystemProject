"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MatchResultsPage() {
  const { matchResults } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const { selectedTournament, setSelectedTournament } = useAppContext()

  // app/guest/match-results/page.tsx
// Check this section to ensure it correctly filters by tournament name
const filteredResults = matchResults.filter(
  (match) =>
    (selectedTournament === "all" || match.tournament.includes(selectedTournament)) &&
    (match.home.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.away.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchQuery.toLowerCase())),
)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Match Results" userRole="guest" />
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
            <Input
              placeholder="Search matches..."
              className="w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Match Results</CardTitle>
            <CardDescription>Browse all match results sorted by date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Home Team</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Away Team</TableHead>
                  <TableHead>Venue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.tournament}</TableCell>
                    <TableCell className="font-medium">{match.home}</TableCell>
                    <TableCell className="font-bold">{match.score}</TableCell>
                    <TableCell className="font-medium">{match.away}</TableCell>
                    <TableCell>{match.venue}</TableCell>
                  </TableRow>
                ))}
                {filteredResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No match results found.
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
