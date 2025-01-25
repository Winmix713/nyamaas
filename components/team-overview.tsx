"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

interface TeamOverviewProps {
  teamName: string
  logoUrl: string
  stats: {
    matches_played: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
  }
  form: string[]
}

export function TeamOverview({ teamName, logoUrl, stats, form }: TeamOverviewProps) {
  const formColors = useMemo(
    () => ({
      W: "bg-green-500 text-primary-foreground",
      D: "bg-yellow-500 text-primary-foreground",
      L: "bg-red-500 text-primary-foreground",
    }),
    [],
  )

  const StatBox = ({
    value,
    label,
    color,
  }: {
    value: number
    label: string
    color: string
  }) => (
    <div className={`${color} p-2 rounded-lg`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-col items-center space-y-2">
        <div className="relative w-20 h-20">
          <Image src={logoUrl || "/placeholder.svg"} alt={teamName} fill className="object-contain" priority />
        </div>
        <CardTitle className="text-2xl font-bold">{teamName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Season Overview</h3>
            <div className="grid grid-cols-3 gap-2">
              <StatBox value={stats.wins} label="Wins" color="bg-green-500/10" />
              <StatBox value={stats.draws} label="Draws" color="bg-yellow-500/10" />
              <StatBox value={stats.losses} label="Losses" color="bg-red-500/10" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StatBox value={stats.goals_for} label="Goals For" color="bg-blue-500/10" />
              <StatBox value={stats.goals_against} label="Goals Against" color="bg-purple-500/10" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Form</h3>
            <div className="grid grid-cols-5 gap-2">
              {form.map((result, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold ${formColors[result as keyof typeof formColors]}`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

