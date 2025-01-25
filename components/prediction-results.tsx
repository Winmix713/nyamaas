import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Prediction {
  homeTeam: string
  awayTeam: string
  prediction: string
  confidence: number
}

interface PredictionResultsProps {
  predictions: {
    matches: Array<{ homeTeam: string; awayTeam: string }>
    results: Prediction[]
  }
}

export function PredictionResults({ predictions }: PredictionResultsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Prediction Results</h2>
      {predictions.results.map((result, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              {result.homeTeam} vs {result.awayTeam}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Prediction: {result.prediction}</p>
                <p>Confidence: {result.confidence}%</p>
              </div>
              <Badge variant={result.confidence > 70 ? "default" : "secondary"}>
                {result.confidence > 70 ? "High Confidence" : "Moderate Confidence"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

