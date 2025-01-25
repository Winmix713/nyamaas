import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface H2HStatsProps {
  stats: {
    totalMatches: number
    wins: { [key: string]: number }
    draws: number
    goalsScored: { [key: string]: number }
  }
  team1: string
  team2: string
}

export const H2HStats = memo(function H2HStats({ stats, team1, team2 }: H2HStatsProps) {
  const { team1WinPercentage, team2WinPercentage, drawPercentage } = useMemo(() => {
    const totalMatches = stats.totalMatches || 1 // Prevent division by zero
    return {
      team1WinPercentage: (stats.wins[team1] / totalMatches) * 100,
      team2WinPercentage: (stats.wins[team2] / totalMatches) * 100,
      drawPercentage: (stats.draws / totalMatches) * 100,
    }
  }, [stats, team1, team2])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Win Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-primary">{team1}</span>
            <span className="font-medium text-primary">{team2}</span>
          </div>
          <Progress value={team1WinPercentage} className="h-4 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {stats.wins[team1]} wins ({team1WinPercentage.toFixed(1)}%)
            </span>
            <span>
              {stats.draws} draws ({drawPercentage.toFixed(1)}%)
            </span>
            <span>
              {stats.wins[team2]} wins ({team2WinPercentage.toFixed(1)}%)
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Goals Scored</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.goalsScored[team1]}</div>
              <div className="text-sm text-muted-foreground">{team1}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.goalsScored[team2]}</div>
              <div className="text-sm text-muted-foreground">{team2}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

