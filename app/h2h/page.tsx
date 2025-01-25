"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { H2HMatches } from "@/components/h2h-matches"
import { H2HOverallStats } from "@/components/h2h-overall-stats"
import { H2HSeasonStats } from "@/components/h2h-season-stats"
import { H2HScoringTimes } from "@/components/h2h-scoring-times"
import { useToast } from "@/components/ui/use-toast"
import type { H2HStats } from "@/types/stats"
import { ArrowLeftRight } from "lucide-react"

const TEAMS = [
  "Aston Oroszlán",
  "Brentford",
  "Brighton",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Liverpool",
  "London Ágyúk",
  "Manchester Kék",
  "Newcastle",
  "Nottingham",
  "Tottenham",
  "Vörös Ördögök",
  "West Ham",
  "Wolverhampton",
].sort()

export default function H2HPage() {
  const [team1, setTeam1] = useState("")
  const [team2, setTeam2] = useState("")
  const [h2hData, setH2HData] = useState<H2HStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const team1Options = useMemo(() => TEAMS.filter((team) => team !== team2), [team2])

  const team2Options = useMemo(() => TEAMS.filter((team) => team !== team1), [team1])

  const fetchH2HData = useCallback(async () => {
    if (!team1 || !team2) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/h2h?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch H2H data")
      }

      const data = await response.json()
      setH2HData(data)
    } catch (error) {
      console.error("Error fetching H2H data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch H2H data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [team1, team2, toast])

  const swapTeams = useCallback(() => {
    setTeam1(team2)
    setTeam2(team1)
  }, [team1, team2])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Select value={team1} onValueChange={setTeam1}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select first team" />
              </SelectTrigger>
              <SelectContent>
                {team1Options.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={swapTeams}
              disabled={!team1 || !team2}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <Select value={team2} onValueChange={setTeam2}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select second team" />
              </SelectTrigger>
              <SelectContent>
                {team2Options.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={fetchH2HData} disabled={!team1 || !team2 || isLoading} className="w-full md:w-auto">
              {isLoading ? "Analyzing..." : "Compare Teams"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {h2hData && (
        <div className="space-y-8">
          <H2HMatches matches={h2hData.matches} />
          <div className="grid md:grid-cols-2 gap-8">
            <H2HOverallStats stats={h2hData.overall_stats} team1={team1} team2={team2} />
            <H2HSeasonStats stats={h2hData.season_stats} />
          </div>
          <H2HScoringTimes scoringTimes={h2hData.scoring_times} />
        </div>
      )}
    </div>
  )
}

