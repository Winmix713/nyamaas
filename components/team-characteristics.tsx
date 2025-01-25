import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Swords, Shield, Gamepad2, Brain } from "lucide-react"
import { useMemo } from "react"

interface TeamCharacteristicsProps {
  strengths: Array<{
    category: string
    rating: "Very Strong" | "Strong" | "Moderate"
  }>
  weaknesses: Array<{
    category: string
    rating: "Weak" | "Very Weak"
  }>
  style: string[]
  mental: Array<{
    aspect: string
    rating: "Strong" | "Moderate" | "Inconsistent"
  }>
}

export function TeamCharacteristics({
  strengths = [],
  weaknesses = [],
  style = [],
  mental = [],
}: TeamCharacteristicsProps) {
  const colorSchemes = useMemo(
    () => ({
      strength: {
        "Very Strong": "bg-green-500/10 text-green-500 border-green-500/20",
        Strong: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Moderate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      },
      weakness: {
        "Very Weak": "bg-red-500/10 text-red-500 border-red-500/20",
        Weak: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
      mental: {
        Strong: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        Moderate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Inconsistent: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      },
    }),
    [],
  )

  const CharacteristicSection = ({
    title,
    icon: Icon,
    items,
    colorScheme,
    renderItem,
  }: {
    title: string
    icon: React.ElementType
    items: any[]
    colorScheme: Record<string, string>
    renderItem: (item: any, index: number) => React.ReactNode
  }) => (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => renderItem(item, index))
        ) : (
          <p className="text-sm text-muted-foreground">No {title.toLowerCase()} data available</p>
        )}
      </div>
    </div>
  )

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Team Characteristics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CharacteristicSection
          title="Strengths"
          icon={Swords}
          items={strengths}
          colorScheme={colorSchemes.strength}
          renderItem={(strength, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{strength.category}</span>
              <Badge variant="outline" className={colorSchemes.strength[strength.rating]}>
                {strength.rating}
              </Badge>
            </div>
          )}
        />

        <CharacteristicSection
          title="Weaknesses"
          icon={Shield}
          items={weaknesses}
          colorScheme={colorSchemes.weakness}
          renderItem={(weakness, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{weakness.category}</span>
              <Badge variant="outline" className={colorSchemes.weakness[weakness.rating]}>
                {weakness.rating}
              </Badge>
            </div>
          )}
        />

        <CharacteristicSection
          title="Mental Characteristics"
          icon={Brain}
          items={mental}
          colorScheme={colorSchemes.mental}
          renderItem={(trait, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{trait.aspect}</span>
              <Badge variant="outline" className={colorSchemes.mental[trait.rating]}>
                {trait.rating}
              </Badge>
            </div>
          )}
        />

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-5 w-5" />
            <h3 className="font-medium">Style of Play</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {style.length > 0 ? (
              style.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {item}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No style data available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

