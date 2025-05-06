"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Mail } from "lucide-react"
import { AddMatchForm } from "@/components/forms/add-match-form"
import { SendReminderForm } from "@/components/forms/send-reminder-form"
import { useToast } from "@/hooks/use-toast"
import { SimpleAddMatch } from "@/components/forms/simple-add-match"

export default function MatchesPage() {
  const { matches } = useAppContext()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<{ id: string; home: string; away: string } | null>(null)

  console.log("Rendering MatchesPage, matches:", matches)

  // app/admin/matches/page.tsx
// Check the filtering logic here
const filteredMatches = matches.filter(
  (match) =>
    match.home.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.away.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.venue.toLowerCase().includes(searchQuery.toLowerCase()),
)

  const handleSendReminder = (matchId: string, homeTeam: string, awayTeam: string) => {
    setSelectedMatch({ id: matchId, home: homeTeam, away: awayTeam })
    setReminderDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Matches" userRole="admin" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search matches..."
              className="w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <AddMatchForm />
            <SimpleAddMatch />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Matches</CardTitle>
            <CardDescription>Manage matches and send email reminders to team members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Home Team</TableHead>
                  <TableHead>Away Team</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.tournament}</TableCell>
                    <TableCell className="font-medium">{match.home}</TableCell>
                    <TableCell className="font-medium">{match.away}</TableCell>
                    <TableCell>{match.venue}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        {match.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Match"
                          onClick={() => {
                            toast({
                              title: "Edit Match",
                              description: "Match edit functionality would open here.",
                            })
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Send Reminder"
                          onClick={() => handleSendReminder(match.id, match.home, match.away)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No matches found. Try a different search or add a new match.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {selectedMatch && (
        <SendReminderForm
          matchId={selectedMatch.id}
          homeTeam={selectedMatch.home}
          awayTeam={selectedMatch.away}
          open={reminderDialogOpen}
          onOpenChange={setReminderDialogOpen}
        />
      )}
    </div>
  )
}
