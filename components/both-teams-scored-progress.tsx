import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BothTeamsScoredProgressProps {
  percentage: number
  totalMatches: number
}

export function BothTeamsScoredProgress({ percentage, totalMatches }: BothTeamsScoredProgressProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Both Teams Scored</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>{percentage.toFixed(1)}%</span>
            <span>
              {Math.round((percentage * totalMatches) / 100)} / {totalMatches} matches
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

