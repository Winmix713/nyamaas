import { MatchSelector } from "@/components/match-selector"
import { PredictionResults } from "@/components/prediction-results"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState(null)

  const handlePredictionsSubmit = async (matches) => {
    // Here you would typically call an API to get predictions
    // For now, we'll simulate an API call with a timeout
    setPredictions(null) // Reset predictions while loading
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPredictions({
      matches: matches,
      results: matches.map((match) => ({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        prediction: Math.random() > 0.5 ? "Home Win" : "Away Win",
        confidence: Math.floor(Math.random() * 100),
      })),
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">WinMix Prediction System</h1>
      <Card className="bg-white/50 backdrop-blur border-0 mb-8">
        <CardContent className="p-6">
          <MatchSelector
            maxMatches={8}
            onPredictionsSubmit={handlePredictionsSubmit}
            isLoading={predictions === null}
          />
        </CardContent>
      </Card>
      {predictions && (
        <Card className="bg-white/50 backdrop-blur border-0">
          <CardContent className="p-6">
            <PredictionResults predictions={predictions} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

