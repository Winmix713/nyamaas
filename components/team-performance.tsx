import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface TeamPerformanceProps {
  performance: {
    lastFiveMatches: string[]
    seasonPosition: number[]
  }
}

export function TeamPerformance({ performance }: TeamPerformanceProps) {
  const { formData, positionData, formColors } = useMemo(
    () => ({
      formData: performance.lastFiveMatches.map((result, index) => ({
        match: index + 1,
        result,
      })),
      positionData: performance.seasonPosition.map((position, index) => ({
        week: index + 1,
        position,
      })),
      formColors: {
        W: "bg-green-500 text-primary-foreground",
        D: "bg-yellow-500 text-primary-foreground",
        L: "bg-red-500 text-primary-foreground",
      },
    }),
    [performance],
  )

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-popover p-2 shadow-md rounded-lg border text-popover-foreground">
          <p className="text-sm">Week {payload[0].payload.week}</p>
          <p className="font-bold">Position: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Last 5 Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {formData.map(({ result }, index) => (
              <Badge
                key={index}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${formColors[result as keyof typeof formColors]}`}
              >
                {result}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Season Position Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={positionData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis reversed domain={[1, 20]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="position"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

