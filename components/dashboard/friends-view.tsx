"use client"

import type React from "react"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Check, Loader2, MessageCircle, Search, UserPlus, UserX, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  ApiError,
  type Friend,
  type FriendRequest,
} from "@/lib/api"

type SubTab = "online" | "all" | "pending" | "add"

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

const TABS: { key: SubTab; label: string }[] = [
  { key: "online", label: "Online" },
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
]

export function FriendsView() {
  const {
    data: friends,
    isLoading: friendsLoading,
    mutate: mutateFriends,
  } = useSWR<Friend[]>("friends", getFriends)
  const {
    data: requests,
    isLoading: requestsLoading,
    mutate: mutateRequests,
  } = useSWR<FriendRequest[]>("friend-requests", getFriendRequests)

  const [tab, setTab] = useState<SubTab>("online")
  const [search, setSearch] = useState("")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const filteredFriends = useMemo(() => {
    const list = friends ?? []
    if (!search.trim()) return list
    return list.filter((f) => f.username.toLowerCase().includes(search.trim().toLowerCase()))
  }, [friends, search])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSending(true)
    try {
      await sendFriendRequest(email.trim())
      setEmail("")
      setMessage({ type: "success", text: "Friend request sent." })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not send request." })
    } finally {
      setSending(false)
    }
  }

  async function handleAccept(id: number) {
    setBusyId(id)
    try {
      await acceptFriendRequest(id)
      await Promise.all([mutateRequests(), mutateFriends()])
    } finally {
      setBusyId(null)
    }
  }

  async function handleDecline(id: number) {
    setBusyId(id)
    try {
      await declineFriendRequest(id)
      await mutateRequests()
    } finally {
      setBusyId(null)
    }
  }

  async function handleRemove(id: number) {
    setBusyId(id)
    try {
      await removeFriend(id)
      await mutateFriends()
    } finally {
      setBusyId(null)
    }
  }

  const pendingCount = requests?.length ?? 0

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2 pr-3 text-sm font-semibold text-zinc-100">
          <Users className="h-5 w-5 text-zinc-400" />
          Friends
        </div>
        <div className="hidden h-6 w-px bg-zinc-800 sm:block" />
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            {t.label}
            {t.key === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => setTab("add")}
          className={`rounded-md px-2.5 py-1 text-sm font-semibold transition-colors ${
            tab === "add" ? "bg-orange-500 text-zinc-950" : "bg-orange-500 text-zinc-950 hover:bg-orange-600"
          }`}
        >
          Add Friend
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "add" ? (
          <div className="mx-auto max-w-2xl">
            <h2 className="text-base font-semibold text-zinc-100">Add Friend</h2>
            <p className="mt-1 text-sm text-zinc-400">You can add friends with their email address.</p>
            <form
              onSubmit={handleSend}
              className="mt-4 flex flex-col gap-3 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-zinc-700 bg-transparent text-zinc-100 placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                disabled={sending}
                className="rounded-md bg-orange-500 text-zinc-950 hover:bg-orange-600"
              >
                {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Friend Request
              </Button>
            </form>
            {message && (
              <p className={`mt-3 text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
                {message.text}
              </p>
            )}
          </div>
        ) : tab === "pending" ? (
          <PendingList
            requests={requests}
            loading={requestsLoading}
            busyId={busyId}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ) : (
          <div>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-zinc-700 bg-zinc-950/60 pl-9 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {tab === "online" ? "Online" : "All Friends"} — {filteredFriends.length}
            </p>
            {friendsLoading ? (
              <p className="px-1 text-sm text-zinc-400">Loading friends…</p>
            ) : filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="mb-3 h-10 w-10 text-zinc-700" />
                <p className="text-sm text-zinc-400">No one&apos;s around to play with Wumpus.</p>
                <p className="text-xs text-zinc-600">Add a friend to get started.</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {filteredFriends.map((friend) => (
                  <li
                    key={friend.id}
                    className="group flex items-center justify-between gap-3 rounded-lg border-t border-zinc-800 px-2 py-3 hover:bg-zinc-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-100">
                        {initials(friend.username)}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{friend.username}</p>
                        <p className="text-xs text-zinc-400">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-400"
                        aria-hidden
                      >
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full bg-zinc-900 text-zinc-400 hover:text-red-400"
                        disabled={busyId === friend.id}
                        onClick={() => handleRemove(friend.id)}
                        aria-label={`Remove ${friend.username}`}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PendingList({
  requests,
  loading,
  busyId,
  onAccept,
  onDecline,
}: {
  requests: FriendRequest[] | undefined
  loading: boolean
  busyId: number | null
  onAccept: (id: number) => void
  onDecline: (id: number) => void
}) {
  if (loading) return <p className="px-1 text-sm text-zinc-400">Loading requests…</p>
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <UserPlus className="mb-3 h-10 w-10 text-zinc-700" />
        <p className="text-sm text-zinc-400">There are no pending friend requests.</p>
      </div>
    )
  }
  return (
    <>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Pending — {requests.length}
      </p>
      <ul className="flex flex-col">
        {requests.map((req) => (
          <li
            key={req.id}
            className="flex items-center justify-between gap-3 rounded-lg border-t border-zinc-800 px-2 py-3 hover:bg-zinc-800/60"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-100">
                {req.from_username.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-100">{req.from_username}</p>
                <p className="text-xs text-zinc-400">Incoming friend request</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-zinc-900 text-green-400 hover:bg-zinc-900 hover:text-green-300"
                disabled={busyId === req.id}
                onClick={() => onAccept(req.id)}
                aria-label={`Accept request from ${req.from_username}`}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-red-400"
                disabled={busyId === req.id}
                onClick={() => onDecline(req.id)}
                aria-label={`Decline request from ${req.from_username}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
