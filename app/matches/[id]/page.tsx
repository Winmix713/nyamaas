"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Papa from "papaparse"

// Interfaces remain exactly the same as in the attachment
interface MatchResult {
  date: string
  home_team: string
  away_team: string
  ht_home_score: string
  ht_away_score: string
  home_score: string
  away_score: string
}

interface TeamStanding {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string
}

interface TeamForm {
  position: number
  team: string
  goalsFor: number
  goalsAgainst: number
  penaltyKicks: number
  played: number
  points: number
  form: string
}

const teamLogos: { [key: string]: string } = {
  "Aston Oroszlán": "https://resources.premierleague.com/premierleague/badges/50/t7.png",
  Brighton: "https://resources.premierleague.com/premierleague/badges/50/t36.png",
  Brentford: "https://resources.premierleague.com/premierleague/badges/50/t94.png",
  Chelsea: "https://resources.premierleague.com/premierleague/badges/50/t8.png",
  "Crystal Palace": "https://resources.premierleague.com/premierleague/badges/50/t31.png",
  Everton: "https://resources.premierleague.com/premierleague/badges/50/t11.png",
  Fulham: "https://resources.premierleague.com/premierleague/badges/50/t54.png",
  Liverpool: "https://resources.premierleague.com/premierleague/badges/50/t14.png",
  "London Ágyúk": "https://resources.premierleague.com/premierleague/badges/50/t3.png",
  "Manchester Kék": "https://resources.premierleague.com/premierleague/badges/50/t43.png",
  Newcastle: "https://resources.premierleague.com/premierleague/badges/50/t4.png",
  Nottingham: "https://resources.premierleague.com/premierleague/badges/50/t17.png",
  Tottenham: "https://resources.premierleague.com/premierleague/badges/50/t6.png",
  "Vörös Ördögök": "https://resources.premierleague.com/premierleague/badges/50/t1.png",
  "West Ham": "https://resources.premierleague.com/premierleague/badges/50/t21.png",
  Wolverhampton: "https://resources.premierleague.com/premierleague/badges/50/t39.png",
}

export default function LeaguePage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [standings, setStandings] = useState<TeamStanding[]>([])
  const [teamForms, setTeamForms] = useState<TeamForm[]>([])
  const [activeTab, setActiveTab] = useState("matches")
  const [roundView, setRoundView] = useState<"rounds" | "all">("rounds")
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadLeagueData(leagueId)
  }, [leagueId])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        Papa.parse(file, {
          complete: (result) => {
            const parsedMatches = result.data as MatchResult[]
            setMatches(parsedMatches)
            const teamStats = calculateTeamStats(parsedMatches)
            updateStandingsAndForms(teamStats)
            setIsSaveDisabled(false)
            toast({
              title: "File Uploaded",
              description: "The CSV file has been successfully processed.",
            })
          },
          header: true,
          error: (error) => {
            toast({
              title: "Error",
              description: `Failed to parse CSV file: ${error.message}`,
              variant: "destructive",
            })
          },
        })
      }
    },
    [toast],
  )

  const calculateTeamStats = useCallback((matches: MatchResult[]) => {
      const teamStats: Record<string, any> = {}

      // Initialize all teams first
      matches.forEach((match) => {
        if (!teamStats[match.home_team]) {
          teamStats[match.home_team] = {
            team: match.home_team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            form: [],
            penaltyKicks: 0,
            homeMatches: 0,
            awayMatches: 0,
          }
        }
        if (!teamStats[match.away_team]) {
          teamStats[match.away_team] = {
            team: match.away_team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            form: [],
            penaltyKicks: 0,
            homeMatches: 0,
            awayMatches: 0,
          }
        }
      })

      // Process matches in order
      matches.forEach((match) => {
        const homeScore = Number(match.home_score)
        const awayScore = Number(match.away_score)

        // Update match counts
        teamStats[match.home_team].played += 1
        teamStats[match.home_team].homeMatches += 1
        teamStats[match.away_team].played += 1
        teamStats[match.away_team].awayMatches += 1

        // Update goals
        teamStats[match.home_team].goalsFor += homeScore
        teamStats[match.home_team].goalsAgainst += awayScore
        teamStats[match.away_team].goalsFor += awayScore
        teamStats[match.away_team].goalsAgainst += homeScore

        // Update results and points
        if (homeScore > awayScore) {
          // Home win
          teamStats[match.home_team].won += 1
          teamStats[match.home_team].points += 3
          teamStats[match.home_team].form.push("G")
          teamStats[match.away_team].lost += 1
          teamStats[match.away_team].form.push("V")
        } else if (homeScore < awayScore) {
          // Away win
          teamStats[match.away_team].won += 1
          teamStats[match.away_team].points += 3
          teamStats[match.away_team].form.push("G")
          teamStats[match.home_team].lost += 1
          teamStats[match.home_team].form.push("V")
        } else {
          // Draw
          teamStats[match.home_team].drawn += 1
          teamStats[match.home_team].points += 1
          teamStats[match.home_team].form.push("D")
          teamStats[match.away_team].drawn += 1
          teamStats[match.away_team].points += 1
          teamStats[match.away_team].form.push("D")
        }

        // Update goal differences
        teamStats[match.home_team].goalDifference =
          teamStats[match.home_team].goalsFor - teamStats[match.home_team].goalsAgainst
        teamStats[match.away_team].goalDifference =
          teamStats[match.away_team].goalsFor - teamStats[match.away_team].goalsAgainst

        // Keep only last 6 form results
        teamStats[match.home_team].form = teamStats[match.home_team].form.slice(-6)
        teamStats[match.away_team].form = teamStats[match.away_team].form.slice(-6)
      })

      return teamStats
    }, []),
    updateStandingsAndForms = useCallback((teamStats: Record<string, any>) => {
      const standingsArray: TeamStanding[] = Object.values(teamStats)
        .map((stats: any) => ({
          position: 0,
          team: stats.team,
          played: stats.played,
          won: stats.won,
          drawn: stats.drawn,
          lost: stats.lost,
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          goalDifference: stats.goalDifference,
          points: stats.points,
          form: stats.form.join(""),
        }))
        .sort((a, b) => {
          // Sort by points first
          if (b.points !== a.points) return b.points - a.points
          // Then by goal difference
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
          // Then by goals scored
          return b.goalsFor - a.goalsFor
        })
        .map((team, index) => ({ ...team, position: index + 1 }))

      setStandings(standingsArray)

      // Calculate form table (last 6 matches)
      const formsArray: TeamForm[] = Object.values(teamStats)
        .map((stats: any) => ({
          position: 0,
          team: stats.team,
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          penaltyKicks: stats.penaltyKicks || 0,
          played: 6, // Last 6 matches
          points: stats.points,
          form: stats.form.join(""),
        }))
        .sort((a, b) => {
          // Sort by recent form points
          const getFormPoints = (form: string) => {
            return form.split("").reduce((acc, result) => {
              if (result === "G") return acc + 3
              if (result === "D") return acc + 1
              return acc
            }, 0)
          }
          const aPoints = getFormPoints(a.form)
          const bPoints = getFormPoints(b.form)
          return bPoints - aPoints
        })
        .map((team, index) => ({ ...team, position: index + 1 }))

      setTeamForms(formsArray)
    }, [])

  const renderMatches = useCallback(() => {
    if (roundView === "rounds") {
      const matchesByRound = matches.reduce(
        (acc, match) => {
          if (!acc[match.date]) {
            acc[match.date] = []
          }
          acc[match.date].push(match)
          return acc
        },
        {} as Record<string, MatchResult[]>,
      )

      return Object.entries(matchesByRound).map(([date, roundMatches]) => (
        <Card key={date} className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              {roundView === "rounds" ? "Forduló" : "Összes mérkőzés"}: {date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-foreground">Home Team</TableHead>
                  <TableHead className="text-foreground">Away Team</TableHead>
                  <TableHead className="text-foreground">Half Time</TableHead>
                  <TableHead className="text-foreground">Full Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roundMatches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image
                          src={teamLogos[match.home_team] || "/placeholder.svg"}
                          alt={match.home_team}
                          width={24}
                          height={24}
                        />
                        {match.home_team}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image
                          src={teamLogos[match.away_team] || "/placeholder.svg"}
                          alt={match.away_team}
                          width={24}
                          height={24}
                        />
                        {match.away_team}
                      </div>
                    </TableCell>
                    <TableCell>{`${match.ht_home_score}-${match.ht_away_score}`}</TableCell>
                    <TableCell>{`${match.home_score}-${match.away_score}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))
    } else {
      return (
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="text-foreground">Date</TableHead>
              <TableHead className="text-foreground">Home Team</TableHead>
              <TableHead className="text-foreground">Away Team</TableHead>
              <TableHead className="text-foreground">Half Time</TableHead>
              <TableHead className="text-foreground">Full Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell>{match.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={teamLogos[match.home_team] || "/placeholder.svg"}
                      alt={match.home_team}
                      width={24}
                      height={24}
                    />
                    {match.home_team}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={teamLogos[match.away_team] || "/placeholder.svg"}
                      alt={match.away_team}
                      width={24}
                      height={24}
                    />
                    {match.away_team}
                  </div>
                </TableCell>
                <TableCell>{`${match.ht_home_score}-${match.ht_away_score}`}</TableCell>
                <TableCell>{`${match.home_score}-${match.away_score}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }
  }, [matches, roundView])

  const renderStandings = useCallback(
    () => (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead colSpan={11} className="text-center text-lg font-bold">
                Liga Táblázat
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-foreground w-[60px]">Poz.</TableHead>
              <TableHead className="text-foreground">Csapat</TableHead>
              <TableHead className="text-foreground w-[60px]">M</TableHead>
              <TableHead className="text-foreground w-[60px]">G</TableHead>
              <TableHead className="text-foreground w-[60px]">D</TableHead>
              <TableHead className="text-foreground w-[60px]">V</TableHead>
              <TableHead className="text-foreground w-[60px]">LG</TableHead>
              <TableHead className="text-foreground w-[60px]">KG</TableHead>
              <TableHead className="text-foreground w-[60px]">Gólk.</TableHead>
              <TableHead className="text-foreground w-[60px]">PTK</TableHead>
              <TableHead className="text-foreground">Forma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((team) => (
              <TableRow key={team.team} className="hover:bg-muted/50">
                <TableCell className="font-medium">{team.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src={teamLogos[team.team] || "/placeholder.svg"} alt={team.team} width={24} height={24} />
                    {team.team}
                  </div>
                </TableCell>
                <TableCell>{team.played}</TableCell>
                <TableCell>{team.won}</TableCell>
                <TableCell>{team.drawn}</TableCell>
                <TableCell>{team.lost}</TableCell>
                <TableCell>{team.goalsFor}</TableCell>
                <TableCell>{team.goalsAgainst}</TableCell>
                <TableCell>{team.goalDifference}</TableCell>
                <TableCell className="font-bold">{team.points}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {team.form.split("").map((result, index) => (
                      <span
                        key={index}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          result === "G"
                            ? "bg-green-500 text-white"
                            : result === "D"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-500 text-white"
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ),
    [standings],
  )

  const renderForm = useCallback(
    () => (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead colSpan={8} className="text-center text-lg font-bold">
                Forma
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-foreground w-[60px]">Hely.</TableHead>
              <TableHead className="text-foreground">Csapat</TableHead>
              <TableHead className="text-foreground w-[60px]">LG</TableHead>
              <TableHead className="text-foreground w-[60px]">KG</TableHead>
              <TableHead className="text-foreground w-[60px]">PK</TableHead>
              <TableHead className="text-foreground w-[80px]">Játszott</TableHead>
              <TableHead className="text-foreground w-[60px]">Pont</TableHead>
              <TableHead className="text-foreground">Forma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamForms.map((team) => (
              <TableRow key={team.team} className="hover:bg-muted/50">
                <TableCell className="font-medium">{team.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src={teamLogos[team.team] || "/placeholder.svg"} alt={team.team} width={24} height={24} />
                    {team.team}
                  </div>
                </TableCell>
                <TableCell>{team.goalsFor}</TableCell>
                <TableCell>{team.goalsAgainst}</TableCell>
                <TableCell>{team.penaltyKicks}</TableCell>
                <TableCell>{team.played}</TableCell>
                <TableCell className="font-bold">{team.points}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {team.form.split("").map((result, index) => (
                      <span
                        key={index}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          result === "G"
                            ? "bg-green-500 text-white"
                            : result === "D"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-500 text-white"
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ),
    [teamForms],
  )

  const saveLeagueData = useCallback(() => {
    const leagueData = {
      matches,
      standings,
      teamForms,
    }
    localStorage.setItem(`league_${leagueId}`, JSON.stringify(leagueData))
    setIsSaveDisabled(true)
    toast({
      title: "Data Saved",
      description: "League data has been successfully saved.",
      duration: 3000,
    })
  }, [matches, standings, teamForms, leagueId, toast])

  const loadLeagueData = useCallback((leagueId: string) => {
    const savedData = localStorage.getItem(`league_${leagueId}`)
    if (savedData) {
      const { matches: savedMatches, standings: savedStandings, teamForms: savedTeamForms } = JSON.parse(savedData)
      setMatches(savedMatches)
      setStandings(savedStandings)
      setTeamForms(savedTeamForms)
      setIsDataLoaded(true)
      setIsSaveDisabled(true)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/matches")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leagues
        </Button>
        <h1 className="text-4xl font-bold text-primary">League {leagueId} Details</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <Label htmlFor="csv-upload" className="block text-sm font-medium text-muted-foreground mb-2">
                Upload CSV File
              </Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="bg-background border-input text-foreground w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button
                onClick={saveLeagueData}
                disabled={isSaveDisabled}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 disabled:bg-muted disabled:text-muted-foreground"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
          {isDataLoaded && <p className="text-sm text-primary">Saved data loaded successfully.</p>}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="matches"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Játékidő eredménye
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Teljes táblázat
          </TabsTrigger>
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Forma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Matches</h2>
            <Select value={roundView} onValueChange={setRoundView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounds">View by Rounds</SelectItem>
                <SelectItem value="all">View All Matches</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-6">{renderMatches()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings" className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Standings</h2>
          <Card>
            <CardContent className="p-6">{renderStandings()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Form</h2>
          <Card>
            <CardContent className="p-6">{renderForm()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

