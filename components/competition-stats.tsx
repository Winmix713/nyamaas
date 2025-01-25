import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface CompetitionStatsProps {
  stats: {
    leagueId: string
    position: number
    matches: number
    goals: number
    points: number
    rating: number
  }[]
}

export function CompetitionStats({ stats }: CompetitionStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>League</TableHead>
              <TableHead className="text-right">Position</TableHead>
              <TableHead className="text-right">Matches</TableHead>
              <TableHead className="text-right">Goals</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((league, index) => (
              <TableRow key={league.leagueId}>
                <TableCell>League {league.leagueId}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={league.position <= 3 ? "default" : "secondary"}>{league.position}</Badge>
                </TableCell>
                <TableCell className="text-right">{league.matches}</TableCell>
                <TableCell className="text-right">{league.goals}</TableCell>
                <TableCell className="text-right">{league.points}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={league.rating >= 7 ? "default" : "secondary"}>{league.rating.toFixed(1)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

