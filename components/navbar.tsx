"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/config/site"

export function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl"
    >
      <nav
        ref={navRef}
        className="relative flex items-center justify-between px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-100/ dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800"
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src={siteConfig.images.logo} alt={siteConfig.name} className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-semibold text-zinc-900 dark:text-white hidden sm:block">{siteConfig.name}</span>
        </a>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 relative">
          {siteConfig.navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="relative px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="shimmer-btn bg-orange-500 text-zinc-900 dark:text-white hover:bg-orange-600 rounded-full px-4"
          >
            <a href={"https://kinemiumengine.discourse.group/t/guide-to-running-kinemium-engine/25"}>Get Started</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-100/ dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-200 dark:bg-zinc-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <hr className="border-zinc-200 dark:border-zinc-800 my-2" />
            <Button asChild className="shimmer-btn bg-orange-500 text-zinc-900 dark:text-white hover:bg-orange-600 rounded-full">
              <a href={siteConfig.links.github}>Get Started</a>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
