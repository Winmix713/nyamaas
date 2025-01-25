import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface H2HOverallStatsProps {
  stats: {
    total_matches: number
    team1_wins: number
    team2_wins: number
    draws: number
    team1_goals: number
    team2_goals: number
  }
  team1: string
  team2: string
}

const StatRow = memo(function StatRow({
  label,
  value,
  percentage,
}: { label: string; value: number; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
})

export const H2HOverallStats = memo(function H2HOverallStats({ stats, team1, team2 }: H2HOverallStatsProps) {
  const { team1WinPercentage, team2WinPercentage, drawPercentage } = useMemo(() => {
    const total = stats.total_matches || 1 // Prevent division by zero
    return {
      team1WinPercentage: (stats.team1_wins / total) * 100,
      team2WinPercentage: (stats.team2_wins / total) * 100,
      drawPercentage: (stats.draws / total) * 100,
    }
  }, [stats])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Head-to-Head</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Total Matches</span>
              <span className="font-bold">{stats.total_matches}</span>
            </div>
            <div className="space-y-2">
              <StatRow label={team1} value={stats.team1_wins} percentage={team1WinPercentage} />
              <StatRow label="Draws" value={stats.draws} percentage={drawPercentage} />
              <StatRow label={team2} value={stats.team2_wins} percentage={team2WinPercentage} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-primary">Goals Scored</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.team1_goals}</div>
                <div className="text-sm text-muted-foreground">{team1}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.team2_goals}</div>
                <div className="text-sm text-muted-foreground">{team2}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

