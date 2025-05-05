import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Test the database connection
    const connectionStatus = await db.testConnection()

    if (!connectionStatus.connected) {
      throw new Error(connectionStatus.error || "Database connection failed")
    }

    // Get database information
    const dbInfoQuery = `
      SELECT 
        current_database() as db_name,
        current_user as db_user,
        version() as db_version
    `
    const dbInfo = await db.query(dbInfoQuery)

    // Get some basic stats
    const tournamentCount = await db.query("SELECT COUNT(*) FROM tournament")
    const teamCount = await db.query("SELECT COUNT(*) FROM team")
    const playerCount = await db.query("SELECT COUNT(*) FROM player")
    const matchCount = await db.query("SELECT COUNT(*) FROM match_played")

    const stats = {
      tournaments: Number.parseInt(tournamentCount.rows[0].count) || 0,
      teams: Number.parseInt(teamCount.rows[0].count) || 0,
      players: Number.parseInt(playerCount.rows[0].count) || 0,
      matches: Number.parseInt(matchCount.rows[0].count) || 0,
    }

    return NextResponse.json({
      status: "connected",
      timestamp: connectionStatus.timestamp,
      dbInfo: dbInfo.rows[0],
      stats,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to the database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
