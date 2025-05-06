"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getMatches() {
  try {
    const result = await query(`
      SELECT 
        m.match_no, 
        m.play_date, 
        m.play_stage,
        m.results,
        m.goal_score,
        t1.team_name AS team1_name,
        t2.team_name AS team2_name,
        v.venue_name,
        t.tr_name AS tournament_name
      FROM 
        match_played m
      JOIN 
        team t1 ON m.team_id1 = t1.team_id
      JOIN 
        team t2 ON m.team_id2 = t2.team_id
      JOIN 
        venue v ON m.venue_id = v.venue_id
      JOIN 
        tournament t ON m.play_stage = t.tr_id
    `);

    // Transform the data to match the frontend format
    return result.rows.map((match) => {
      return {
        id: match.match_no.toString(),
        date: new Date(match.play_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        tournament: match.tournament_name,
        home: match.team1_name,
        away: match.team2_name,
        venue: match.venue_name,
        status: match.results === "TBD" ? "Scheduled" : "Completed",
        score: match.goal_score,
      };
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
}
export async function getMatchResults() {
  try {
    const result = await query(`
      SELECT 
    m.match_no, 
    m.play_date, 
    m.play_stage,
    m.results,
    m.goal_score,
    t1.team_name AS team1_name,
    t2.team_name AS team2_name,
    v.venue_name,
    t.tr_name AS tournament_name
    FROM 
    match_played m
    JOIN 
    team t1 ON m.team_id1 = t1.team_id
    JOIN 
    team t2 ON m.team_id2 = t2.team_id
    JOIN 
    venue v ON m.venue_id = v.venue_id
    JOIN 
    tournament t ON m.match_no = t.tr_id
    `)

    // Transform the data to match the frontend format
    return result.rows.map((match) => {
      return {
        id: match.match_no.toString(),
        date: new Date(match.play_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        tournament: match.tournament_name, // Use the tournament name from the query instead of determineTournament()
        home: match.team1_name,
        away: match.team2_name,
        score: match.goal_score,
        venue: match.venue_name,
      }
    })
  } catch (error) {
    console.error("Error fetching match results:", error)
    throw new Error("Failed to fetch match results")
  }
}

export async function createMatch(data: {
  date: string
  tournament: string
  home: string
  away: string
  venue: string
}) {
  try {
    // Find the teams by name
    const homeTeamResult = await query(`SELECT id FROM team WHERE name = $1`, [data.home])
    const awayTeamResult = await query(`SELECT id FROM team WHERE name = $1`, [data.away])

    if (homeTeamResult.rows.length === 0 || awayTeamResult.rows.length === 0) {
      throw new Error("One or both teams not found")
    }

    const homeTeamId = homeTeamResult.rows[0].id
    const awayTeamId = awayTeamResult.rows[0].id

    // Find or create venue
    let venueId
    const venueResult = await query(`SELECT id FROM venue WHERE name = $1`, [data.venue])

    if (venueResult.rows.length === 0) {
      // Generate a random ID between 50 and 99
      venueId = Math.floor(Math.random() * 50) + 50

      await query(
        `
        INSERT INTO venue (id, name, status, capacity) 
        VALUES ($1, $2, $3, $4)
      `,
        [venueId, data.venue, "Y", 1000],
      )
    } else {
      venueId = venueResult.rows[0].id
    }

    // Find a player for player of match (just using the first player we find)
    const playerResult = await query(`SELECT id FROM player LIMIT 1`)

    if (playerResult.rows.length === 0) {
      throw new Error("No players found for player of match")
    }

    const playerId = playerResult.rows[0].id

    // Generate a random match number between 100 and 999
    const matchNo = Math.floor(Math.random() * 900) + 100

    // Create the match
    await query(
      `
      INSERT INTO match_played (
        matchno, playstage, playdate, teamid1, teamid2, results, 
        decidedby, goalscore, venueid, audience, playerofmatchid, stop1sec, stop2sec
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `,
      [matchNo, "G", new Date(data.date), homeTeamId, awayTeamId, "TBD", "N", "0-0", venueId, 0, playerId, 0, 0],
    )

    revalidatePath("/admin/matches")
    return {
      id: matchNo,
      date: data.date,
      home: data.home,
      away: data.away,
      venue: data.venue,
    }
  } catch (error) {
    console.error("Error creating match:", error)
    throw new Error("Failed to create match")
  }
}

// Helper function to determine tournament based on play stage
function determineTournament(playStage: string): string {
  switch (playStage) {
    case "G":
      return "Summer Championship"
    case "F":
      return "Regional Tournament"
    default:
      return "Unknown Tournament"
  }
}
