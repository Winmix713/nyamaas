import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Match {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  score: string
}

interface MatchesTableProps {
  matches: Match[]
}

export function MatchesTable({ matches }: MatchesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Home Team</TableHead>
          <TableHead>Away Team</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.id}>
            <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
            <TableCell>{match.homeTeam}</TableCell>
            <TableCell>{match.awayTeam}</TableCell>
            <TableCell>{match.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

