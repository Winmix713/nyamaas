import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const calculateTeamRating = (position: number, totalTeams: number): number => {
  // Base rating between 6.0 and 8.0
  const baseRating = 7.0
  // Position impact (-1.0 to +1.0)
  const positionImpact = ((totalTeams - position) / (totalTeams - 1)) * 2 - 1
  return baseRating + positionImpact
}

const calculateCharacteristics = (matches: any[], team: string) => {
  const stats = {
    setpieces: { goals: 0, total: 0 },
    counterAttackGoals: { for: 0, against: 0 },
    possession: [] as number[],
    passStyle: { short: 0, long: 0 },
    aerialDuels: { won: 0, total: 0 },
    goals: { firstHalf: 0, secondHalf: 0 },
    attacks: { middle: 0, wings: 0 },
  }

  matches.forEach((match) => {
    const isHome = match.home_team === team
    const score = isHome ? Number(match.home_score) : Number(match.away_score)
    const htScore = isHome ? Number(match.ht_home_score) : Number(match.ht_away_score)

    // Calculate first/second half goals
    stats.goals.firstHalf += htScore
    stats.goals.secondHalf += score - htScore

    // Simulate possession and passing stats based on goals and scores
    const possessionValue = 45 + Math.random() * 20 + (score > 0 ? 5 : 0)
    stats.possession.push(possessionValue)

    if (possessionValue > 55) {
      stats.passStyle.short += 1
    } else {
      stats.passStyle.long += 1
    }

    // Simulate set piece effectiveness based on goals
    if (Math.random() > 0.7) {
      // 30% chance a goal was from set piece
      stats.setpieces.goals += 1
    }
    stats.setpieces.total += score

    // Simulate aerial duels based on team matchup
    const aerialDuelsTotal = Math.floor(Math.random() * 20) + 10
    stats.aerialDuels.total += aerialDuelsTotal
    stats.aerialDuels.won += Math.floor(aerialDuelsTotal * (Math.random() * 0.4 + 0.3))

    // Simulate attack patterns
    const attacks = score + Math.floor(Math.random() * 10)
    stats.attacks.middle += Math.floor(attacks * (Math.random() * 0.6 + 0.2))
    stats.attacks.wings += Math.floor(attacks * (Math.random() * 0.4 + 0.2))

    // Simulate counter attack effectiveness
    if (possessionValue < 45) {
      stats.counterAttackGoals.for += Math.floor(Math.random() * 2)
    } else {
      stats.counterAttackGoals.against += Math.floor(Math.random() * 2)
    }
  })

  // Calculate ratings and characteristics
  const avgPossession = stats.possession.reduce((a, b) => a + b, 0) / stats.possession.length
  const setpieceEfficiency = (stats.setpieces.goals / Math.max(stats.setpieces.total, 1)) * 100
  const aerialSuccess = (stats.aerialDuels.won / stats.aerialDuels.total) * 100
  const counterAttackRatio = stats.counterAttackGoals.for / (stats.counterAttackGoals.against || 1)
  const attackThroughMiddle = (stats.attacks.middle / (stats.attacks.middle + stats.attacks.wings)) * 100

  const characteristics = {
    strengths: [] as Array<{ category: string; rating: "Very Strong" | "Strong" | "Moderate" }>,
    weaknesses: [] as Array<{ category: string; rating: "Weak" | "Very Weak" }>,
    style: [] as string[],
  }

  // Determine strengths
  if (setpieceEfficiency > 25) {
    characteristics.strengths.push({
      category: "Attacking set pieces",
      rating: setpieceEfficiency > 35 ? "Very Strong" : "Strong",
    })
  }
  if (avgPossession > 55) {
    characteristics.strengths.push({
      category: "Ball possession",
      rating: avgPossession > 60 ? "Very Strong" : "Strong",
    })
  }
  if (stats.goals.secondHalf > stats.goals.firstHalf * 1.5) {
    characteristics.strengths.push({
      category: "Second half performance",
      rating: "Strong",
    })
  }

  // Determine weaknesses
  if (aerialSuccess < 45) {
    characteristics.weaknesses.push({
      category: "Aerial duels",
      rating: aerialSuccess < 35 ? "Very Weak" : "Weak",
    })
  }
  if (counterAttackRatio < 0.8) {
    characteristics.weaknesses.push({
      category: "Defending counter attacks",
      rating: counterAttackRatio < 0.5 ? "Very Weak" : "Weak",
    })
  }

  // Determine style of play
  if (avgPossession > 52) characteristics.style.push("Possession based")
  if (stats.passStyle.short > stats.passStyle.long) characteristics.style.push("Short passes")
  if (stats.passStyle.long > stats.passStyle.short) characteristics.style.push("Direct play")
  if (attackThroughMiddle > 60) characteristics.style.push("Attack through middle")
  if (attackThroughMiddle < 40) characteristics.style.push("Wing play")
  if (counterAttackRatio > 1.2) characteristics.style.push("Counter attacking")

  return characteristics
}

const calculateDetailedCharacteristics = (matches: any[], team: string) => {
  const stats = {
    home: {
      firstHalf: { goalsFor: 0, goalsAgainst: 0, matches: 0 },
      secondHalf: { goalsFor: 0, goalsAgainst: 0, matches: 0 },
      comebacks: 0,
      lostLeads: 0,
    },
    away: {
      firstHalf: { goalsFor: 0, goalsAgainst: 0, matches: 0 },
      secondHalf: { goalsFor: 0, goalsAgainst: 0, matches: 0 },
      comebacks: 0,
      lostLeads: 0,
    },
    overall: {
      cleanSheets: 0,
      earlyGoals: 0, // Goals in first 15 mins (simulated)
      possession: [] as number[],
      counterAttacks: { successful: 0, conceded: 0 },
    },
  }

  matches.forEach((match) => {
    const isHome = match.home_team === team
    const location = isHome ? "home" : "away"

    const htGoalsFor = isHome ? Number(match.ht_home_score) : Number(match.ht_away_score)
    const htGoalsAgainst = isHome ? Number(match.ht_away_score) : Number(match.ht_home_score)
    const finalGoalsFor = isHome ? Number(match.home_score) : Number(match.away_score)
    const finalGoalsAgainst = isHome ? Number(match.away_score) : Number(match.home_score)

    // Update first half stats
    stats[location].firstHalf.goalsFor += htGoalsFor
    stats[location].firstHalf.goalsAgainst += htGoalsAgainst
    stats[location].firstHalf.matches++

    // Update second half stats
    stats[location].secondHalf.goalsFor += finalGoalsFor - htGoalsFor
    stats[location].secondHalf.goalsAgainst += finalGoalsAgainst - htGoalsAgainst
    stats[location].secondHalf.matches++

    // Track comebacks and lost leads
    if (htGoalsFor < htGoalsAgainst && finalGoalsFor > finalGoalsAgainst) {
      stats[location].comebacks++
    }
    if (htGoalsFor > htGoalsAgainst && finalGoalsFor < finalGoalsAgainst) {
      stats[location].lostLeads++
    }

    // Overall stats
    if (finalGoalsAgainst === 0) {
      stats.overall.cleanSheets++
    }

    // Simulate early goals (30% chance if team scored in first half)
    if (htGoalsFor > 0 && Math.random() > 0.7) {
      stats.overall.earlyGoals++
    }

    // Simulate possession based on goals and home/away
    const basePossession = isHome ? 55 : 45
    const possessionModifier = (finalGoalsFor - finalGoalsAgainst) * 2
    stats.overall.possession.push(Math.min(Math.max(basePossession + possessionModifier, 30), 70))

    // Simulate counter attacks
    if (finalGoalsFor > htGoalsFor) {
      stats.overall.counterAttacks.successful += Math.floor(Math.random() * 2)
    }
    if (finalGoalsAgainst > htGoalsAgainst) {
      stats.overall.counterAttacks.conceded += Math.floor(Math.random() * 2)
    }
  })

  // Calculate ratings and characteristics
  const characteristics = {
    strengths: [] as Array<{ category: string; rating: "Very Strong" | "Strong" | "Moderate" }>,
    weaknesses: [] as Array<{ category: string; rating: "Weak" | "Very Weak" }>,
    style: [] as string[],
    mental: [] as Array<{ aspect: string; rating: "Strong" | "Moderate" | "Inconsistent" }>,
  }

  // Analyze home performance
  const homeFirstHalfGoalsPerGame = stats.home.firstHalf.goalsFor / (stats.home.firstHalf.matches || 1)
  if (homeFirstHalfGoalsPerGame > 1.5) {
    characteristics.strengths.push({
      category: "First Half Performance (Home)",
      rating: homeFirstHalfGoalsPerGame > 2 ? "Very Strong" : "Strong",
    })
  }

  // Analyze away performance
  const awayGoalsPerGame =
    (stats.away.firstHalf.goalsFor + stats.away.secondHalf.goalsFor) / (stats.away.firstHalf.matches || 1)
  if (awayGoalsPerGame < 1) {
    characteristics.weaknesses.push({
      category: "Away Scoring",
      rating: awayGoalsPerGame < 0.5 ? "Very Weak" : "Weak",
    })
  }

  // Analyze clean sheets
  const cleanSheetRatio = stats.overall.cleanSheets / matches.length
  if (cleanSheetRatio > 0.3) {
    characteristics.strengths.push({
      category: "Defensive Stability",
      rating: cleanSheetRatio > 0.4 ? "Very Strong" : "Strong",
    })
  }

  // Analyze counter attacks
  const counterAttackRatio = stats.overall.counterAttacks.successful / (stats.overall.counterAttacks.conceded || 1)
  if (counterAttackRatio < 1) {
    characteristics.weaknesses.push({
      category: "Counter Attack Defense",
      rating: counterAttackRatio < 0.5 ? "Very Weak" : "Weak",
    })
  }

  // Analyze possession
  const avgPossession = stats.overall.possession.reduce((a, b) => a + b, 0) / stats.overall.possession.length
  if (avgPossession > 52) {
    characteristics.style.push("Possession based")
    if (avgPossession > 55) {
      characteristics.strengths.push({
        category: "Ball Control",
        rating: avgPossession > 60 ? "Very Strong" : "Strong",
      })
    }
  } else {
    characteristics.style.push("Counter-attacking")
  }

  // Analyze mental characteristics
  const totalComebacks = stats.home.comebacks + stats.away.comebacks
  const totalLostLeads = stats.home.lostLeads + stats.away.lostLeads

  characteristics.mental.push({
    aspect: "Taking Initiative",
    rating: stats.overall.earlyGoals > matches.length * 0.3 ? "Strong" : "Moderate",
  })

  characteristics.mental.push({
    aspect: "Comeback Ability",
    rating: totalComebacks > totalLostLeads ? "Strong" : "Inconsistent",
  })

  characteristics.mental.push({
    aspect: "Pressure Handling",
    rating: totalLostLeads === 0 ? "Strong" : totalLostLeads > 2 ? "Inconsistent" : "Moderate",
  })

  // Add tactical indicators based on patterns
  if (stats.home.firstHalf.goalsFor > stats.home.secondHalf.goalsFor) {
    characteristics.style.push("Fast Starting")
  } else {
    characteristics.style.push("Strong Finishing")
  }

  if (stats.overall.cleanSheets > matches.length * 0.3) {
    characteristics.style.push("Defensive Solidity")
  }

  return characteristics
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const team = searchParams.get("team")

  if (!team) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 })
  }

  try {
    const leagues = localStorage.getItem("leagues")
    if (!leagues) {
      return NextResponse.json({ error: "No league data found" }, { status: 404 })
    }

    const parsedLeagues = JSON.parse(leagues)
    const competitionStats = []

    // Process each league
    for (const league of parsedLeagues) {
      const leagueData = localStorage.getItem(`league_${league.id}`)
      if (leagueData) {
        const { standings, matches } = JSON.parse(leagueData)
        if (standings) {
          // Find team's position in this league
          const teamStanding = standings.find((s: any) => s.team === team)
          if (teamStanding) {
            const totalTeams = standings.length
            const rating = calculateTeamRating(teamStanding.position, totalTeams)

            competitionStats.push({
              leagueId: league.id,
              position: teamStanding.position,
              matches: teamStanding.played,
              goals: teamStanding.goalsFor,
              points: teamStanding.points,
              rating: rating,
            })
          }
        }
      }
    }

    let allMatches = []

    // Collect matches from all leagues
    const leagues2 = JSON.parse(localStorage.getItem("leagues") || "[]")
    for (const league of leagues2) {
      const leagueData = localStorage.getItem(`league_${league.id}`)
      if (leagueData) {
        const { matches } = JSON.parse(leagueData)
        allMatches = [...allMatches, ...matches]
      }
    }

    // Filter matches for the selected team
    const teamMatches = allMatches.filter((match: any) => match.home_team === team || match.away_team === team)

    // Calculate characteristics based on matches
    const detailedCharacteristics = calculateDetailedCharacteristics(teamMatches, team)

    // Initialize stats object
    const stats = {
      overview: {
        matches_played: teamMatches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
      },
      form: [] as string[],
      performanceMetrics: {
        goals_scored: 0,
        goals_conceded: 0,
        clean_sheets: 0,
        shots_pg: 12.5, // Example static value
      },
      characteristics: detailedCharacteristics,
      competitions: [],
      detailedStats: {
        matches_played: { total: teamMatches.length, home: 0, away: 0 },
        wins: { total: 0, home: 0, away: 0 },
        draws: { total: 0, home: 0, away: 0 },
        losses: { total: 0, home: 0, away: 0 },
        goals_for: { total: 0, home: 0, away: 0 },
        goals_against: { total: 0, home: 0, away: 0 },
        points: { total: 0, home: 0, away: 0 },
        clean_sheets: { total: 0, home: 0, away: 0 },
        failed_to_score: { total: 0, home: 0, away: 0 },
        biggest_victory: { total: "0-0", home: "0-0", away: "0-0" },
        biggest_defeat: { total: "0-0", home: "0-0", away: "0-0" },
        first_half_goals: { for: 0, against: 0 },
        second_half_goals: { for: 0, against: 0 },
      },
    }

    // Calculate statistics
    teamMatches.forEach((match: any) => {
      const isHome = match.home_team === team
      const goalsFor = isHome ? Number(match.home_score) : Number(match.away_score)
      const goalsAgainst = isHome ? Number(match.away_score) : Number(match.home_score)
      const htGoalsFor = isHome ? Number(match.ht_home_score) : Number(match.ht_away_score)
      const htGoalsAgainst = isHome ? Number(match.ht_away_score) : Number(match.ht_home_score)

      // Update overview stats
      stats.overview.goals_for += goalsFor
      stats.overview.goals_against += goalsAgainst

      // Update performance metrics
      stats.performanceMetrics.goals_scored += goalsFor
      stats.performanceMetrics.goals_conceded += goalsAgainst
      if (goalsAgainst === 0) stats.performanceMetrics.clean_sheets++

      // Update detailed stats
      if (isHome) {
        stats.detailedStats.matches_played.home++
        stats.detailedStats.goals_for.home += goalsFor
        stats.detailedStats.goals_against.home += goalsAgainst
      } else {
        stats.detailedStats.matches_played.away++
        stats.detailedStats.goals_for.away += goalsFor
        stats.detailedStats.goals_against.away += goalsAgainst
      }

      stats.detailedStats.goals_for.total += goalsFor
      stats.detailedStats.goals_against.total += goalsAgainst

      // Update first and second half goals
      stats.detailedStats.first_half_goals.for += htGoalsFor
      stats.detailedStats.first_half_goals.against += htGoalsAgainst
      stats.detailedStats.second_half_goals.for += goalsFor - htGoalsFor
      stats.detailedStats.second_half_goals.against += goalsAgainst - htGoalsAgainst

      if (goalsFor > goalsAgainst) {
        stats.overview.wins++
        stats.detailedStats.wins.total++
        isHome ? stats.detailedStats.wins.home++ : stats.detailedStats.wins.away++
        stats.form.push("W")
        stats.detailedStats.points.total += 3
        isHome ? (stats.detailedStats.points.home += 3) : (stats.detailedStats.points.away += 3)
      } else if (goalsFor < goalsAgainst) {
        stats.overview.losses++
        stats.detailedStats.losses.total++
        isHome ? stats.detailedStats.losses.home++ : stats.detailedStats.losses.away++
        stats.form.push("L")
      } else {
        stats.overview.draws++
        stats.detailedStats.draws.total++
        isHome ? stats.detailedStats.draws.home++ : stats.detailedStats.draws.away++
        stats.form.push("D")
        stats.detailedStats.points.total += 1
        isHome ? (stats.detailedStats.points.home += 1) : (stats.detailedStats.points.away += 1)
      }

      if (goalsAgainst === 0) {
        stats.detailedStats.clean_sheets.total++
        isHome ? stats.detailedStats.clean_sheets.home++ : stats.detailedStats.clean_sheets.away++
      }

      if (goalsFor === 0) {
        stats.detailedStats.failed_to_score.total++
        isHome ? stats.detailedStats.failed_to_score.home++ : stats.detailedStats.failed_to_score.away++
      }

      // Update biggest victory and defeat
      const scoreDiff = goalsFor - goalsAgainst
      const scoreString = `${goalsFor}-${goalsAgainst}`
      if (scoreDiff > 0) {
        if (
          scoreDiff >
          Number(stats.detailedStats.biggest_victory.total.split("-")[0]) -
            Number(stats.detailedStats.biggest_victory.total.split("-")[1])
        ) {
          stats.detailedStats.biggest_victory.total = scoreString
        }
        if (
          isHome &&
          scoreDiff >
            Number(stats.detailedStats.biggest_victory.home.split("-")[0]) -
              Number(stats.detailedStats.biggest_victory.home.split("-")[1])
        ) {
          stats.detailedStats.biggest_victory.home = scoreString
        }
        if (
          !isHome &&
          scoreDiff >
            Number(stats.detailedStats.biggest_victory.away.split("-")[0]) -
              Number(stats.detailedStats.biggest_victory.away.split("-")[1])
        ) {
          stats.detailedStats.biggest_victory.away = scoreString
        }
      } else if (scoreDiff < 0) {
        if (
          Math.abs(scoreDiff) >
          Number(stats.detailedStats.biggest_defeat.total.split("-")[1]) -
            Number(stats.detailedStats.biggest_defeat.total.split("-")[0])
        ) {
          stats.detailedStats.biggest_defeat.total = scoreString
        }
        if (
          isHome &&
          Math.abs(scoreDiff) >
            Number(stats.detailedStats.biggest_defeat.home.split("-")[1]) -
              Number(stats.detailedStats.biggest_defeat.home.split("-")[0])
        ) {
          stats.detailedStats.biggest_defeat.home = scoreString
        }
        if (
          !isHome &&
          Math.abs(scoreDiff) >
            Number(stats.detailedStats.biggest_defeat.away.split("-")[1]) -
              Number(stats.detailedStats.biggest_defeat.away.split("-")[0])
        ) {
          stats.detailedStats.biggest_defeat.away = scoreString
        }
      }
    })

    // Keep only last 5 form results
    stats.form = stats.form.slice(-5)

    // Calculate Both Teams Scored percentage
    const bothTeamsScoredMatches = teamMatches.filter((match) => {
      const homeScore = Number(match.home_score)
      const awayScore = Number(match.away_score)
      return homeScore > 0 && awayScore > 0
    }).length
    const bothTeamsScoredPercentage = (bothTeamsScoredMatches / teamMatches.length) * 100

    // Add the new metric to the stats object
    stats.performanceMetrics.bothTeamsScoredPercentage = bothTeamsScoredPercentage
    stats.performanceMetrics.totalMatches = teamMatches.length

    // Add competition stats to the response
    stats.competitions = competitionStats

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error processing team data:", error)
    return NextResponse.json({ error: "Failed to process team data" }, { status: 500 })
  }
}

