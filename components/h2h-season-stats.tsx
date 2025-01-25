import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface H2HSeasonStatsProps {
  stats: {
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
}

const StatItem = memo(function StatItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
})

export const H2HSeasonStats = memo(function H2HSeasonStats({ stats }: H2HSeasonStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-primary">Match Statistics</h3>
            <div className="space-y-2">
              <StatItem label="Matches Played" value={stats.matches_played} />
              <StatItem label="Clean Sheets" value={stats.clean_sheets} />
              <StatItem label="Failed to Score" value={stats.failed_to_score} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-primary">Goal Statistics</h3>
            <div className="space-y-2">
              <StatItem label="Avg. Goals Scored" value={stats.avg_goals_scored.toFixed(2)} />
              <StatItem label="Avg. Goals Conceded" value={stats.avg_goals_conceded.toFixed(2)} />
              <StatItem label="Avg. First Goal Time" value={`${stats.avg_first_goal_time}'`} />
            </div>
          </div>

          <div className="col-span-2 space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Biggest Victory</span>
              <Badge variant="default">{stats.biggest_victory}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Biggest Defeat</span>
              <Badge variant="destructive">{stats.biggest_defeat}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

