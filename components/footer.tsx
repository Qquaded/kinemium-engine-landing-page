"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src={siteConfig.images.logo} alt={siteConfig.name} className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-semibold text-zinc-900 dark:text-white">{siteConfig.name}</span>
            </a>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{siteConfig.tagline}</p>
            {/* License Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-orange-500 pulse-glow" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{siteConfig.footer.license}</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(siteConfig.footer.links).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{siteConfig.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <a href={siteConfig.links.github} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
              GitHub
            </a>
            <a href={siteConfig.links.discord} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
              Discord
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
