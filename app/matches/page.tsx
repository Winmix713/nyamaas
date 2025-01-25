"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trophy, Search, MoreVertical, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface League {
  id: string
  season: string
  winner: string
  secondPlace: string
  thirdPlace: string
  status: "In Progress" | "Completed"
}

export default function MatchesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [leagues, setLeagues] = useState<League[]>([])
  const [newLeagueId, setNewLeagueId] = useState("")
  const [isNewLeagueModalOpen, setIsNewLeagueModalOpen] = useState(false)
  const { toast } = useToast()

  const loadLeagueData = useCallback((leagueId: string): League | undefined => {
    const savedData = localStorage.getItem(`league_${leagueId}`)
    if (savedData) {
      const { standings } = JSON.parse(savedData)
      if (standings && standings.length >= 3) {
        return {
          id: leagueId,
          season: `Virtuális Labdarúgás Liga Mód Retail ${leagueId}`,
          winner: standings[0].team,
          secondPlace: standings[1].team,
          thirdPlace: standings[2].team,
          status: "In Progress",
        }
      }
    }
    return undefined
  }, [])

  useEffect(() => {
    const savedLeagues = localStorage.getItem("leagues")
    if (savedLeagues) {
      const parsedLeagues = JSON.parse(savedLeagues)
      const updatedLeagues = parsedLeagues.map((league: League) => {
        const savedLeague = loadLeagueData(league.id)
        return savedLeague || league
      })
      setLeagues(updatedLeagues)
    }
  }, [loadLeagueData])

  const handleCreateLeague = useCallback(() => {
    if (newLeagueId) {
      const newLeague: League = {
        id: newLeagueId,
        season: `Virtuális Labdarúgás Liga Mód Retail ${newLeagueId}`,
        winner: "-",
        secondPlace: "-",
        thirdPlace: "-",
        status: "In Progress",
      }
      const updatedLeagues = [...leagues, newLeague]
      localStorage.setItem("leagues", JSON.stringify(updatedLeagues))
      setLeagues(updatedLeagues)
      setNewLeagueId("")
      setIsNewLeagueModalOpen(false)
      toast({
        title: "League Created",
        description: `New league with ID ${newLeagueId} has been created.`,
      })
      router.push(`/matches/${newLeagueId}`)
    }
  }, [newLeagueId, leagues, router, toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Matches Schedule</h1>

      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search seasons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <Dialog open={isNewLeagueModalOpen} onOpenChange={setIsNewLeagueModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New League
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New League</DialogTitle>
                  <DialogDescription>
                    Enter the ID for the new league. The name will be automatically generated.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="leagueId" className="text-right">
                      League ID
                    </Label>
                    <Input
                      id="leagueId"
                      value={newLeagueId}
                      onChange={(e) => setNewLeagueId(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateLeague}>Create League</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Premier-League-Logo-White-png-9WUB5CRwZAmPVcDMbqDhz9lm61GJ4L.png"
                    alt="Premier League"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Second Place</TableHead>
                <TableHead>Third Place</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues
                .filter((league) =>
                  Object.values(league).some((value) =>
                    value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
                  ),
                )
                .map((league) => (
                  <TableRow key={league.id}>
                    <TableCell>
                      <Trophy className="w-5 h-5 text-primary" />
                    </TableCell>
                    <TableCell className="font-medium">{league.season}</TableCell>
                    <TableCell>{league.winner}</TableCell>
                    <TableCell>{league.secondPlace}</TableCell>
                    <TableCell>{league.thirdPlace}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          league.status === "In Progress"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {league.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/matches/${league.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/matches/${league.id}`)}>
                            Edit League
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedLeagues = leagues.map((l) =>
                                l.id === league.id ? { ...l, status: "Completed" } : l,
                              )
                              localStorage.setItem("leagues", JSON.stringify(updatedLeagues))
                              setLeagues(updatedLeagues)
                              toast({
                                title: "League Completed",
                                description: `League with ID ${league.id} has been marked as completed.`,
                              })
                            }}
                          >
                            Complete League
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedLeagues = leagues.filter((l) => l.id !== league.id)
                              localStorage.setItem("leagues", JSON.stringify(updatedLeagues))
                              localStorage.removeItem(`league_${league.id}`)
                              setLeagues(updatedLeagues)
                              toast({
                                title: "League Deleted",
                                description: `League with ID ${league.id} has been deleted.`,
                              })
                            }}
                            className="text-destructive"
                          >
                            Delete League
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

