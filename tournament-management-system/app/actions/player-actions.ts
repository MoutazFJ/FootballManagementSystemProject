"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getPlayers() {
  try {
    const result = await query(`
      SELECT 
        tp.playerid,
        per.name as player_name,
        t.name as team_name,
        tour.name as tournament_name,
        pos.description as position_description
      FROM 
        team_player tp
      JOIN 
        player p ON tp.playerid = p.id
      JOIN 
        person per ON p.id = per.id
      JOIN 
        team t ON tp.teamid = t.id
      JOIN 
        tournament tour ON tp.tournamentid = tour.id
      JOIN 
        playing_position pos ON p.positiontoplay = pos.id
    `)

    // Transform the data to match the frontend format
    return result.rows.map((tp, index) => {
      return {
        id: `p${index + 1}`,
        name: tp.player_name,
        team: tp.team_name,
        tournament: tp.tournament_name,
        position: tp.position_description,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }
    })
  } catch (error) {
    console.error("Error fetching players:", error)
    throw new Error("Failed to fetch players")
  }
}

export async function approvePlayer(playerId: string) {
  try {
    // In a real application, you would update the player's status in the database
    // For now, we'll just revalidate the path
    revalidatePath("/admin/players")
    return { success: true }
  } catch (error) {
    console.error("Error approving player:", error)
    throw new Error("Failed to approve player")
  }
}

export async function rejectPlayer(playerId: string) {
  try {
    // In a real application, you would delete or update the player's status in the database
    // For now, we'll just revalidate the path
    revalidatePath("/admin/players")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting player:", error)
    throw new Error("Failed to reject player")
  }
}
