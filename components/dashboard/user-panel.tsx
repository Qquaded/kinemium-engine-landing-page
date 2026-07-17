"use client"

import { LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/lib/use-auth"

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

export function UserPanel({ username }: { username: string }) {
  const logout = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-zinc-800"
          aria-label="Account menu"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-zinc-950">
            {initials(username)}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium text-zinc-100">{username}</span>
            <span className="text-xs text-green-400">Online</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-zinc-800 bg-zinc-900 text-zinc-100">
        <DropdownMenuLabel className="truncate">{username}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-zinc-100" disabled>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="text-red-400 focus:bg-zinc-800 focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
