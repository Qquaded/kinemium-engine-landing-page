"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Check, Loader2, UserPlus, UserX, X } from "lucide-react"
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

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

export function FriendsSection() {
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

  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSending(true)
    try {
      await sendFriendRequest(email.trim())
      setEmail("")
      setMessage({ type: "success", text: "Friend request sent." })
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Could not send request.",
      })
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

  return (
    <div className="flex flex-col gap-6">
      {/* Add friend */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
          <UserPlus className="h-4 w-4 text-primary" />
          Add a friend
        </h2>
        <form onSubmit={handleSend} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={sending} className="rounded-full">
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send request
          </Button>
        </form>
        {message && (
          <p
            className={`mt-3 text-sm ${
              message.type === "error" ? "text-destructive-foreground" : "text-primary"
            }`}
          >
            {message.text}
          </p>
        )}
      </section>

      {/* Incoming requests */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          Friend requests
          {requests && requests.length > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {requests.length}
            </span>
          )}
        </h2>

        {requestsLoading ? (
          <p className="text-sm text-muted-foreground">Loading requests…</p>
        ) : !requests || requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No incoming friend requests.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {requests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {initials(req.from_username)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.from_username}</p>
                    <p className="text-xs text-muted-foreground">wants to be your friend</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="default"
                    className="h-8 w-8 rounded-full"
                    disabled={busyId === req.id}
                    onClick={() => handleAccept(req.id)}
                    aria-label={`Accept request from ${req.from_username}`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-transparent"
                    disabled={busyId === req.id}
                    onClick={() => handleDecline(req.id)}
                    aria-label={`Decline request from ${req.from_username}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Friends list */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          Friends
          {friends && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {friends.length}
            </span>
          )}
        </h2>

        {friendsLoading ? (
          <p className="text-sm text-muted-foreground">Loading friends…</p>
        ) : !friends || friends.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have no friends yet. Send a request to get started.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {initials(friend.username)}
                  </div>
                  <p className="text-sm font-medium text-foreground">{friend.username}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive-foreground"
                  disabled={busyId === friend.id}
                  onClick={() => handleRemove(friend.id)}
                  aria-label={`Remove ${friend.username}`}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
