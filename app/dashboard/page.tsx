"use client"

import { Loader2 } from "lucide-react"
import { DashboardApp } from "@/components/dashboard/dashboard-app"
import { useAuthGuard } from "@/lib/use-auth"

export default function DashboardPage() {
  const ready = useAuthGuard()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return <DashboardApp />
}
