import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Starting database seeding...")

    // Clear existing data
    await clearDatabase()

    // Create tournaments
    const tournaments = await createTournaments()

    // Create teams
    const teams = await createTeams()

    // Create tournament-team relationships
    await createTournamentTeams(tournaments, teams)

    // Create people
    const people = await createPeople()

    // Create playing positions
    const positions = await createPlayingPositions()

    // Create players
    const players = await createPlayers(people, positions)

    // Create team-player relationships
    await createTeamPlayers(players, teams, tournaments)

    // Create venues
    const venues = await createVenues()

    // Create matches
    await createMatches(teams, venues, players)

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

async function clearDatabase() {
  // Delete in reverse order of dependencies
  await prisma.matchCaptain.deleteMany()
  await prisma.penaltyGk.deleteMany()
  await prisma.playerInOut.deleteMany()
  await prisma.playerBooked.deleteMany()
  await prisma.penaltyShootout.deleteMany()
  await prisma.goalDetails.deleteMany()
  await prisma.matchSupport.deleteMany()
  await prisma.matchDetails.deleteMany()
  await prisma.matchPlayed.deleteMany()
  await prisma.teamSupport.deleteMany()
  await prisma.teamPlayer.deleteMany()
  await prisma.player.deleteMany()
  await prisma.tournamentTeam.deleteMany()
  await prisma.team.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.person.deleteMany()
  await prisma.playingPosition.deleteMany()
  await prisma.support.deleteMany()
}

async function createTournaments() {
  const tournaments = [
    { id: 1, name: "Summer Championship 2025", startDate: new Date("2025-05-15"), endDate: new Date("2025-08-30") },
    { id: 2, name: "Spring League", startDate: new Date("2025-03-10"), endDate: new Date("2025-04-25") },
    { id: 3, name: "Winter Cup", startDate: new Date("2025-11-05"), endDate: new Date("2025-12-20") },
    { id: 4, name: "Regional Tournament", startDate: new Date("2025-06-01"), endDate: new Date("2025-07-15") },
    { id: 5, name: "Youth Championship", startDate: new Date("2025-08-10"), endDate: new Date("2025-09-25") },
  ]

  for (const tournament of tournaments) {
    await prisma.tournament.create({
      data: tournament,
    })
  }

  return tournaments
}

async function createTeams() {
  const teams = [
    { id: 1214, name: "Team Alpha" },
    { id: 1215, name: "Team Beta" },
    { id: 1216, name: "Team Gamma" },
    { id: 1217, name: "Team Delta" },
    { id: 1218, name: "Team Epsilon" },
    { id: 1219, name: "Team Zeta" },
    { id: 1220, name: "Team Eta" },
  ]

  for (const team of teams) {
    await prisma.team.create({
      data: team,
    })
  }

  return teams
}

async function createTournamentTeams(tournaments, teams) {
  const tournamentTeams = [
    {
      teamId: 1214,
      tournamentId: 1,
      group: "A",
      matchPlayed: 3,
      won: 2,
      draw: 1,
      lost: 0,
      goalFor: 7,
      goalAgainst: 3,
      goalDiff: 4,
      points: 7,
      groupPosition: 1,
    },
    {
      teamId: 1215,
      tournamentId: 1,
      group: "A",
      matchPlayed: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goalFor: 5,
      goalAgainst: 5,
      goalDiff: 0,
      points: 4,
      groupPosition: 2,
    },
    {
      teamId: 1216,
      tournamentId: 1,
      group: "B",
      matchPlayed: 3,
      won: 1,
      draw: 0,
      lost: 2,
      goalFor: 3,
      goalAgainst: 6,
      goalDiff: -3,
      points: 3,
      groupPosition: 2,
    },
    {
      teamId: 1217,
      tournamentId: 4,
      group: "A",
      matchPlayed: 3,
      won: 2,
      draw: 0,
      lost: 1,
      goalFor: 6,
      goalAgainst: 4,
      goalDiff: 2,
      points: 6,
      groupPosition: 1,
    },
    {
      teamId: 1218,
      tournamentId: 4,
      group: "B",
      matchPlayed: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goalFor: 4,
      goalAgainst: 4,
      goalDiff: 0,
      points: 4,
      groupPosition: 2,
    },
    {
      teamId: 1219,
      tournamentId: 3,
      group: "A",
      matchPlayed: 3,
      won: 2,
      draw: 0,
      lost: 1,
      goalFor: 5,
      goalAgainst: 3,
      goalDiff: 2,
      points: 6,
      groupPosition: 1,
    },
    {
      teamId: 1220,
      tournamentId: 3,
      group: "B",
      matchPlayed: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goalFor: 4,
      goalAgainst: 5,
      goalDiff: -1,
      points: 4,
      groupPosition: 2,
    },
  ]

  for (const tt of tournamentTeams) {
    await prisma.tournamentTeam.create({
      data: tt,
    })
  }
}

async function createPeople() {
  const people = [
    { id: 1001, name: "Ahmed Hassan", dateOfBirth: new Date("1999-03-10") },
    { id: 1003, name: "Mohammed Ali", dateOfBirth: new Date("2000-05-15") },
    { id: 1005, name: "Khalid Omar", dateOfBirth: new Date("1998-07-20") },
    { id: 1007, name: "Samir Nabil", dateOfBirth: new Date("2001-02-25") },
    { id: 1009, name: "Youssef Mahmoud", dateOfBirth: new Date("1997-09-30") },
    { id: 1011, name: "Tarek Samy", dateOfBirth: new Date("2002-11-05") },
    { id: 1013, name: "Amr Khaled", dateOfBirth: new Date("1996-01-10") },
    { id: 1015, name: "Hossam Fawzy", dateOfBirth: new Date("2003-04-15") },
    { id: 1017, name: "Karim Adel", dateOfBirth: new Date("1995-06-20") },
    { id: 1019, name: "Mostafa Ibrahim", dateOfBirth: new Date("2004-08-25") },
    { id: 9001, name: "Carlos Rodriguez", dateOfBirth: new Date("1980-03-10") }, // Coach
    { id: 9002, name: "Jameel Khan", dateOfBirth: new Date("1975-05-15") }, // Coach
    { id: 7001, name: "Hassan Ali", dateOfBirth: new Date("1985-07-20") }, // Assistant Coach
    { id: 7002, name: "Robert Smith", dateOfBirth: new Date("1982-02-25") }, // Assistant Coach
    { id: 3001, name: "Ahmed Farouk", dateOfBirth: new Date("1990-09-30") }, // Referee
    { id: 3002, name: "Fadhel Mahmoud", dateOfBirth: new Date("1988-11-05") }, // Referee
    { id: 3003, name: "Saied Nasser", dateOfBirth: new Date("1992-01-10") }, // Assistant Referee
  ]

  for (const person of people) {
    await prisma.person.create({
      data: person,
    })
  }

  return people
}

async function createPlayingPositions() {
  const positions = [
    { id: "GK", description: "Goalkeepers" },
    { id: "DF", description: "Defenders" },
    { id: "MF", description: "Midfielders" },
    { id: "FD", description: "Forwards" },
  ]

  for (const position of positions) {
    await prisma.playingPosition.create({
      data: position,
    })
  }

  return positions
}

async function createPlayers(people, positions) {
  const players = [
    { id: 1001, jerseyNo: 1, positionToPlay: "GK" },
    { id: 1003, jerseyNo: 2, positionToPlay: "DF" },
    { id: 1005, jerseyNo: 3, positionToPlay: "DF" },
    { id: 1007, jerseyNo: 4, positionToPlay: "MF" },
    { id: 1009, jerseyNo: 5, positionToPlay: "FD" },
    { id: 1011, jerseyNo: 6, positionToPlay: "FD" },
    { id: 1013, jerseyNo: 7, positionToPlay: "MF" },
    { id: 1015, jerseyNo: 8, positionToPlay: "DF" },
    { id: 1017, jerseyNo: 9, positionToPlay: "FD" },
    { id: 1019, jerseyNo: 10, positionToPlay: "MF" },
  ]

  for (const player of players) {
    await prisma.player.create({
      data: player,
    })
  }

  return players
}

async function createTeamPlayers(players, teams, tournaments) {
  const teamPlayers = [
    { playerId: 1001, teamId: 1214, tournamentId: 1 },
    { playerId: 1003, teamId: 1215, tournamentId: 1 },
    { playerId: 1005, teamId: 1216, tournamentId: 1 },
    { playerId: 1007, teamId: 1214, tournamentId: 1 },
    { playerId: 1009, teamId: 1215, tournamentId: 1 },
    { playerId: 1011, teamId: 1216, tournamentId: 1 },
    { playerId: 1013, teamId: 1217, tournamentId: 4 },
    { playerId: 1015, teamId: 1218, tournamentId: 4 },
    { playerId: 1017, teamId: 1219, tournamentId: 3 },
    { playerId: 1019, teamId: 1220, tournamentId: 3 },
  ]

  for (const tp of teamPlayers) {
    await prisma.teamPlayer.create({
      data: tp,
    })
  }

  // Create support types
  await prisma.support.createMany({
    data: [
      { type: "RF", description: "REFEREE" },
      { type: "AR", description: "ASST REFEREE" },
      { type: "CH", description: "COACH" },
      { type: "AC", description: "ASST COACH" },
    ],
  })

  // Create team support staff
  const teamSupport = [
    { supportId: 9001, teamId: 1214, tournamentId: 1, supportType: "CH" },
    { supportId: 9002, teamId: 1215, tournamentId: 1, supportType: "CH" },
    { supportId: 7001, teamId: 1214, tournamentId: 1, supportType: "AC" },
    { supportId: 7002, teamId: 1215, tournamentId: 1, supportType: "AC" },
  ]

  for (const ts of teamSupport) {
    await prisma.teamSupport.create({
      data: ts,
    })
  }
}

async function createVenues() {
  const venues = [
    { id: 11, name: "Central Stadium", status: "Y", capacity: 20000 },
    { id: 22, name: "East Arena", status: "Y", capacity: 10000 },
    { id: 33, name: "North Field", status: "Y", capacity: 5000 },
    { id: 44, name: "South Complex", status: "Y", capacity: 8000 },
    { id: 55, name: "West Stadium", status: "Y", capacity: 15000 },
  ]

  for (const venue of venues) {
    await prisma.venue.create({
      data: venue,
    })
  }

  return venues
}

async function createMatches(teams, venues, players) {
  const matches = [
    {
      matchNo: 1,
      playStage: "G",
      playDate: new Date("2025-05-05"),
      teamId1: 1214,
      teamId2: 1215,
      results: "WIN",
      decidedBy: "N",
      goalScore: "3-1",
      venueId: 11,
      audience: 15000,
      playerOfMatchId: 1007,
      stop1Sec: 120,
      stop2Sec: 180,
    },
    {
      matchNo: 2,
      playStage: "G",
      playDate: new Date("2025-05-06"),
      teamId1: 1216,
      teamId2: 1214,
      results: "DRAW",
      decidedBy: "N",
      goalScore: "2-2",
      venueId: 22,
      audience: 8000,
      playerOfMatchId: 1005,
      stop1Sec: 90,
      stop2Sec: 150,
    },
    {
      matchNo: 3,
      playStage: "G",
      playDate: new Date("2025-05-07"),
      teamId1: 1215,
      teamId2: 1216,
      results: "WIN",
      decidedBy: "N",
      goalScore: "2-0",
      venueId: 33,
      audience: 4000,
      playerOfMatchId: 1003,
      stop1Sec: 60,
      stop2Sec: 120,
    },
    {
      matchNo: 4,
      playStage: "F",
      playDate: new Date("2025-06-10"),
      teamId1: 1217,
      teamId2: 1218,
      results: "WIN",
      decidedBy: "N",
      goalScore: "3-2",
      venueId: 44,
      audience: 7000,
      playerOfMatchId: 1013,
      stop1Sec: 75,
      stop2Sec: 135,
    },
    {
      matchNo: 5,
      playStage: "G",
      playDate: new Date("2025-05-10"),
      teamId1: 1214,
      teamId2: 1216,
      results: "TBD",
      decidedBy: "N",
      goalScore: "0-0",
      venueId: 11,
      audience: 0,
      playerOfMatchId: 1001,
      stop1Sec: 0,
      stop2Sec: 0,
    },
  ]

  for (const match of matches) {
    await prisma.matchPlayed.create({
      data: match,
    })

    // Create match details for completed matches
    if (match.results !== "TBD") {
      const [homeGoals, awayGoals] = match.goalScore.split("-").map(Number)

      // Home team details
      await prisma.matchDetails.create({
        data: {
          matchNo: match.matchNo,
          teamId: match.teamId1,
          winLose: homeGoals > awayGoals ? "W" : homeGoals < awayGoals ? "L" : "D",
          decidedBy: match.decidedBy,
          goalScore: homeGoals,
          playerGk: 1001, // Using the first goalkeeper
        },
      })

      // Away team details
      await prisma.matchDetails.create({
        data: {
          matchNo: match.matchNo,
          teamId: match.teamId2,
          winLose: awayGoals > homeGoals ? "W" : awayGoals < homeGoals ? "L" : "D",
          decidedBy: match.decidedBy,
          goalScore: awayGoals,
          playerGk: 1001, // Using the first goalkeeper
        },
      })

      // Create goal details
      for (let i = 0; i < homeGoals; i++) {
        await prisma.goalDetails.create({
          data: {
            goalId: match.matchNo * 10 + i,
            matchNo: match.matchNo,
            playerId: [1007, 1009, 1011][i % 3], // Rotate between players
            teamId: match.teamId1,
            goalTime: 15 + i * 15,
            goalType: "N",
            playStage: match.playStage,
            goalSchedule: "NT",
            goalHalf: i < 2 ? 1 : 2,
          },
        })
      }

      for (let i = 0; i < awayGoals; i++) {
        await prisma.goalDetails.create({
          data: {
            goalId: match.matchNo * 10 + homeGoals + i,
            matchNo: match.matchNo,
            playerId: [1003, 1005, 1013][i % 3], // Rotate between players
            teamId: match.teamId2,
            goalTime: 20 + i * 15,
            goalType: "N",
            playStage: match.playStage,
            goalSchedule: "NT",
            goalHalf: i < 2 ? 1 : 2,
          },
        })
      }

      // Create match support
      await prisma.matchSupport.create({
        data: {
          matchNo: match.matchNo,
          supportId: 3001,
          supportType: "RF",
        },
      })

      await prisma.matchSupport.create({
        data: {
          matchNo: match.matchNo,
          supportId: 3003,
          supportType: "AR",
        },
      })

      // Create match captains
      await prisma.matchCaptain.create({
        data: {
          matchNo: match.matchNo,
          teamId: match.teamId1,
          playerCaptainId: 1007, // Midfielder as captain
        },
      })

      await prisma.matchCaptain.create({
        data: {
          matchNo: match.matchNo,
          teamId: match.teamId2,
          playerCaptainId: 1019, // Midfielder as captain
        },
      })

      // Create player bookings (red cards)
      if (match.matchNo === 1) {
        await prisma.playerBooked.create({
          data: {
            matchNo: match.matchNo,
            teamId: match.teamId2,
            playerId: 1003,
            bookingTime: 75,
            sentOff: "Y",
            playSchedule: "NT",
            playHalf: 2,
          },
        })
      }
    }
  }
}

main()
