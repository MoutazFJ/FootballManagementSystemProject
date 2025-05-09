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
  id?: number;
  name: string
  startDate: string
  endDate: string
  status: string
}) {
  try {
    // Generate a random ID between 10 and 999
    const tr_id = data.id || Math.floor(Math.random() * 990) + 10;
    // Insert the tournament using SQL
    await query(
      `INSERT INTO tournament (tr_id, tr_name, start_date, end_date) 
       VALUES ($1, $2, $3, $4)`,
      [tr_id, data.name, new Date(data.startDate), new Date(data.endDate)]
    );

    revalidatePath("/admin/tournaments");
    return { id: tr_id.toString(), ...data };
  } catch (error) {
    console.error("Error creating tournament:", error)
    throw new Error("Failed to create tournament")
  }
}

// File: app/actions/tournament-actions.ts

export async function updateTournamentDates(data: {
  tournamentId: string | number;
  startDate: string;
  endDate: string;
}) {
  try {
    // Convert tournamentId to number if it's a string
    const tr_id = typeof data.tournamentId === 'string' ? parseInt(data.tournamentId, 10) : data.tournamentId;
    
    // Parse dates to ensure they're in the correct format
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }
    
    if (startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }
    
    // Execute the update query
    await query(
      `UPDATE tournament SET start_date = $1, end_date = $2 WHERE tr_id = $3`,
      [startDate, endDate, tr_id]
    );
    
    // Revalidate the tournaments page to reflect changes
    revalidatePath("/admin/tournaments");
    
    return { 
      success: true,
      updatedTournament: {
        id: tr_id,
        startDate: startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        endDate: endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }
    };
  } catch (error) {
    console.error("Error updating tournament dates:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update tournament dates");
  }
}

export async function deleteTournament(tournamentId: string | number) {
  try {
    // Convert tournamentId to number if it's a string
    const tr_id = typeof tournamentId === 'string' ? parseInt(tournamentId, 10) : tournamentId;
    
    
    await query(`DELETE FROM tournament_team WHERE tr_id = $1`, [tr_id]);
    
    await query(`DELETE FROM team_player WHERE tr_id = $1`, [tr_id]);
    
    
    await query(`DELETE FROM tournament WHERE tr_id = $1`, [tr_id]);

    revalidatePath("/admin/tournaments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tournament:", error);
    throw new Error("Failed to delete tournament");
  }}



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