import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const team1 = searchParams.get("team1")
  const team2 = searchParams.get("team2")

  if (!team1 || !team2) {
    return NextResponse.json({ error: "Both team1 and team2 are required" }, { status: 400 })
  }

  try {
    // Get the league data from localStorage - using any active league
    const leagues = localStorage.getItem("leagues")
    if (!leagues) {
      return NextResponse.json({ error: "No league data found" }, { status: 404 })
    }

    const parsedLeagues = JSON.parse(leagues)
    let allMatches = []

    // Collect matches from all leagues
    for (const league of parsedLeagues) {
      const leagueData = localStorage.getItem(`league_${league.id}`)
      if (leagueData) {
        const { matches } = JSON.parse(leagueData)
        allMatches = [...allMatches, ...matches]
      }
    }

    // Filter matches between the two teams
    const h2hMatches = allMatches.filter(
      (match: any) =>
        (match.home_team === team1 && match.away_team === team2) ||
        (match.home_team === team2 && match.away_team === team1),
    )

    // Prepare H2H statistics
    const stats = {
      matches: h2hMatches.map((match: any) => ({
        date: match.date,
        competition: "League",
        home_team: match.home_team,
        away_team: match.away_team,
        score: `${match.home_score}-${match.away_score}`,
      })),
      overall_stats: {
        total_matches: h2hMatches.length,
        team1_wins: 0,
        team2_wins: 0,
        draws: 0,
        team1_goals: 0,
        team2_goals: 0,
      },
      season_stats: {
        matches_played: h2hMatches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        clean_sheets: 0,
        avg_goals_scored: 0,
        avg_goals_conceded: 0,
        avg_first_goal_time: 35,
        failed_to_score: 0,
        biggest_victory: "0-0",
        biggest_defeat: "0-0",
      },
      scoring_times: {
        "0-15": 0,
        "16-30": 0,
        "31-45": 0,
        "46-60": 0,
        "61-75": 0,
        "76-90": 0,
      },
    }

    // Calculate statistics
    h2hMatches.forEach((match: any) => {
      const homeScore = Number.parseInt(match.home_score)
      const awayScore = Number.parseInt(match.away_score)

      if (match.home_team === team1) {
        stats.overall_stats.team1_goals += homeScore
        stats.overall_stats.team2_goals += awayScore
        stats.season_stats.goals_for += homeScore
        stats.season_stats.goals_against += awayScore

        if (homeScore > awayScore) {
          stats.overall_stats.team1_wins++
          stats.season_stats.wins++
        } else if (homeScore < awayScore) {
          stats.overall_stats.team2_wins++
          stats.season_stats.losses++
        } else {
          stats.overall_stats.draws++
          stats.season_stats.draws++
        }
      } else {
        stats.overall_stats.team1_goals += awayScore
        stats.overall_stats.team2_goals += homeScore
        stats.season_stats.goals_for += awayScore
        stats.season_stats.goals_against += homeScore

        if (homeScore < awayScore) {
          stats.overall_stats.team1_wins++
          stats.season_stats.wins++
        } else if (homeScore > awayScore) {
          stats.overall_stats.team2_wins++
          stats.season_stats.losses++
        } else {
          stats.overall_stats.draws++
          stats.season_stats.draws++
        }
      }

      if (homeScore === 0 || awayScore === 0) {
        stats.season_stats.clean_sheets++
      }

      // Simulate scoring times distribution
      stats.scoring_times["0-15"] += Math.floor(Math.random() * 2)
      stats.scoring_times["16-30"] += Math.floor(Math.random() * 2)
      stats.scoring_times["31-45"] += Math.floor(Math.random() * 2)
      stats.scoring_times["46-60"] += Math.floor(Math.random() * 2)
      stats.scoring_times["61-75"] += Math.floor(Math.random() * 2)
      stats.scoring_times["76-90"] += Math.floor(Math.random() * 2)
    })

    // Calculate averages
    stats.season_stats.avg_goals_scored = stats.season_stats.goals_for / stats.season_stats.matches_played
    stats.season_stats.avg_goals_conceded = stats.season_stats.goals_against / stats.season_stats.matches_played

    // Find biggest victory and defeat
    h2hMatches.forEach((match: any) => {
      const homeScore = Number.parseInt(match.home_score)
      const awayScore = Number.parseInt(match.away_score)
      const scoreDiff = Math.abs(homeScore - awayScore)
      const scoreString = `${homeScore}-${awayScore}`

      if (match.home_team === team1) {
        if (homeScore > awayScore && scoreDiff > Number.parseInt(stats.season_stats.biggest_victory.split("-")[0])) {
          stats.season_stats.biggest_victory = scoreString
        } else if (
          homeScore < awayScore &&
          scoreDiff > Number.parseInt(stats.season_stats.biggest_defeat.split("-")[0])
        ) {
          stats.season_stats.biggest_defeat = scoreString
        }
      } else {
        if (awayScore > homeScore && scoreDiff > Number.parseInt(stats.season_stats.biggest_victory.split("-")[0])) {
          stats.season_stats.biggest_victory = `${awayScore}-${homeScore}`
        } else if (
          awayScore < homeScore &&
          scoreDiff > Number.parseInt(stats.season_stats.biggest_defeat.split("-")[0])
        ) {
          stats.season_stats.biggest_defeat = `${awayScore}-${homeScore}`
        }
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error processing H2H data:", error)
    return NextResponse.json({ error: "Failed to process H2H data" }, { status: 500 })
  }
}

