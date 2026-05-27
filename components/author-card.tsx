"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ShieldCheck, ExternalLink } from "lucide-react"
import type { ArticleAuthor } from "@/lib/articles"

interface AuthorCardProps {
  author: ArticleAuthor
  size?: "sm" | "md" | "lg"
  showName?: boolean
}

export function AuthorCard({ author, size = "md", showName = true }: AuthorCardProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const avatarSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8"
  const textSize = size === "sm" ? "text-xs" : "text-sm"

  const badge =
    author.isAdmin
      ? { label: "Admin", icon: ShieldCheck, color: "text-orange-500" }
      : author.isModerator
      ? { label: "Moderator", icon: Shield, color: "text-blue-500" }
      : null

  return (
    <div ref={ref} className="relative inline-flex items-center gap-2">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`${avatarSize} rounded-full ring-2 ring-transparent hover:ring-orange-500/60 transition-all duration-200 shrink-0 overflow-hidden`}
        aria-label={`View profile of ${author.username}`}
      >
        {author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatar}
            alt={author.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
            {author.username[0]?.toUpperCase()}
          </div>
        )}
      </button>

      {/* Name */}
      {showName && (
        <button
          onClick={() => setOpen(v => !v)}
          className={`${textSize} font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors`}
        >
          {author.username}
        </button>
      )}

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/50 overflow-hidden"
          >
            {/* Card background accent */}
            <div className="h-10 bg-gradient-to-r from-orange-500/20 to-orange-600/5" />

            <div className="px-4 pb-4 -mt-5">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-zinc-900 overflow-hidden mb-2">
                {author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={author.avatar} alt={author.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                    {author.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name + badge */}
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {author.username}
                </span>
                {badge && (
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${badge.color}`}>
                    <badge.icon size={11} />
                    {badge.label}
                  </span>
                )}
              </div>

              {/* Title */}
              {author.title && (
                <p className="text-xs text-orange-500 font-medium mb-2">{author.title}</p>
              )}

              {/* Bio */}
              {author.bio && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {/* Forum profile link */}
              {author.url && (
                <a
                  href={author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-orange-500 transition-colors"
                >
                  <ExternalLink size={11} />
                  View Forum Profile
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
