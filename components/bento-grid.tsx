"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Code, Gamepad2, Users, Puzzle, Box, Cpu } from "lucide-react"
import { siteConfig } from "@/config/site"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Code,
  Users,
  Gamepad2,
  Puzzle,
  Box,
  Cpu,
}

function EditorPreview() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ["Script", "Properties", "Explorer"]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab, i) => (
        <motion.div
          key={tab}
          className={`px-2 py-1 text-xs rounded ${activeTab === i ? "bg-orange-500/20 text-orange-400" : "bg-zinc-800 text-zinc-500"}`}
          animate={activeTab === i ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {tab}
        </motion.div>
      ))}
    </div>
  )
}

function MultiplayerIndicator() {
  const [players, setPlayers] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => (prev === 5 ? 2 : prev + 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {Array.from({ length: players }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center"
          >
            <span className="text-[10px] text-zinc-400">P{i + 1}</span>
          </motion.div>
        ))}
      </div>
      <span className="text-xs text-zinc-500">{players} connected</span>
    </div>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {siteConfig.features.title}
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {siteConfig.features.subtitle}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large card - Built-in Editor */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
                  <Code className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Built-in Editor</h3>
                <p className="text-zinc-400 text-sm">
                  Script, build, and playtest without leaving the engine.
                </p>
              </div>
              <EditorPreview />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["--editor", "--server", "--client"].map((flag) => (
                <div key={flag} className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-sm font-mono text-orange-400 mb-1">{flag}</div>
                  <div className="text-xs text-zinc-500">Mode</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Multiplayer */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
              <Users className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multiplayer</h3>
            <p className="text-zinc-400 text-sm mb-6">Server/client architecture out of the box.</p>
            <MultiplayerIndicator />
          </motion.div>

          {/* Luau Scripting */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
              <Gamepad2 className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Luau Scripting</h3>
            <p className="text-zinc-400 text-sm mb-4">Familiar syntax with powerful features.</p>
            <div className="p-3 bg-zinc-800/50 rounded-lg font-mono text-xs text-zinc-300">
              <span className="text-orange-400">local</span> player = Players:GetPlayer()
            </div>
          </motion.div>

          {/* Modding Support */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
              <Puzzle className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mod Support</h3>
            <p className="text-zinc-400 text-sm mb-4">Let players extend your games.</p>
            <div className="flex items-center gap-2 text-orange-400 text-sm">
              <span className="font-mono">KinemiumModService</span>
            </div>
          </motion.div>

          {/* Physics */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
              <Box className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Physics Engines</h3>
            <p className="text-zinc-400 text-sm mb-4">Jolt, Box2D, and Manifold included.</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">3D</span>
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">2D</span>
            </div>
          </motion.div>

          {/* Cross Platform */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-4">
              <Cpu className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cross Platform</h3>
            <p className="text-zinc-400 text-sm mb-4">Windows, Linux, and macOS.</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">Windows</span>
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">Linux</span>
              <span className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400">macOS</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
