import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Execute the seed script
    const { stdout, stderr } = await execAsync("npm run db:seed")

    if (stderr && !stderr.includes("ExperimentalWarning")) {
      console.error("Error seeding database:", stderr)
      return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
