"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TeamOverview } from "@/components/team-overview"
import { TeamCharacteristics } from "@/components/team-characteristics"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { DetailedStats } from "@/components/detailed-stats"
import { CompetitionStats } from "@/components/competition-stats"
import { useToast } from "@/components/ui/use-toast"

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

const TEAM_LOGOS: { [key: string]: string } = {
  "Aston Oroszlán": "https://resources.premierleague.com/premierleague/badges/t7.svg",
  Brentford: "https://resources.premierleague.com/premierleague/badges/t94.svg",
  Brighton: "https://resources.premierleague.com/premierleague/badges/t36.svg",
  Chelsea: "https://resources.premierleague.com/premierleague/badges/t8.svg",
  "Crystal Palace": "https://resources.premierleague.com/premierleague/badges/t31.svg",
  Everton: "https://resources.premierleague.com/premierleague/badges/t11.svg",
  Fulham: "https://resources.premierleague.com/premierleague/badges/t54.svg",
  Liverpool: "https://resources.premierleague.com/premierleague/badges/t14.svg",
  "London Ágyúk": "https://resources.premierleague.com/premierleague/badges/t3.svg",
  "Manchester Kék": "https://resources.premierleague.com/premierleague/badges/t43.svg",
  Newcastle: "https://resources.premierleague.com/premierleague/badges/t4.svg",
  Nottingham: "https://resources.premierleague.com/premierleague/badges/t17.svg",
  Tottenham: "https://resources.premierleague.com/premierleague/badges/t6.svg",
  "Vörös Ördögök": "https://resources.premierleague.com/premierleague/badges/t1.svg",
  "West Ham": "https://resources.premierleague.com/premierleague/badges/t21.svg",
  Wolverhampton: "https://resources.premierleague.com/premierleague/badges/t39.svg",
}

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState("")
  const [teamData, setTeamData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchTeamData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/team-stats?team=${encodeURIComponent(selectedTeam)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch team data")
      }
      const data = await response.json()
      setTeamData(data)
    } catch (error) {
      console.error("Error fetching team data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch team data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Team Analysis</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchTeamData} disabled={!selectedTeam || isLoading}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>

      {teamData && (
        <div className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <TeamOverview
              teamName={selectedTeam}
              logoUrl={TEAM_LOGOS[selectedTeam]}
              stats={teamData.overview}
              form={teamData.form}
            />
            <PerformanceMetrics metrics={teamData.performanceMetrics} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamData && teamData.characteristics && (
              <TeamCharacteristics
                strengths={teamData.characteristics.strengths}
                weaknesses={teamData.characteristics.weaknesses}
                style={teamData.characteristics.style}
                mental={teamData.characteristics.mental}
              />
            )}
            <CompetitionStats stats={teamData.competitions} />
          </div>

          <DetailedStats stats={teamData.detailedStats} />
        </div>
      )}
    </div>
  )
}

