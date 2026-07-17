"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/config/site"
import { useLogout } from "@/lib/use-auth"

export function DashboardHeader() {
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img
            src={siteConfig.images.logo || "/placeholder.svg"}
            alt={siteConfig.name}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="hidden font-semibold text-foreground sm:block">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={logout}>
            <LogOut className="mr-1.5 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
