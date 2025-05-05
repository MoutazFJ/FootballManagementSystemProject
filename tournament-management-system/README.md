# Tournament Management System

A comprehensive web application for managing soccer tournaments, teams, players, and matches.

## Features

- Tournament management
- Team registration and management
- Player registration and approval
- Match scheduling and results tracking
- Statistics and reporting

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL/MySQL/SQLite
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL, MySQL, or SQLite

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/tournament-management-system.git
cd tournament-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up your database connection in `.env`:
\`\`\`
DATABASE_URL="postgresql://username:password@localhost:5432/soccer_tournament?schema=public"
# or for MySQL
# DATABASE_URL="mysql://username:password@localhost:3306/soccer_tournament"
# or for SQLite
# DATABASE_URL="file:./dev.db"
\`\`\`

4. Generate Prisma client:
\`\`\`bash
npx prisma generate
\`\`\`

5. Run database migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

6. Seed the database with sample data:
\`\`\`bash
npm run db:seed
\`\`\`

7. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The database schema follows the structure provided in the SQL DDL file, with tables for:

- Tournaments
- Teams
- Players
- Matches
- Venues
- And more...

## Project Structure

\`\`\`
tournament-management-system/
├── app/                    # Next.js app directory
│   ├── actions/            # Server actions
│   ├── admin/              # Admin pages
│   ├── api/                # API routes
│   ├── guest/              # Guest pages
│   └── ...
├── components/             # React components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── lib/                    # Utility functions
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
└── scripts/                # Database scripts
    └── seed-db.ts          # Database seeding script
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

## Summary

You now have a complete solution for integrating your SQL database with your Next.js tournament management system. Here's what we've accomplished:

1. Created server actions to interact with the database
2. Updated the frontend context to use real data from the database
3. Added loading states to improve user experience
4. Created a script to seed your database with sample data
5. Added comprehensive setup instructions

To get started:

1. Set up your database connection in the `.env` file
2. Generate the Prisma client with `npx prisma generate`
3. Run the database migrations with `npx prisma migrate dev`
4. Seed your database with `npm run db:seed`
5. Start your Next.js application with `npm run dev`

Your tournament management system should now be fully functional with a real database backend!
