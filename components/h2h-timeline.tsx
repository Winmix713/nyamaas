import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Match {
  date: string
  homeTeam: string
  awayTeam: string
  score: string
}

interface H2HTimelineProps {
  matches: Match[]
}

export const H2HTimeline = memo(function H2HTimeline({ matches }: H2HTimelineProps) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {new Date(match.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
              <span className="font-semibold text-primary">{match.homeTeam}</span>
              <span className="text-2xl font-bold">{match.score}</span>
              <span className="font-semibold text-primary">{match.awayTeam}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

