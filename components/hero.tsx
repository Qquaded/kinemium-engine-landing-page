"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { siteConfig } from "@/config/site"

const textRevealVariants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.1,
    },
  }),
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={siteConfig.images.heroBg}
          alt={`${siteConfig.name} 3D Scene`}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/95 dark:from-zinc-950/95 via-zinc-50/80 dark:via-zinc-950/80 to-zinc-50/60 dark:to-zinc-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-zinc-50/50 dark:to-zinc-950/50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Alpha badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              {siteConfig.status}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            <span className="block overflow-hidden">
              <motion.span className="block" variants={textRevealVariants} initial="hidden" animate="visible" custom={0}>
                {siteConfig.hero.headline.line1}{" "}
                <span className="text-orange-500">{siteConfig.hero.headline.accent1}</span>{siteConfig.hero.headline.line1End}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-orange-500"
                variants={textRevealVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                {siteConfig.hero.headline.line2}
              </motion.span>
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 max-w-xl mb-10 leading-relaxed"
          >
            {siteConfig.hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg px-6 h-12 text-base font-semibold"
            >
              <a href={siteConfig.links.releases}>
                {siteConfig.hero.ctaPrimary}
              </a>
            </Button>
            <span className="px-4 py-2 bg-orange-500 text-zinc-900 dark:text-white font-bold rounded-lg text-base">
              {siteConfig.version}
            </span>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-lg px-6 h-12 text-base font-semibold border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 hover:border-orange-500 bg-transparent"
            >
              <a href={siteConfig.links.github}>
                <Github className="mr-2 w-4 h-4" />
                {siteConfig.hero.ctaSecondary}
              </a>
            </Button>
          </motion.div>

          {/* Links */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-sm text-zinc-600 dark:text-zinc-400"
          >
            Check out the{" "}
            <a href={siteConfig.links.gettingStarted} className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              getting started guide
            </a>
            {" "}or join the{" "}
            <a href={siteConfig.links.discord} className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              Discord community
            </a>
          </motion.p>
        </div>
      </div>
    </section>
  )
}
