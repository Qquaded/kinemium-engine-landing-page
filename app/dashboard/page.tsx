"use client"

import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FriendsSection } from "@/components/dashboard/friends-section"
import { TeamsSection } from "@/components/dashboard/teams-section"
import { useAuthGuard } from "@/lib/use-auth"

export default function DashboardPage() {
  const ready = useAuthGuard()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the teams you belong to and the friends you&apos;re connected with.
          </p>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <TeamsSection />
          </TabsContent>

          <TabsContent value="friends">
            <FriendsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
