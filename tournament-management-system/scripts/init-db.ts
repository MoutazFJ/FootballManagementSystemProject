import { query } from "../lib/db"

async function initializeDatabase() {
  console.log("Starting database initialization...")

  try {
    // Create tables if they don't exist

    // 1. Create support types table
    await query(`
      CREATE TABLE IF NOT EXISTS support (
        type VARCHAR(2) PRIMARY KEY,
        description VARCHAR(100) NOT NULL
      )
    `)
    console.log("Support table created or already exists")

    // 2. Create playing position table
    await query(`
      CREATE TABLE IF NOT EXISTS playingPosition (
        id VARCHAR(2) PRIMARY KEY,
        description VARCHAR(50) NOT NULL
      )
    `)
    console.log("PlayingPosition table created or already exists")

    // 3. Create venue table
    await query(`
      CREATE TABLE IF NOT EXISTS venue (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        status CHAR(1) NOT NULL,
        capacity INTEGER NOT NULL
      )
    `)
    console.log("Venue table created or already exists")

    // 4. Create person table
    await query(`
      CREATE TABLE IF NOT EXISTS person (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE
      )
    `)
    console.log("Person table created or already exists")

    // 5. Create tournament table
    await query(`
      CREATE TABLE IF NOT EXISTS tournament (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL
      )
    `)
    console.log("Tournament table created or already exists")

    // 6. Create team table
    await query(`
      CREATE TABLE IF NOT EXISTS team (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `)
    console.log("Team table created or already exists")

    // 7. Create player table
    await query(`
      CREATE TABLE IF NOT EXISTS player (
        id INTEGER PRIMARY KEY,
        jerseyNo INTEGER NOT NULL,
        positionToPlay VARCHAR(2) REFERENCES playingPosition(id),
        FOREIGN KEY (id) REFERENCES person(id)
      )
    `)
    console.log("Player table created or already exists")

    // 8. Create tournamentTeam table
    await query(`
      CREATE TABLE IF NOT EXISTS tournamentTeam (
        teamId INTEGER REFERENCES team(id),
        tournamentId INTEGER REFERENCES tournament(id),
        group CHAR(1) NOT NULL,
        matchPlayed INTEGER NOT NULL,
        won INTEGER NOT NULL,
        draw INTEGER NOT NULL,
        lost INTEGER NOT NULL,
        goalFor INTEGER NOT NULL,
        goalAgainst INTEGER NOT NULL,
        goalDiff INTEGER NOT NULL,
        points INTEGER NOT NULL,
        groupPosition INTEGER NOT NULL,
        PRIMARY KEY (teamId, tournamentId)
      )
    `)
    console.log("TournamentTeam table created or already exists")

    // 9. Create teamPlayer table
    await query(`
      CREATE TABLE IF NOT EXISTS teamPlayer (
        playerId INTEGER REFERENCES player(id),
        teamId INTEGER REFERENCES team(id),
        tournamentId INTEGER REFERENCES tournament(id),
        PRIMARY KEY (playerId, teamId, tournamentId)
      )
    `)
    console.log("TeamPlayer table created or already exists")

    // 10. Create teamSupport table
    await query(`
      CREATE TABLE IF NOT EXISTS teamSupport (
        supportId INTEGER REFERENCES person(id),
        teamId INTEGER REFERENCES team(id),
        tournamentId INTEGER REFERENCES tournament(id),
        supportType VARCHAR(2) REFERENCES support(type),
        PRIMARY KEY (supportId, teamId, tournamentId)
      )
    `)
    console.log("TeamSupport table created or already exists")

    // 11. Create matchPlayed table
    await query(`
      CREATE TABLE IF NOT EXISTS matchPlayed (
        matchNo INTEGER PRIMARY KEY,
        playStage CHAR(1) NOT NULL,
        playDate DATE NOT NULL,
        teamId1 INTEGER REFERENCES team(id),
        teamId2 INTEGER REFERENCES team(id),
        results VARCHAR(10),
        decidedBy CHAR(1) NOT NULL,
        goalScore VARCHAR(10),
        venueId INTEGER REFERENCES venue(id),
        audience INTEGER,
        playerOfMatchId INTEGER REFERENCES player(id),
        stop1Sec INTEGER,
        stop2Sec INTEGER
      )
    `)
    console.log("MatchPlayed table created or already exists")

    // 12. Create matchDetails table
    await query(`
      CREATE TABLE IF NOT EXISTS matchDetails (
        matchNo INTEGER REFERENCES matchPlayed(matchNo),
        teamId INTEGER REFERENCES team(id),
        winLose CHAR(1) NOT NULL,
        decidedBy CHAR(1) NOT NULL,
        goalScore INTEGER NOT NULL,
        playerGk INTEGER REFERENCES player(id),
        PRIMARY KEY (matchNo, teamId)
      )
    `)
    console.log("MatchDetails table created or already exists")

    // 13. Create goalDetails table
    await query(`
      CREATE TABLE IF NOT EXISTS goalDetails (
        goalId INTEGER PRIMARY KEY,
        matchNo INTEGER REFERENCES matchPlayed(matchNo),
        playerId INTEGER REFERENCES player(id),
        teamId INTEGER REFERENCES team(id),
        goalTime INTEGER NOT NULL,
        goalType CHAR(1) NOT NULL,
        playStage CHAR(1) NOT NULL,
        goalSchedule CHAR(2) NOT NULL,
        goalHalf INTEGER NOT NULL
      )
    `)
    console.log("GoalDetails table created or already exists")

    // 14. Create matchSupport table
    await query(`
      CREATE TABLE IF NOT EXISTS matchSupport (
        matchNo INTEGER REFERENCES matchPlayed(matchNo),
        supportId INTEGER REFERENCES person(id),
        supportType VARCHAR(2) REFERENCES support(type),
        PRIMARY KEY (matchNo, supportId, supportType)
      )
    `)
    console.log("MatchSupport table created or already exists")

    // 15. Create matchCaptain table
    await query(`
      CREATE TABLE IF NOT EXISTS matchCaptain (
        matchNo INTEGER REFERENCES matchPlayed(matchNo),
        teamId INTEGER REFERENCES team(id),
        playerCaptainId INTEGER REFERENCES player(id),
        PRIMARY KEY (matchNo, teamId)
      )
    `)
    console.log("MatchCaptain table created or already exists")

    // 16. Create playerBooked table
    await query(`
      CREATE TABLE IF NOT EXISTS playerBooked (
        matchNo INTEGER REFERENCES matchPlayed(matchNo),
        teamId INTEGER REFERENCES team(id),
        playerId INTEGER REFERENCES player(id),
        bookingTime INTEGER NOT NULL,
        sentOff CHAR(1) NOT NULL,
        playSchedule CHAR(2) NOT NULL,
        playHalf INTEGER NOT NULL,
        PRIMARY KEY (matchNo, teamId, playerId)
      )
    `)
    console.log("PlayerBooked table created or already exists")

    // Insert some sample data
    await query(`
      INSERT INTO tournament (id, name, startDate, endDate)
      VALUES 
        (1, 'Summer Championship 2025', '2025-05-15', '2025-08-30'),
        (2, 'Spring League', '2025-03-10', '2025-04-25')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log("Sample tournaments added")

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    process.exit(0)
  }
}

initializeDatabase()
