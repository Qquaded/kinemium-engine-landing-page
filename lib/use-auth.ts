"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, clearToken } from "@/lib/api"

// Guards a page: redirects to /login when no token is present.
export function useAuthGuard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  return ready
}

export function useLogout() {
  const router = useRouter()
  return () => {
    clearToken()
    router.replace("/login")
  }
}

// Reactively reports whether a token exists in this browser.
// Used by the marketing navbar so returning users see a logged-in state.
export function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const update = () => setLoggedIn(Boolean(getToken()))
    update()
    window.addEventListener("storage", update)
    window.addEventListener("focus", update)
    return () => {
      window.removeEventListener("storage", update)
      window.removeEventListener("focus", update)
    }
  }, [])

  return loggedIn
}

// ---- Local team tracking ----
// The API has no "list my teams" endpoint, so we remember the teams
// a user creates or chooses to track in this browser.
const TEAMS_KEY = "kinemium_teams"

export type TrackedTeam = { id: number; name: string }

export function getTrackedTeams(): TrackedTeam[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(TEAMS_KEY)
    return raw ? (JSON.parse(raw) as TrackedTeam[]) : []
  } catch {
    return []
  }
}

export function saveTrackedTeams(teams: TrackedTeam[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TEAMS_KEY, JSON.stringify(teams))
}

export function addTrackedTeam(team: TrackedTeam): TrackedTeam[] {
  const teams = getTrackedTeams()
  if (teams.some((t) => t.id === team.id)) return teams
  const next = [...teams, team]
  saveTrackedTeams(next)
  return next
}

export function removeTrackedTeam(id: number): TrackedTeam[] {
  const next = getTrackedTeams().filter((t) => t.id !== id)
  saveTrackedTeams(next)
  return next
}
