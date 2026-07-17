// ============================================
// API CLIENT
// Talks to the Kinemium account/teams/friends API.
// Token-based auth (Bearer). Token stored client-side.
// ============================================

export const API_BASE = "https://msi.tail721598.ts.net"

const TOKEN_KEY = "kinemium_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

type RequestOptions = {
  method?: "GET" | "POST"
  body?: unknown
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"

  if (auth) {
    const token = getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Could not reach the server. Please try again.", 0)
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
      else if (data?.message) message = data.message
    } catch {
      const text = await res.text().catch(() => "")
      if (text) message = text
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

// ---- Types ----
export type TeamMember = {
  id: number
  username: string
  role_name: string
  joined_at: number
}

export type Friend = {
  id: number
  username: string
}

export type FriendRequest = {
  id: number
  from_user_id: number
  from_username: string
  created_at: number
}

// ---- User ----
export function register(username: string, email: string, password: string) {
  return request<{ id: number }>("/user/register", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  })
}

export function login(email: string, password: string) {
  return request<{ token: string }>("/user/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  })
}

// ---- Teams ----
export function createTeam(name: string) {
  return request<{ id: number }>("/team/create", { method: "POST", body: { name } })
}

export function createRole(team_id: number, name: string) {
  return request<{ id: number }>("/team/role/create", { method: "POST", body: { team_id, name } })
}

export function addTeamMember(team_id: number, email: string, role_id: number) {
  return request<unknown>("/team/member/add", { method: "POST", body: { team_id, email, role_id } })
}

export function removeTeamMember(team_id: number, user_id: number) {
  return request<unknown>("/team/member/remove", { method: "POST", body: { team_id, user_id } })
}

export function getTeamMembers(team_id: number) {
  return request<TeamMember[]>(`/team/members?team_id=${team_id}`)
}

// ---- Friends ----
export function sendFriendRequest(email: string) {
  return request<unknown>("/friend/request", { method: "POST", body: { email } })
}

export function getFriends() {
  return request<Friend[]>("/friend/list")
}

export function getFriendRequests() {
  return request<FriendRequest[]>("/friend/requests")
}

export function acceptFriendRequest(request_id: number) {
  return request<unknown>("/friend/accept", { method: "POST", body: { request_id } })
}

export function declineFriendRequest(request_id: number) {
  return request<unknown>("/friend/decline", { method: "POST", body: { request_id } })
}

export function removeFriend(friend_id: number) {
  return request<unknown>("/friend/remove", { method: "POST", body: { friend_id } })
}
