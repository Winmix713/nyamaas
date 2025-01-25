"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BothTeamsScoredProgress } from "./both-teams-scored-progress"

interface PerformanceMetricsProps {
  metrics: {
    goals_scored: number
    goals_conceded: number
    clean_sheets: number
    shots_pg: number
    bothTeamsScoredPercentage: number
    totalMatches: number
  }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const data = [
    { name: "Goals Scored", value: metrics.goals_scored },
    { name: "Goals Conceded", value: metrics.goals_conceded },
    { name: "Clean Sheets", value: metrics.clean_sheets },
    { name: "Shots p/g", value: metrics.shots_pg },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <BothTeamsScoredProgress percentage={metrics.bothTeamsScoredPercentage} totalMatches={metrics.totalMatches} />
      </CardContent>
    </Card>
  )
}

