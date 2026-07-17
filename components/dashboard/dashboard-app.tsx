"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Hash, Loader2, Plus, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTeam, getUserName, ApiError } from "@/lib/api"
import {
  getTrackedTeams,
  addTrackedTeam,
  removeTrackedTeam,
  type TrackedTeam,
} from "@/lib/use-auth"
import { siteConfig } from "@/config/site"
import { FriendsView } from "@/components/dashboard/friends-view"
import { TeamView } from "@/components/dashboard/team-view"
import { UserPanel } from "@/components/dashboard/user-panel"

type Active = { type: "friends" } | { type: "team"; id: number }

export function DashboardApp() {
  const [teams, setTeams] = useState<TrackedTeam[]>([])
  const [active, setActive] = useState<Active>({ type: "friends" })
  const [username, setUsername] = useState("You")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setTeams(getTrackedTeams())
    setUsername(getUserName() || "You")
  }, [])

  function handleUntrack(id: number) {
    const next = removeTrackedTeam(id)
    setTeams(next)
    setActive((cur) => (cur.type === "team" && cur.id === id ? { type: "friends" } : cur))
  }

  function handleCreated(team: TrackedTeam) {
    setTeams(getTrackedTeams())
    setActive({ type: "team", id: team.id })
    setDialogOpen(false)
  }

  const activeTeam = active.type === "team" ? teams.find((t) => t.id === active.id) : undefined

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3">
        <a href="/" className="flex shrink-0 items-center gap-2 pr-1" aria-label="Back to home">
          <img src={siteConfig.images.logo || "/placeholder.svg"} alt="" className="h-8 w-8 rounded-lg object-cover" />
        </a>
        <div className="h-6 w-px bg-zinc-800" />

        {/* Tabs */}
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          <TabButton active={active.type === "friends"} onClick={() => setActive({ type: "friends" })}>
            <Users className="h-4 w-4" />
            Friends
          </TabButton>

          {teams.map((team) => (
            <TabButton
              key={team.id}
              active={active.type === "team" && active.id === team.id}
              onClick={() => setActive({ type: "team", id: team.id })}
            >
              <Hash className="h-4 w-4" />
              <span className="max-w-[10rem] truncate">{team.name}</span>
            </TabButton>
          ))}

          <button
            onClick={() => setDialogOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-orange-400"
            aria-label="Add team"
          >
            <Plus className="h-5 w-5" />
          </button>
        </nav>

        <div className="h-6 w-px bg-zinc-800" />
        <UserPanel username={username} />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {active.type === "friends" ? (
          <FriendsView />
        ) : activeTeam ? (
          <TeamView team={activeTeam} onUntrack={handleUntrack} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">Select a team.</div>
        )}
      </main>

      <AddTeamDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={handleCreated} onTracked={handleCreated} />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  )
}

function AddTeamDialog({
  open,
  onOpenChange,
  onCreated,
  onTracked,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (t: TrackedTeam) => void
  onTracked: (t: TrackedTeam) => void
}) {
  const [name, setName] = useState("")
  const [creating, setCreating] = useState(false)
  const [trackId, setTrackId] = useState("")
  const [trackName, setTrackName] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (name.trim().length === 0) {
      setError("Enter a team name.")
      return
    }
    setCreating(true)
    try {
      const { id } = await createTeam(name.trim())
      const team = { id, name: name.trim() }
      addTrackedTeam(team)
      setName("")
      onCreated(team)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create team.")
    } finally {
      setCreating(false)
    }
  }

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const id = Number.parseInt(trackId, 10)
    if (Number.isNaN(id)) {
      setError("Enter a valid team ID.")
      return
    }
    const team = { id, name: trackName.trim() || `Team ${id}` }
    addTrackedTeam(team)
    setTrackId("")
    setTrackName("")
    onTracked(team)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Add a team</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a brand-new team, or open one you already belong to by its ID.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <Label htmlFor="create-team">Create a new team</Label>
          <div className="flex gap-2">
            <Input
              id="create-team"
              placeholder="My Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
            />
            <Button type="submit" disabled={creating} className="bg-orange-500 text-zinc-950 hover:bg-orange-600">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-3 py-1 text-xs text-zinc-500">
          <div className="h-px flex-1 bg-zinc-800" />
          OR
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleTrack} className="flex flex-col gap-2">
          <Label htmlFor="track-team">Open an existing team</Label>
          <div className="flex gap-2">
            <Input
              id="track-team"
              type="number"
              placeholder="Team ID"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="w-28 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
            />
            <Input
              placeholder="Label (optional)"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="flex-1 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
            />
            <Button type="submit" variant="secondary" className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600">
              Add
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
