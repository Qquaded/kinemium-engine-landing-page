"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { siteConfig } from "@/config/site"

function highlightLuau(code: string) {
  const keywords = ["local", "function", "if", "then", "end", "return", "true", "false", "nil", "and", "or", "not"]
  const builtins = ["Instance", "Vector3", "Color3", "Enum", "workspace", "game", "print"]

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")

  return escape(code)
    // strings first (safe isolation)
    .replace(/"([^"]*)"/g, (_, str) =>
      `<span class="text-emerald-400">"${str}"</span>`
    )

    // comments
    .replace(/--(.*)/g, (_, c) =>
      `<span class="text-zinc-500 dark:text-zinc-400">--${c}</span>`
    )

    // keywords (word-safe)
    .replace(new RegExp(`\\b(${keywords.join("|")})\\b`, "g"),
      '<span class="text-purple-400">$1</span>'
    )

    // builtins
    .replace(new RegExp(`\\b(${builtins.join("|")})\\b`, "g"),
      '<span class="text-orange-400">$1</span>'
    )
}

export function CodeExamples() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeExample, setActiveExample] = useState(0)

  const examples = siteConfig.codeExamples.examples

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            {siteConfig.codeExamples.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {siteConfig.codeExamples.subtitle}
          </p>
        </motion.div>

        {/* Example tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-2 mb-6 justify-center"
        >
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeExample === index
                  ? "bg-orange-500 text-zinc-900 dark:text-white"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:bg-zinc-700 hover:text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {example.title}
            </button>
          ))}
        </motion.div>

        {/* Example content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Image preview */}
          <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <Image
              src={examples[activeExample].image}
              alt={examples[activeExample].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 dark:from-zinc-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-200/ dark:bg-zinc-800/80 backdrop-blur-sm rounded-full text-xs text-zinc-700 dark:text-zinc-300">
                {examples[activeExample].description}
              </span>
            </div>
          </div>

          {/* Code block */}
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-100/ dark:bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">script.luau</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightLuau(examples[activeExample].code),
                }}
              />
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
