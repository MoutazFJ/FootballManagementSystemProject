"use server"

import { query } from "@/lib/db"

export async function getTopScorers() {
  try {
    const result = await query(`
      SELECT 
        gd.playerid,
        p.name as player_name,
        t.name as team_name,
        COUNT(gd.goalid) as goals,
        COUNT(DISTINCT gd.matchno) as matches
      FROM 
        goal_details gd
      JOIN 
        person p ON gd.playerid = p.id
      JOIN 
        team t ON gd.teamid = t.id
      GROUP BY 
        gd.playerid, p.name, t.name
      ORDER BY 
        goals DESC
    `)

    // Transform to the format expected by the frontend
    return result.rows.map((item, index) => ({
      id: `ts${index + 1}`,
      rank: index + 1,
      name: item.player_name,
      team: item.team_name,
      tournament: determineTournament(Number.parseInt(item.matches)),
      goals: Number.parseInt(item.goals),
      matches: Number.parseInt(item.matches),
      avg: (Number.parseInt(item.goals) / Number.parseInt(item.matches)).toFixed(1),
    }))
  } catch (error) {
    console.error("Error fetching top scorers:", error)
    return []
  }
}

export async function getRedCards() {
  try {
    const result = await query(`
      SELECT 
        pb.playerid,
        p.name as player_name,
        t.name as team_name,
        m.matchno,
        m.playdate,
        pb.bookingtime,
        t1.name as team1_name,
        t2.name as team2_name
      FROM 
        player_booked pb
      JOIN 
        person p ON pb.playerid = p.id
      JOIN 
        team t ON pb.teamid = t.id
      JOIN 
        match_played m ON pb.matchno = m.matchno
      JOIN 
        team t1 ON m.teamid1 = t1.id
      JOIN 
        team t2 ON m.teamid2 = t2.id
      WHERE 
        pb.sentoff = 'Y'
    `)

    return result.rows.map((booking, index) => ({
      id: `rc${index + 1}`,
      name: booking.player_name,
      team: booking.team_name,
      tournament: determineTournament(1),
      match: `${booking.team1_name} vs ${booking.team2_name}`,
      date: new Date(booking.playdate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      reason: determineRedCardReason(booking.bookingtime),
    }))
  } catch (error) {
    console.error("Error fetching red cards:", error)
    return []
  }
}

export async function getTeamMembers() {
  try {
    // Get players
    const playersResult = await query(`
      SELECT 
        p.id,
        per.name,
        p.positiontoplay,
        p.jerseyno,
        pos.description as position_description,
        t.name as team_name
      FROM 
        player p
      JOIN 
        person per ON p.id = per.id
      JOIN 
        playing_position pos ON p.positiontoplay = pos.id
      LEFT JOIN 
        team_player tp ON p.id = tp.playerid
      LEFT JOIN 
        team t ON tp.teamid = t.id
    `)

    // Get support staff
    const staffResult = await query(`
      SELECT 
        ts.supportid,
        p.name,
        s.description as role,
        t.name as team_name
      FROM 
        team_support ts
      JOIN 
        person p ON ts.supportid = p.id
      JOIN 
        support s ON ts.supporttype = s.type
      JOIN 
        team t ON ts.teamid = t.id
    `)

    // Combine and format the data
    const teamMembers = [
      ...playersResult.rows.map((player, index) => {
        return {
          id: `tm${index + 1}`,
          name: player.name,
          role: player.positiontoplay === "MF" ? "Captain" : "Player",
          position: player.position_description,
          number: player.jerseyno.toString(),
          joined: new Date().getFullYear().toString(),
        }
      }),
      ...staffResult.rows.map((staff, index) => {
        return {
          id: `ts${index + 1}`,
          name: staff.name,
          role: staff.role,
          experience: `${Math.floor(Math.random() * 10) + 1} years`,
          joined: (new Date().getFullYear() - Math.floor(Math.random() * 5)).toString(),
        }
      }),
    ]

    return teamMembers
  } catch (error) {
    console.error("Error fetching team members:", error)
    return []
  }
}

// Helper functions
function determineTournament(matchCount: number): string {
  if (matchCount > 5) {
    return "Summer Championship"
  } else if (matchCount > 3) {
    return "Regional Tournament"
  } else {
    return "Spring League"
  }
}

function determineRedCardReason(bookingTime: number): string {
  const reasons = [
    "Serious foul play",
    "Violent conduct",
    "Denying goal opportunity",
    "Second yellow card",
    "Offensive language",
  ]

  // Use booking time to deterministically select a reason
  const index = bookingTime % reasons.length
  return reasons[index]
}
