import type React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <img
              src={siteConfig.images.logo || "/placeholder.svg"}
              alt={siteConfig.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="font-semibold text-lg text-foreground">{siteConfig.name}</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground text-balance text-center">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center text-pretty">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">{children}</div>

        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </main>
  )
}
