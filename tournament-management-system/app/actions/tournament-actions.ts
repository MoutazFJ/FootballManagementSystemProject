"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTournaments() {
  try {
    const result = await query(`
      SELECT 
    tr_id AS tournament_id,
    tr_name AS tournament_name,
    start_date,
    end_date
        FROM 
          TOURNAMENT
          ORDER BY 
    start_date DESC;
    `)
    console.log("hiiiiiiiiiiiiiiii")
    // console.log(result.rows)
      console.log(result.rows)
    // Transform the data to match the frontend format
    return result.rows.map((tournament) => ({
      id: `${tournament.tournament_id}`,
      name: tournament.tournament_name,
      startDate: new Date(tournament.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate: new Date(tournament.end_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))
  } catch (error) {
    console.log("hiiiiiiiii")
    console.error("Error fetching tournaments:", error)
    throw new Error("Failed to fetch tournaments")
  }
}

export async function createTournament(data: {
  name: string
  startDate: string
  endDate: string
  status: string
}) {
  try {
    // Generate a random ID between 10 and 999
    const id = Math.floor(Math.random() * 990) + 10

    // Insert the tournament using SQL
    await query(
      `INSERT INTO tournament (id, name, startdate, enddate) 
       VALUES ($1, $2, $3, $4)`,
      [id, data.name, new Date(data.startDate), new Date(data.endDate)],
    )

    revalidatePath("/admin/tournaments")
    return { id, ...data }
  } catch (error) {
    console.error("Error creating tournament:", error)
    throw new Error("Failed to create tournament")
  }
}

export async function deleteTournament(id: number) {
  try {
    // Delete related records first
    await query(`DELETE FROM tournament_team WHERE tournamentid = $1`, [id])
    await query(`DELETE FROM team_player WHERE tournamentid = $1`, [id])
    await query(`DELETE FROM team_support WHERE tournamentid = $1`, [id])

    // Then delete the tournament
    await query(`DELETE FROM tournament WHERE id = $1`, [id])

    revalidatePath("/admin/tournaments")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tournament:", error)
    throw new Error("Failed to delete tournament")
  }
}

// Helper function to determine tournament status based on dates
function determineStatus(startDate: Date, endDate: Date): "Active" | "Planning" | "Completed" {
  const now = new Date()

  if (now < startDate) {
    return "Planning"
  } else if (now > endDate) {
    return "Completed"
  } else {
    return "Active"
  }
}
