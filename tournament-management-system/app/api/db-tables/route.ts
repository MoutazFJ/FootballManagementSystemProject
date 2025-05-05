import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Get list of tables
    const tableListQuery = `
      SELECT 
        table_name 
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public'
      ORDER BY
        table_name
    `

    const tableList = await db.query(tableListQuery)

    // Get row counts for each table
    const tables = []

    for (const table of tableList.rows) {
      const tableName = table.table_name
      try {
        const countQuery = `SELECT COUNT(*) FROM "${tableName}"`
        const countResult = await db.query(countQuery)
        const rowCount = Number.parseInt(countResult.rows[0].count)

        tables.push({
          name: tableName,
          rowCount,
        })
      } catch (error) {
        console.error(`Error getting row count for table ${tableName}:`, error)
        tables.push({
          name: tableName,
          rowCount: 0,
          error: true,
        })
      }
    }

    return NextResponse.json({
      success: true,
      tables,
    })
  } catch (error) {
    console.error("Error fetching database tables:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch database tables",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
