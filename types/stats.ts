export interface MatchResult {
  date: string
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  competition: string
}

export interface TeamStats {
  overall: {
    matches_played: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
    clean_sheets: number
    avg_goals_scored: number
    avg_goals_conceded: number
    possession: number
    pass_accuracy: number
    shots_per_game: number
  }
  form: string[]
  strengths: Array<{
    category: string
    rating: "Very Strong" | "Strong" | "Moderate"
  }>
  weaknesses: Array<{
    category: string
    rating: "Weak" | "Very Weak"
  }>
  style: string[]
  competitions: Array<{
    name: string
    matches: number
    goals: number
    shots_pg: number
    discipline: {
      yellow: number
      red: number
    }
    possession: number
    pass_accuracy: number
    aerials_won: number
    rating: number
  }>
  performanceMetrics: {
    goals_scored: number
    goals_conceded: number
    clean_sheets: number
    shots_pg: number
    bothTeamsScoredPercentage: number
    totalMatches: number
  }
}

export interface H2HStats {
  matches: Array<{
    date: string
    competition: string
    home_team: string
    away_team: string
    score: string
    details?: string
  }>
  overall_stats: {
    total_matches: number
    team1_wins: number
    team2_wins: number
    draws: number
    team1_goals: number
    team2_goals: number
  }
  season_stats: {
    matches_played: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
    clean_sheets: number
    avg_goals_scored: number
    avg_goals_conceded: number
    avg_first_goal_time: number
    failed_to_score: number
    biggest_victory: string
    biggest_defeat: string
  }
  scoring_times: {
    [key: string]: number
  }
}

