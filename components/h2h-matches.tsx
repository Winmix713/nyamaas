import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface H2HMatchesProps {
  matches: Array<{
    date: string
    competition: string
    home_team: string
    away_team: string
    score: string
    details?: string
  }>
}

export const H2HMatches = memo(function H2HMatches({ matches }: H2HMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Home Team</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{match.competition}</Badge>
                </TableCell>
                <TableCell>{match.home_team}</TableCell>
                <TableCell className="font-bold">{match.score}</TableCell>
                <TableCell>{match.away_team}</TableCell>
                <TableCell>{match.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

