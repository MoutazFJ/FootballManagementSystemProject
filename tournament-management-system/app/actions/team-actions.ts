"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTeams() {
  try {
    // Direct SQL query to get teams with related data
    const result = await query(`
      SELECT 
    t.team_id,
    t.team_name,
    tr.tr_id,
    tr.tr_name AS tournament_name,
    COUNT(DISTINCT tp.player_id) AS number_of_players
FROM 
    TEAM t
JOIN 
    TOURNAMENT_TEAM tt ON t.team_id = tt.team_id
JOIN 
    TOURNAMENT tr ON tt.tr_id = tr.tr_id
LEFT JOIN 
    TEAM_PLAYER tp ON t.team_id = tp.team_id AND tr.tr_id = tp.tr_id
GROUP BY 
    t.team_id, t.team_name, tr.tr_id, tr.tr_name
ORDER BY 
    t.team_name, tr.tr_name;

    `)

    // Transform the data to match the frontend format
    return result.rows.map((team) => {
      return {
        id: team.id.toString(),
        name: team.name,
        tournament: team.tournament_name || "No Tournament",
        captain: "Not Assigned", // We'll need a separate query to get captains
        players: Number.parseInt(team.player_count) || 0,
        status: Number.parseInt(team.player_count) > 0 ? "Complete" : "Incomplete",
      }
    })
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("Failed to fetch teams")
  }
}

export async function createTeam(data: {
  name: string
  tournament: string
  players: number
}) {
  try {
    // Find the tournament by name
    const tournamentResult = await query(`SELECT id FROM tournament WHERE name = $1`, [data.tournament])

    if (tournamentResult.rows.length === 0) {
      throw new Error(`Tournament "${data.tournament}" not found`)
    }

    const tournamentId = tournamentResult.rows[0].id

    // Generate a random ID between 1000 and 9999
    const id = Math.floor(Math.random() * 9000) + 1000

    // Create the team
    await query(`INSERT INTO team (id, name) VALUES ($1, $2)`, [id, data.name])

    // Create the tournament-team relationship
    await query(
      `
      INSERT INTO tournament_team (
        teamid, tournamentid, "group", matchplayed, won, draw, lost, 
        goalfor, goalagainst, goaldiff, points, groupposition
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `,
      [id, tournamentId, "A", 0, 0, 0, 0, 0, 0, 0, 0, 0],
    )

    revalidatePath("/admin/teams")
    return { id, name: data.name }
  } catch (error) {
    console.error("Error creating team:", error)
    throw new Error("Failed to create team")
  }
}

export async function assignCaptain(teamId: number, captainName: string) {
  try {
    // In a real application, you would update the captain in the database
    // For now, we'll just revalidate the path
    revalidatePath("/admin/teams")
    return { success: true }
  } catch (error) {
    console.error("Error assigning captain:", error)
    throw new Error("Failed to assign captain")
  }
}
