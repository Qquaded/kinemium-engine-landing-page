"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Crown, Loader2, Plus, Trash2, UserMinus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  createRole,
  ApiError,
  type TeamMember,
} from "@/lib/api"
import type { TrackedTeam } from "@/lib/use-auth"

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function formatDate(seconds: number) {
  try {
    return new Date(seconds * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

export function TeamCard({ team, onUntrack }: { team: TrackedTeam; onUntrack: (id: number) => void }) {
  const { data, error, isLoading, mutate } = useSWR<TeamMember[]>(`team-${team.id}`, () =>
    getTeamMembers(team.id),
  )

  const [showAdd, setShowAdd] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [roleName, setRoleName] = useState("")
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [busyMemberId, setBusyMemberId] = useState<number | null>(null)

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const parsedRole = Number.parseInt(roleId, 10)
    if (Number.isNaN(parsedRole)) {
      setMessage({ type: "error", text: "Enter a valid role ID." })
      return
    }
    setBusy(true)
    try {
      await addTeamMember(team.id, memberEmail.trim(), parsedRole)
      setMemberEmail("")
      setRoleId("")
      setMessage({ type: "success", text: "Member added." })
      await mutate()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not add member." })
    } finally {
      setBusy(false)
    }
  }

  async function handleCreateRole(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (roleName.trim().length === 0) {
      setMessage({ type: "error", text: "Enter a role name." })
      return
    }
    setBusy(true)
    try {
      const { id } = await createRole(team.id, roleName.trim())
      setRoleName("")
      setMessage({ type: "success", text: `Role "${roleName.trim()}" created (ID ${id}).` })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not create role." })
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveMember(userId: number) {
    setBusyMemberId(userId)
    try {
      await removeTeamMember(team.id, userId)
      await mutate()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not remove member." })
    } finally {
      setBusyMemberId(null)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{team.name}</h3>
          <p className="text-xs text-muted-foreground">Team ID {team.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full bg-transparent"
            onClick={() => setShowAdd((s) => !s)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Manage
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground"
            onClick={() => onUntrack(team.id)}
            aria-label={`Stop tracking ${team.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
          <form onSubmit={handleAddMember} className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Add member</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor={`email-${team.id}`} className="sr-only">
                  Member email
                </Label>
                <Input
                  id={`email-${team.id}`}
                  type="email"
                  required
                  placeholder="friend@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-28">
                <Label htmlFor={`role-${team.id}`} className="sr-only">
                  Role ID
                </Label>
                <Input
                  id={`role-${team.id}`}
                  type="number"
                  required
                  placeholder="Role ID"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy} className="rounded-full">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </div>
          </form>

          <div className="h-px bg-border" />

          <form onSubmit={handleCreateRole} className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Create role</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="text"
                placeholder="e.g. Programmer"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary" disabled={busy} className="rounded-full">
                Create role
              </Button>
            </div>
          </form>

          {message && (
            <p className={`text-sm ${message.type === "error" ? "text-destructive-foreground" : "text-primary"}`}>
              {message.text}
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading members…</p>
      ) : error ? (
        <p className="text-sm text-destructive-foreground">
          {error instanceof ApiError ? error.message : "Could not load members."}
        </p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((member) => {
            const isOwner = member.role_name.toLowerCase() === "owner"
            return (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {initials(member.username)}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      {member.username}
                      {isOwner && <Crown className="h-3.5 w-3.5 text-primary" aria-label="Owner" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.role_name} · joined {formatDate(member.joined_at)}
                    </p>
                  </div>
                </div>
                {!isOwner && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive-foreground"
                    disabled={busyMemberId === member.id}
                    onClick={() => handleRemoveMember(member.id)}
                    aria-label={`Remove ${member.username}`}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
