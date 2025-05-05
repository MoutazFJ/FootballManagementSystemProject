import { execSync } from "child_process"
import { existsSync, mkdirSync } from "fs"
import path from "path"

// Get migration name from command line arguments
const args = process.argv.slice(2)
const migrationName = args[0] || "migration"

// Create migrations directory if it doesn't exist
const migrationsDir = path.join(process.cwd(), "prisma/migrations")
if (!existsSync(migrationsDir)) {
  mkdirSync(migrationsDir, { recursive: true })
}

try {
  console.log(`Creating migration: ${migrationName}`)

  // Run Prisma migration
  execSync(`npx prisma migrate dev --name ${migrationName}`, { stdio: "inherit" })

  console.log("\nMigration created successfully!")
  console.log("\nTo apply this migration to your database:")
  console.log("1. Review the generated migration files in prisma/migrations")
  console.log("2. Run 'npx prisma migrate deploy' to apply the migration")
} catch (error) {
  console.error("Error creating migration:", error)
  process.exit(1)
}
