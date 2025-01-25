"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface H2HScoringTimesProps {
  scoringTimes: {
    [key: string]: number
  }
}

export const H2HScoringTimes = memo(function H2HScoringTimes({ scoringTimes }: H2HScoringTimesProps) {
  const data = useMemo(
    () =>
      Object.entries(scoringTimes).map(([time, count]) => ({
        time,
        goals: count,
      })),
    [scoringTimes],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Times Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="goals" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

