# Database Setup Guide

This guide will help you set up the database for the Tournament Management System.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL, MySQL, or SQLite installed
- Basic knowledge of SQL and database management

## Step 1: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit the `.env` file and update the `DATABASE_URL` with your database connection string:
   - For PostgreSQL: `postgresql://username:password@localhost:5432/soccer_tournament?schema=public`
   - For MySQL: `mysql://username:password@localhost:3306/soccer_tournament`
   - For SQLite: `file:./dev.db`

## Step 2: Create the Database

### PostgreSQL

\`\`\`bash
psql -U postgres
CREATE DATABASE soccer_tournament;
\q
\`\`\`

### MySQL

\`\`\`bash
mysql -u root -p
CREATE DATABASE soccer_tournament;
EXIT;
\`\`\`

### SQLite

No action needed. The database file will be created automatically.

## Step 3: Run Database Migrations

\`\`\`bash
npm run prisma:migrate
\`\`\`

This command will create all the necessary tables in your database based on the Prisma schema.

## Step 4: Seed the Database with Sample Data

\`\`\`bash
npm run db:seed
\`\`\`

This command will populate your database with sample data for testing.

## Step 5: Verify the Database Connection

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Then visit `http://localhost:3000/api/db-status` to check if the database connection is working properly.

## Troubleshooting

### Connection Issues

- Make sure your database server is running
- Verify that the username and password in the connection string are correct
- Check if the database exists
- Ensure that the user has the necessary permissions

### Migration Issues

If you encounter issues with migrations:

\`\`\`bash
# Reset the database (caution: this will delete all data)
npx prisma migrate reset

# Generate a new migration
npx prisma migrate dev --name init
\`\`\`

### Prisma Studio

You can use Prisma Studio to view and edit your database:

\`\`\`bash
npm run prisma:studio
\`\`\`

This will open a web interface at `http://localhost:5555` where you can browse and modify your data.
\`\`\`

## Step 4: Update the Admin Dashboard to Show Real Data
