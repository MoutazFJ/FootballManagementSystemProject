import { Pool } from "pg"

// Create a connection pool to your Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon connections
  },
})

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Test the database connection
export async function testConnection() {
  try {
    const result = await query("SELECT NOW()")
    return { connected: true, timestamp: result.rows[0].now }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { connected: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export default { query, testConnection }
