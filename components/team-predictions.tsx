import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

interface TeamPredictionsProps {
  predictions: {
    nextMatch: {
      opponent: string
      prediction: string
      confidence: number
    }
    seasonEnd: {
      position: number
      confidence: number
    }
  }
}

export function TeamPredictions({ predictions }: TeamPredictionsProps) {
  const seasonEndStatus = useMemo(() => {
    const position = predictions.seasonEnd.position
    if (position <= 4) return { text: "Champions League", color: "text-blue-500" }
    if (position <= 6) return { text: "Europa League", color: "text-orange-500" }
    if (position >= 18) return { text: "Relegation Zone", color: "text-red-500" }
    return { text: "Mid-table", color: "text-gray-500" }
  }, [predictions.seasonEnd.position])

  const ConfidenceBadge = ({ confidence }: { confidence: number }) => (
    <Badge
      variant={confidence > 70 ? "default" : "secondary"}
      className={confidence > 70 ? "bg-primary text-primary-foreground" : ""}
    >
      {confidence}% Confidence
    </Badge>
  )

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Next Match Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">vs {predictions.nextMatch.opponent}</p>
              <p className="text-sm text-muted-foreground">Predicted outcome: {predictions.nextMatch.prediction}</p>
            </div>
            <ConfidenceBadge confidence={predictions.nextMatch.confidence} />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Season End Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Predicted Final Position: {predictions.seasonEnd.position}</p>
              <p className={`text-sm ${seasonEndStatus.color}`}>{seasonEndStatus.text}</p>
            </div>
            <ConfidenceBadge confidence={predictions.seasonEnd.confidence} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

