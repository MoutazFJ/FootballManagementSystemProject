"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getTournaments, createTournament, deleteTournament } from "@/app/actions/tournament-actions"
import { getTeams, createTeam, assignCaptain as assignTeamCaptain } from "@/app/actions/team-actions"
import {
  getPlayers,
  getPlayersByTeamId as getPlayersByTeamIdAction,
  approvePlayer as approvePlayerAction,
  rejectPlayer as rejectPlayerAction,
} from "@/app/actions/player-actions"
import { getMatches, getMatchResults, createMatch } from "@/app/actions/match-actions"
import { getTopScorers, getRedCards, getTeamMembers } from "@/app/actions/stats-actions"

// Define types for our data
export type Tournament = {
  id: string
  name: string
  startDate: string
  endDate: string
  teams: number
  status: "Active" | "Completed" | "Planning"
}

export type Team = {
  id: string
  name: string
  tournament: string
  captain: number
  players: number
  status: "Complete" | "Incomplete"
}

export type Player = {
  id: string
  name: string
  team: string
  tournament: string
  position: string
  date: string
}

export type Match = {
  id: string
  date: string
  tournament: string
  home: string
  away: string
  score?: string
  venue: string
  status: "Scheduled" | "Completed" | "Cancelled"
}

export type MatchResult = {
  id: string
  date: string
  tournament: string
  home: string
  score: string
  away: string
  venue: string
}

export type TopScorer = {
  id: string
  rank: number
  name: string
  team: string
  tournament: string
  goals: number
  matches: number
  avg: string
}

export type RedCard = {
  id: string
  name: string
  team: string
  tournament: string
  match: string
  date: string
  reason: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  position?: string
  number?: string
  experience?: string
  joined: string
}

// Initial data (will be replaced with data from the server)
const initialTournaments: Tournament[] = []
const initialTeams: Team[] = []
const initialPlayers: Player[] = []
const initialMatches: Match[] = []
const initialMatchResults: MatchResult[] = []
const initialTopScorers: TopScorer[] = []
const initialRedCards: RedCard[] = []
const initialTeamMembers: TeamMember[] = []

// Create context type
type AppContextType = {
  tournaments: Tournament[]
  teams: Team[]
  players: Player[]
  matches: Match[]
  matchResults: MatchResult[]
  topScorers: TopScorer[]
  redCards: RedCard[]
  teamMembers: TeamMember[]
  loading: boolean
  addTournament: (tournament: Omit<Tournament, "id">) => void
  updateTournament: (tournament: Tournament) => void
  deleteTournament: (id: string) => void
  addTeam: (team: Omit<Team, "id">) => void
  updateTeam: (team: Team) => void
  assignCaptain: (teamId: string, captainName: string) => void
  approvePlayer: (playerId: string) => void
  rejectPlayer: (playerId: string) => void
  addMatch: (match: Omit<Match, "id">) => void
  updateMatch: (match: Match) => void
  sendMatchReminder: (matchId: string) => void
  selectedTeam: string
  setSelectedTeam: (team: string) => void
  selectedTournament: string
  setSelectedTournament: (tournament: string) => void
  notifications: { id: string; message: string }[]
  addNotification: (message: string) => void
  clearNotifications: () => void
  getPlayersByTeamId: (teamId: number) => Promise<void>;
  currentTeamPlayers: Player[];  
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  tournaments: [],
  teams: [],
  players: [],
  matches: [],
  matchResults: [],
  topScorers: [],
  redCards: [],
  teamMembers: [],
  loading: true,
  addTournament: () => {},
  updateTournament: () => {},
  deleteTournament: () => {},
  addTeam: () => {},
  updateTeam: () => {},
  assignCaptain: () => {},
  approvePlayer: () => {},
  rejectPlayer: () => {},
  addMatch: () => {},
  updateMatch: () => {},
  sendMatchReminder: () => {},
  selectedTeam: "alpha",
  setSelectedTeam: () => {},
  selectedTournament: "all",
  setSelectedTournament: () => {},
  notifications: [],
  addNotification: () => {},
  clearNotifications: () => {},
  getPlayersByTeamId: () => Promise.resolve(),
  currentTeamPlayers: [],
})

// Create provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [matchResults, setMatchResults] = useState<MatchResult[]>(initialMatchResults)
  const [topScorers, setTopScorers] = useState<TopScorer[]>(initialTopScorers)
  const [redCards, setRedCards] = useState<RedCard[]>(initialRedCards)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [selectedTeam, setSelectedTeam] = useState<string>("alpha")
  const [selectedTournament, setSelectedTournament] = useState<string>("all")
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentTeamPlayers, setCurrentTeamPlayers] = useState<Player[]>([])

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [
          tournamentsData,
          teamsData,
          // playersData,
          // matchesData,
           matchResultsData,
           topScorersData,
           redCardsData,
           teamMembersData,
        ] = await Promise.all([
          getTournaments(),
          getTeams(),
          // getPlayers(),
          // getMatches(),
           getMatchResults(),
           getTopScorers(),
           getRedCards(),
           getTeamMembers(),
        ])
        console.log("the fetch is", tournamentsData)
        setTournaments(tournamentsData)
        setTeams(teamsData)
        // setPlayers(playersData)
        // setMatches(matchesData)
         setMatchResults(matchResultsData)
         setTopScorers(topScorersData)
         setRedCards(redCardsData)
        setTeamMembers(teamMembersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        addNotification("Error loading data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Tournament functions
  const addTournament = async (tournament: Omit<Tournament, "id">) => {
    console.log("Adding tournament:", tournament)
    try {
      await createTournament({
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        status: tournament.status,
      })

      // Refresh tournaments
      const updatedTournaments = await getTournaments()
      setTournaments(updatedTournaments)

      addNotification(`Tournament "${tournament.name}" has been added`)
    } catch (error) {
      console.error("Error adding tournament:", error)
      addNotification("Failed to add tournament. Please try again.")
    }
  }

  const updateTournament = (tournament: Tournament) => {
    // For now, just update the local state
    setTournaments(tournaments.map((t) => (t.id === tournament.id ? tournament : t)))
    addNotification(`Tournament "${tournament.name}" has been updated`)
  }

  const deleteTournamentHandler = async (id: string) => {
    try {
      const tournamentToDelete = tournaments.find((t) => t.id === id)
      await deleteTournament(Number.parseInt(id))

      // Refresh tournaments
      const updatedTournaments = await getTournaments()
      setTournaments(updatedTournaments)

      if (tournamentToDelete) {
        addNotification(`Tournament "${tournamentToDelete.name}" has been deleted`)
      }
    } catch (error) {
      console.error("Error deleting tournament:", error)
      addNotification("Failed to delete tournament. Please try again.")
    }
  }

  // Team functions
  const addTeam = async (team: Omit<Team, "id">) => {
    console.log("Adding team:", team)
    try {
      await createTeam({
        name: team.name,
        tournament: team.tournament,
        players: team.players,
      })

      // Refresh teams
      const updatedTeams = await getTeams()
      setTeams(updatedTeams)

      addNotification(`Team "${team.name}" has been added to ${team.tournament}`)
    } catch (error) {
      console.error("Error adding team:", error)
      addNotification("Failed to add team. Please try again.")
    }
  }

  const getPlayersByTeamId = async (teamId: number) => {
    try {

      const playersData = await getPlayersByTeamIdAction(teamId)
      setCurrentTeamPlayers(playersData)
      

     
    } catch (error) {
      console.error("Error approving player:", error)
      addNotification("Failed to approve player. Please try again.")
    }
  }

  const updateTeam = (team: Team) => {
    // For now, just update the local state
    setTeams(teams.map((t) => (t.id === team.id ? team : t)))
    addNotification(`Team "${team.name}" has been updated`)
  }

  const assignCaptain = async (teamId: string, captainId: number) => {
    try {
      await assignTeamCaptain(Number.parseInt(teamId), captainId)

      // Update local state
      setTeams(
        teams.map((team) => {
          if (team.id === teamId) {
            return { ...team, captain: captainId, status: "Complete" as const }
          }
          return team
        }),
      )

      const team = teams.find((t) => t.id === teamId)
      if (team) {
        addNotification(`${captainId} has been assigned as captain of ${team.name}`)
      }
    } catch (error) {
      console.error("Error assigning captain:", error)
      addNotification("Failed to assign captain. Please try again.")
    }
  }

  // Player functions
  const approvePlayer = async (playerId: string) => {
    try {
      await approvePlayerAction(playerId)

      const player = players.find((p) => p.id === playerId)
      setPlayers(players.filter((p) => p.id !== playerId))

      if (player) {
        addNotification(`Player ${player.name} has been approved for ${player.team}`)
      }
    } catch (error) {
      console.error("Error approving player:", error)
      addNotification("Failed to approve player. Please try again.")
    }
  }

  const rejectPlayer = async (playerId: string) => {
    try {
      await rejectPlayerAction(playerId)

      const player = players.find((p) => p.id === playerId)
      setPlayers(players.filter((p) => p.id !== playerId))

      if (player) {
        addNotification(`Player ${player.name} has been rejected`)
      }
    } catch (error) {
      console.error("Error rejecting player:", error)
      addNotification("Failed to reject player. Please try again.")
    }
  }

  // Match functions
  const addMatch = async (match: Omit<Match, "id">) => {
    console.log("Adding match:", match)
    try {
      await createMatch({
        date: match.date,
        tournament: match.tournament,
        home: match.home,
        away: match.away,
        venue: match.venue,
      })

      // Refresh matches
      const updatedMatches = await getMatches()
      setMatches(updatedMatches)

      addNotification(`New match: ${match.home} vs ${match.away} has been scheduled`)
    } catch (error) {
      console.error("Error adding match:", error)
      addNotification("Failed to add match. Please try again.")
    }
  }

  const updateMatch = (match: Match) => {
    // For now, just update the local state
    setMatches(matches.map((m) => (m.id === match.id ? match : m)))
    addNotification(`Match details for ${match.home} vs ${match.away} have been updated`)
  }

  const sendMatchReminder = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId)
    if (match) {
      addNotification(`Email reminders sent to ${match.home} and ${match.away} team members`)
    }
  }

  // Notification functions
  const addNotification = (message: string) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      message,
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const value = {
    tournaments,
    teams,
    players,
    matches,
    matchResults,
    topScorers,
    redCards,
    teamMembers,
    loading,
    addTournament,
    updateTournament,
    deleteTournament: deleteTournamentHandler,
    addTeam,
    updateTeam,
    assignCaptain,
    approvePlayer,
    rejectPlayer,
    addMatch,
    updateMatch,
    sendMatchReminder,
    selectedTeam,
    setSelectedTeam,
    selectedTournament,
    setSelectedTournament,
    notifications,
    addNotification,
    clearNotifications,
    getPlayersByTeamId,
    currentTeamPlayers,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext)
