"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Crown, Hash, Loader2, Settings, Trash2, UserMinus } from "lucide-react"
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

export function TeamView({ team, onUntrack }: { team: TrackedTeam; onUntrack: (id: number) => void }) {
  const { data, error, isLoading, mutate } = useSWR<TeamMember[]>(`team-${team.id}`, () => getTeamMembers(team.id))

  const [showManage, setShowManage] = useState(false)
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
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <Hash className="h-5 w-5 text-zinc-400" />
          {team.name}
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-normal text-zinc-400">ID {team.id}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-md border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
            onClick={() => setShowManage((s) => !s)}
          >
            <Settings className="mr-1.5 h-4 w-4" />
            Manage
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
            onClick={() => onUntrack(team.id)}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showManage && (
          <div className="mb-4 flex flex-col gap-4 rounded-lg border border-zinc-700 bg-zinc-950/60 p-4 sm:flex-row">
            <form onSubmit={handleAddMember} className="flex flex-1 flex-col gap-3">
              <p className="text-sm font-semibold text-zinc-100">Add member</p>
              <div className="flex flex-col gap-2">
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
                  className="border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
                />
                <div className="flex gap-2">
                  <Input
                    id={`role-${team.id}`}
                    type="number"
                    required
                    placeholder="Role ID"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-28 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
                  />
                  <Button
                    type="submit"
                    disabled={busy}
                    className="flex-1 rounded-md bg-orange-500 text-zinc-950 hover:bg-orange-600"
                  >
                    {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add
                  </Button>
                </div>
              </div>
            </form>

            <div className="hidden w-px bg-zinc-800 sm:block" />

            <form onSubmit={handleCreateRole} className="flex flex-1 flex-col gap-3">
              <p className="text-sm font-semibold text-zinc-100">Create role</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. Programmer"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="flex-1 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={busy}
                  className="rounded-md bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                >
                  Create
                </Button>
              </div>
              {message && (
                <p className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        )}

        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Members{data ? ` — ${data.length}` : ""}
        </p>

        {isLoading ? (
          <p className="px-1 text-sm text-zinc-400">Loading members…</p>
        ) : error ? (
          <p className="px-1 text-sm text-red-400">
            {error instanceof ApiError ? error.message : "Could not load members."}
          </p>
        ) : !data || data.length === 0 ? (
          <p className="px-1 text-sm text-zinc-400">No members found.</p>
        ) : (
          <ul className="flex flex-col">
            {data.map((member) => {
              const isOwner = member.role_name.toLowerCase() === "owner"
              return (
                <li
                  key={member.id}
                  className="group flex items-center justify-between gap-3 rounded-lg border-t border-zinc-800 px-2 py-3 hover:bg-zinc-800/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-100">
                      {initials(member.username)}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-100">
                        {member.username}
                        {isOwner && <Crown className="h-3.5 w-3.5 text-orange-400" aria-label="Owner" />}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {member.role_name} · joined {formatDate(member.joined_at)}
                      </p>
                    </div>
                  </div>
                  {!isOwner && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full bg-zinc-900 text-zinc-400 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
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
      </div>
    </div>
  )
}
