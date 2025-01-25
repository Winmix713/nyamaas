import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DetailedStatsProps {
  stats: {
    matches_played: { total: number; home: number; away: number }
    wins: { total: number; home: number; away: number }
    draws: { total: number; home: number; away: number }
    losses: { total: number; home: number; away: number }
    goals_for: { total: number; home: number; away: number }
    goals_against: { total: number; home: number; away: number }
    points: { total: number; home: number; away: number }
    clean_sheets: { total: number; home: number; away: number }
    failed_to_score: { total: number; home: number; away: number }
    biggest_victory: { total: string; home: string; away: string }
    biggest_defeat: { total: string; home: string; away: string }
    first_half_goals: { for: number; against: number }
    second_half_goals: { for: number; against: number }
  }
}

export function DetailedStats({ stats }: DetailedStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Stat</th>
                <th className="text-right py-2">Total</th>
                <th className="text-right py-2">Home</th>
                <th className="text-right py-2">Away</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2">Matches played</td>
                <td className="text-right">{stats.matches_played.total}</td>
                <td className="text-right">{stats.matches_played.home}</td>
                <td className="text-right">{stats.matches_played.away}</td>
              </tr>
              <tr>
                <td className="py-2">Wins</td>
                <td className="text-right">{stats.wins.total}</td>
                <td className="text-right">{stats.wins.home}</td>
                <td className="text-right">{stats.wins.away}</td>
              </tr>
              <tr>
                <td className="py-2">Draws</td>
                <td className="text-right">{stats.draws.total}</td>
                <td className="text-right">{stats.draws.home}</td>
                <td className="text-right">{stats.draws.away}</td>
              </tr>
              <tr>
                <td className="py-2">Losses</td>
                <td className="text-right">{stats.losses.total}</td>
                <td className="text-right">{stats.losses.home}</td>
                <td className="text-right">{stats.losses.away}</td>
              </tr>
              <tr>
                <td className="py-2">Goals for</td>
                <td className="text-right">{stats.goals_for.total}</td>
                <td className="text-right">{stats.goals_for.home}</td>
                <td className="text-right">{stats.goals_for.away}</td>
              </tr>
              <tr>
                <td className="py-2">Goals against</td>
                <td className="text-right">{stats.goals_against.total}</td>
                <td className="text-right">{stats.goals_against.home}</td>
                <td className="text-right">{stats.goals_against.away}</td>
              </tr>
              <tr>
                <td className="py-2">Points</td>
                <td className="text-right">{stats.points.total}</td>
                <td className="text-right">{stats.points.home}</td>
                <td className="text-right">{stats.points.away}</td>
              </tr>
              <tr>
                <td className="py-2">Clean sheets</td>
                <td className="text-right">{stats.clean_sheets.total}</td>
                <td className="text-right">{stats.clean_sheets.home}</td>
                <td className="text-right">{stats.clean_sheets.away}</td>
              </tr>
              <tr>
                <td className="py-2">Failed to score</td>
                <td className="text-right">{stats.failed_to_score.total}</td>
                <td className="text-right">{stats.failed_to_score.home}</td>
                <td className="text-right">{stats.failed_to_score.away}</td>
              </tr>
              <tr>
                <td className="py-2">Biggest victory</td>
                <td className="text-right">{stats.biggest_victory.total}</td>
                <td className="text-right">{stats.biggest_victory.home}</td>
                <td className="text-right">{stats.biggest_victory.away}</td>
              </tr>
              <tr>
                <td className="py-2">Biggest defeat</td>
                <td className="text-right">{stats.biggest_defeat.total}</td>
                <td className="text-right">{stats.biggest_defeat.home}</td>
                <td className="text-right">{stats.biggest_defeat.away}</td>
              </tr>
              <tr>
                <td className="py-2">1st Half Goals (For - Against)</td>
                <td className="text-right">
                  {stats.first_half_goals.for} - {stats.first_half_goals.against}
                </td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="py-2">2nd Half Goals (For - Against)</td>
                <td className="text-right">
                  {stats.second_half_goals.for} - {stats.second_half_goals.against}
                </td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

