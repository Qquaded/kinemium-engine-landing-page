"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 px-4">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
          {siteConfig.finalCta.title}
        </h2>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          {siteConfig.finalCta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="shimmer-btn bg-orange-500 text-zinc-900 dark:text-white hover:bg-orange-600 rounded-full px-8 h-14 text-base font-medium shadow-lg shadow-orange-500/20"
          >
            <a href={siteConfig.links.github}>
              {siteConfig.finalCta.ctaPrimary}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-14 text-base font-medium border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 hover:text-zinc-900 dark:text-white hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent"
          >
            <a href={siteConfig.links.discord}>{siteConfig.finalCta.ctaSecondary}</a>
          </Button>
        </div>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded text-orange-400">{siteConfig.finalCta.cloneCommand}</code>
        </p>
      </motion.div>
    </section>
  )
}
