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
        id: `${team.team_id}`,
        name: team.team_name,
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
    // Step 1: Get tr_id from tournament name
    const tournamentResult = await query(
      `SELECT tr_id FROM tournament WHERE tr_name = $1`,
      [data.tournament]
    )

    if (tournamentResult.rows.length === 0) {
      throw new Error(`Tournament "${data.tournament}" not found`)
    }

    const tournamentId = tournamentResult.rows[0].tr_id

    // Step 2: Generate a unique team_id (4-digit)
    let teamId = Math.floor(Math.random() * 9000) + 1000
    let check = await query(`SELECT 1 FROM team WHERE team_id = $1`, [teamId])
    while (check.rows.length > 0) {
      teamId = Math.floor(Math.random() * 9000) + 1000
      check = await query(`SELECT 1 FROM team WHERE team_id = $1`, [teamId])
    }

    // Step 3: Insert into team table
    await query(
      `INSERT INTO team (team_id, team_name) VALUES ($1, $2)`,
      [teamId, data.name]
    )

    // Step 4: Insert into tournament_team table
    await query(
      `
      INSERT INTO tournament_team (
        team_id, tr_id, team_group, match_played, won, draw, lost,
        goal_for, goal_against, goal_diff, points, group_position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
      [teamId, tournamentId, "A", 0, 0, 0, 0, 0, 0, 0, 0, 0]
    )

    revalidatePath("/admin/teams")
    return { id: teamId, name: data.name }
  } catch (error) {
    console.error("Error creating team:", error)
    throw new Error("Failed to create team")
  }
}



export async function assignCaptain(teamId: number, captainName: number) {
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

export async function getAllPersons() {
  try {
    const result = await query(`
      SELECT p.*, 
             CASE 
                 WHEN pl.player_id IS NOT NULL THEN 'Player'
                 WHEN ts.support_type = 'HC' THEN 'Head Coach'
                 WHEN ts.support_type = 'AC' THEN 'Assistant Coach'
                 WHEN ts.support_type = 'MG' THEN 'Manager'
                 ELSE 'Other Support Staff'
             END AS role,
             COALESCE(t.team_name, ts_team.team_name) AS team_name
      FROM person p
      LEFT JOIN player pl ON p.kfupm_id = pl.player_id
      LEFT JOIN team_support ts ON p.kfupm_id = ts.support_id
      LEFT JOIN team_player tp ON pl.player_id = tp.player_id
      LEFT JOIN team t ON tp.team_id = t.team_id
      LEFT JOIN team ts_team ON ts.team_id = ts_team.team_id
    `)

    return result.rows.map((person) => {
      return {
        id: person.kfupm_id,
        name: person.name,
        email: person.email,
        role: person.role,
        team: person.team_name || "No Team"
      }
    })
  } catch (error) {
    console.error("Error fetching people:", error)
    throw new Error("Failed to fetch people")
  }
}
