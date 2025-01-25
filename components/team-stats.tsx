import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useMemo } from "react"

interface TeamStatsProps {
  stats: {
    totalMatches: number
    wins: number
    draws: number
    losses: number
    goalsScored: number
    goalsConceded: number
  }
}

export function TeamStats({ stats }: TeamStatsProps) {
  const { percentages, goalDifference } = useMemo(
    () => ({
      percentages: {
        wins: (stats.wins / stats.totalMatches) * 100,
        draws: (stats.draws / stats.totalMatches) * 100,
        losses: (stats.losses / stats.totalMatches) * 100,
      },
      goalDifference: stats.goalsScored - stats.goalsConceded,
    }),
    [stats],
  )

  const StatItem = ({ label, value, percentage }: { label: string; value: number; percentage: number }) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Match Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatItem label="Wins" value={stats.wins} percentage={percentages.wins} />
          <StatItem label="Draws" value={stats.draws} percentage={percentages.draws} />
          <StatItem label="Losses" value={stats.losses} percentage={percentages.losses} />
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Goal Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.goalsScored}</div>
              <div className="text-sm text-muted-foreground">Scored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.goalsConceded}</div>
              <div className="text-sm text-muted-foreground">Conceded</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${goalDifference > 0 ? "text-green-500" : goalDifference < 0 ? "text-red-500" : ""}`}
              >
                {goalDifference > 0 ? "+" : ""}
                {goalDifference}
              </div>
              <div className="text-sm text-muted-foreground">Difference</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

