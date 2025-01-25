"use client"

import { useState, useCallback } from "react"
import { Trophy, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface MatchSelectorProps {
  maxMatches?: number
  onPredictionsSubmit: (matches: Array<{ homeTeam: string; awayTeam: string }>) => void
  isLoading?: boolean
}

const TEAMS = [
  "Aston Lions",
  "Brentford",
  "Brighton",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Liverpool",
  "London Cannons",
  "Manchester Blue",
  "Newcastle",
  "Nottingham",
  "Tottenham",
  "Red Devils",
  "West Ham",
  "Wolverhampton",
].sort()

export function MatchSelector({ maxMatches = 8, onPredictionsSubmit, isLoading = false }: MatchSelectorProps) {
  const [matches, setMatches] = useState<Array<{ homeTeam: string; awayTeam: string }>>([
    { homeTeam: "", awayTeam: "" },
  ])
  const [error, setError] = useState<string | null>(null)

  const addMatch = useCallback(() => {
    if (matches.length < maxMatches) {
      setMatches((prev) => [...prev, { homeTeam: "", awayTeam: "" }])
      setError(null)
    } else {
      setError(`Maximum ${maxMatches} matches can be selected`)
    }
  }, [matches.length, maxMatches])

  const removeMatch = useCallback((index: number) => {
    setMatches((prev) => prev.filter((_, i) => i !== index))
    setError(null)
  }, [])

  const updateMatch = useCallback((index: number, type: "home" | "away", value: string) => {
    setMatches((prev) =>
      prev.map((match, i) => (i === index ? { ...match, [type === "home" ? "homeTeam" : "awayTeam"]: value } : match)),
    )
    setError(null)
  }, [])

  const handleSubmit = useCallback(() => {
    // Validate all matches have both teams selected
    const hasIncompleteMatches = matches.some((match) => !match.homeTeam || !match.awayTeam)
    if (hasIncompleteMatches) {
      setError("Please select both teams for all matches")
      return
    }

    // Validate no team is selected more than once
    const allTeams = matches.flatMap((match) => [match.homeTeam, match.awayTeam])
    const duplicateTeam = allTeams.find((team, index) => allTeams.indexOf(team) !== index)
    if (duplicateTeam) {
      setError(`${duplicateTeam} is selected multiple times`)
      return
    }

    onPredictionsSubmit(matches)
  }, [matches, onPredictionsSubmit])

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Mérkőzések kivlasztása</h2>
        <Button onClick={addMatch} variant="secondary" disabled={matches.length >= maxMatches}>
          + Add Match
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-600 bg-red-100 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium">Match {index + 1}</span>
              </div>
              {matches.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeMatch(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <Select value={match.homeTeam} onValueChange={(value) => updateMatch(index, "home", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz hazai csapatot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Home Team</SelectLabel>
                    {TEAMS.filter(
                      (team) =>
                        team !== match.awayTeam &&
                        !matches.some((m, i) => i !== index && (m.homeTeam === team || m.awayTeam === team)),
                    ).map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span className="text-muted-foreground font-medium">VS</span>

              <Select value={match.awayTeam} onValueChange={(value) => updateMatch(index, "away", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz vendég csapatot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Away Team</SelectLabel>
                    {TEAMS.filter(
                      (team) =>
                        team !== match.homeTeam &&
                        !matches.some((m, i) => i !== index && (m.homeTeam === team || m.awayTeam === team)),
                    ).map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={isLoading || matches.length === 0}>
        {isLoading ? "Predikciók futtatása..." : "Predikciók futtatása"}
      </Button>
    </div>
  )
}

