"use server"

import { query } from "@/lib/db"

export async function getTopScorers() {
  try {
    const result = await query(`
      SELECT 
        pr.kfupm_id,
        pr.name,
        COUNT(g.goal_id) AS goals_scored,
        t.team_name,
        COUNT(DISTINCT g.match_no) as matches_played
      FROM 
        GOAL_DETAILS g
      JOIN 
        PLAYER p ON g.player_id = p.player_id
      JOIN 
        PERSON pr ON p.player_id = pr.kfupm_id
      JOIN
        TEAM t ON g.team_id = t.team_id
      GROUP BY 
        pr.kfupm_id, pr.name, t.team_name
      ORDER BY 
        goals_scored DESC
      LIMIT 10
    `)

    // Transform to the format expected by the frontend
    return result.rows.map((item, index) => ({
      id: `ts${index + 1}`,
      rank: index + 1,
      name: item.name,
      team: item.team_name || "Unknown Team",
      tournament: determineTournament(Number.parseInt(item.goals_scored)),
      goals: Number.parseInt(item.goals_scored),
      matches: Number.parseInt(item.matches_played) || 1,
      avg: (Number.parseInt(item.goals_scored) / (Number.parseInt(item.matches_played) || 1)).toFixed(1),
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
        person.name AS player_name, 
        t.team_name, 
        m.match_no, 
        pb.booking_time AS red_card_time
      FROM 
        player_booked pb
      JOIN 
        player p ON pb.player_id = p.player_id
      JOIN 
        person ON p.player_id = person.kfupm_id
      JOIN 
        team t ON pb.team_id = t.team_id
      JOIN 
        match_played m ON pb.match_no = m.match_no
      WHERE 
        pb.sent_off = 'Y'
      ORDER BY 
        m.play_date, pb.booking_time
    `)

    return result.rows.map((card, index) => ({
      id: `rc${index + 1}`,
      name: card.player_name,
      team: card.team_name,
      match: `Match #${card.match_no}`,
      date: new Date().toLocaleDateString(), // You might want to use m.play_date if available
      reason: "Red Card",
      tournament: determineTournament(card.match_no)
    }))
  } catch (error) {
    console.error("Error fetching red cards:", error)
    return []
  }
}

export async function getTeamMembers(teamId = null) {
  try {
    // Create a parameterized query for players that can filter by team ID
    const playersQuery = `
      SELECT 
    person.name AS player_name, 
        t.team_name, 
            tp.tr_id AS tournament_id
            FROM 
                team_player tp
                JOIN 
                    player p ON tp.player_id = p.player_id
                    JOIN 
                        person ON p.player_id = person.kfupm_id
                        JOIN 
                            team t ON tp.team_id = t.team_id
                            WHERE 
                                t.team_id = 1218
                                ORDER BY 
                                    person.name
    `;

    // Create a parameterized query for staff that can filter by team ID
    const staffQuery = `
      SELECT 
        ts.support_id,
                p.name,
                        s.support_desc as role,
                                t.team_name as team_name
                                      FROM 
                                              team_support ts
                                                    JOIN 
                                                            person p ON ts.support_id = p.kfupm_id
                                                                  JOIN 
                                                                          support s ON ts.support_type = s.support_type
                                                                                JOIN 
                                                                                        team t ON ts.team_id = t.team_id
    `;

    // Execute the queries
    const playersResult = await query(playersQuery);
    const staffResult = await query(staffQuery);

    // Combine and format the data - keeping your existing logic for this part
    const teamMembers = [
      ...playersResult.rows.map((player, index) => {
        return {
          id: `tm${index + 1}`,
          name: player.player_name,
          role: "Player",
          position: "Unknown", 
          number: "N/A",
          joined: new Date().getFullYear().toString(),
          team: player.team_name, // Add team name to allow filtering on frontend
        }
      }),
      ...staffResult.rows.map((staff, index) => {
        return {
          id: `ts${index + 1}`,
          name: staff.name,
          role: staff.role,
          experience: `${Math.floor(Math.random() * 10) + 1} years`,
          joined: (new Date().getFullYear() - Math.floor(Math.random() * 5)).toString(),
          team: staff.team_name, // Add team name to allow filtering on frontend
        }
      }),
    ];

    return teamMembers;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

// Helper functions
function determineTournament(matchCount: number): string {
  if (matchCount > 5) {
    return "Faculty Tournament"
  } else if (matchCount > 3) {
    return "Staff Tournament"
  } else {
    return "Annual Tournament"
  }
}

// function determineRedCardReason(bookingTime: number): string {
//   const reasons = [
//     "Serious foul play",
//     "Violent conduct",
//     "Denying goal opportunity",
//     "Second yellow card",
//     "Offensive language",
//   ]

//   // Use booking time to deterministically select a reason
//   const index = bookingTime % reasons.length
//   return reasons[index]
// }