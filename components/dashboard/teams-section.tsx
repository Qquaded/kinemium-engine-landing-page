"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Loader2, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTeam, ApiError } from "@/lib/api"
import {
  getTrackedTeams,
  addTrackedTeam,
  removeTrackedTeam,
  type TrackedTeam,
} from "@/lib/use-auth"
import { TeamCard } from "@/components/dashboard/team-card"

export function TeamsSection() {
  const [teams, setTeams] = useState<TrackedTeam[]>([])

  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)

  const [trackId, setTrackId] = useState("")
  const [trackName, setTrackName] = useState("")

  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  useEffect(() => {
    setTeams(getTrackedTeams())
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (newName.trim().length === 0) {
      setMessage({ type: "error", text: "Enter a team name." })
      return
    }
    setCreating(true)
    try {
      const { id } = await createTeam(newName.trim())
      const next = addTrackedTeam({ id, name: newName.trim() })
      setTeams(next)
      setNewName("")
      setMessage({ type: "success", text: `Team "${newName.trim()}" created.` })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not create team." })
    } finally {
      setCreating(false)
    }
  }

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const id = Number.parseInt(trackId, 10)
    if (Number.isNaN(id)) {
      setMessage({ type: "error", text: "Enter a valid team ID." })
      return
    }
    const next = addTrackedTeam({ id, name: trackName.trim() || `Team ${id}` })
    setTeams(next)
    setTrackId("")
    setTrackName("")
  }

  function handleUntrack(id: number) {
    setTeams(removeTrackedTeam(id))
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
          <Users className="h-4 w-4 text-primary" />
          Your teams
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <form onSubmit={handleCreate} className="flex flex-col gap-2">
            <Label htmlFor="new-team">Create a new team</Label>
            <div className="flex gap-2">
              <Input
                id="new-team"
                placeholder="My Team"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={creating} className="rounded-full">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          <form onSubmit={handleTrack} className="flex flex-col gap-2">
            <Label htmlFor="track-team">Track an existing team</Label>
            <div className="flex gap-2">
              <Input
                id="track-team"
                type="number"
                placeholder="Team ID"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-28"
              />
              <Input
                placeholder="Label (optional)"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary" className="rounded-full">
                Add
              </Button>
            </div>
          </form>
        </div>

        {message && (
          <p className={`mt-3 text-sm ${message.type === "error" ? "text-destructive-foreground" : "text-primary"}`}>
            {message.text}
          </p>
        )}
      </section>

      {teams.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          You are not tracking any teams yet. Create one above, or add an existing team by its ID.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onUntrack={handleUntrack} />
          ))}
        </div>
      )}
    </div>
  )
}
