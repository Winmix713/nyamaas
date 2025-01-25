import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface H2HPredictionProps {
  prediction: {
    favoredTeam: string
    confidence: number
  }
  team1: string
  team2: string
}

export const H2HPrediction = memo(function H2HPrediction({ prediction, team1, team2 }: H2HPredictionProps) {
  const underdogTeam = prediction.favoredTeam === team1 ? team2 : team1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-primary">Favored Team: {prediction.favoredTeam}</p>
            <p className="text-sm text-muted-foreground">{underdogTeam} is the underdog</p>
          </div>
          <Badge variant={prediction.confidence > 70 ? "default" : "secondary"}>
            {prediction.confidence}% Confidence
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
})

