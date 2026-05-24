"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { siteConfig } from "@/config/site"

export function GettingStarted() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [expandedStep, setExpandedStep] = useState<number | null>(0)
  const [showModes, setShowModes] = useState(false)

  const { steps, executionModes, prerequisites } = siteConfig.gettingStarted

  return (
    <section ref={ref} id="getting-started" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {siteConfig.gettingStarted.title}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {siteConfig.gettingStarted.subtitle}
          </p>
        </motion.div>

        {/* Prerequisites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Prerequisites</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {prerequisites.map((prereq) => (
                <div key={prereq.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">{prereq.initial}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{prereq.name}</p>
                    <p className="text-zinc-500 text-xs">{prereq.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-sm mt-4">
              Zune and darklua are installed automatically via Rokit.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-zinc-800/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <span className="text-white font-medium flex-1">{step.title}</span>
                {expandedStep === index ? (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              {expandedStep === index && (
                <div className="px-4 pb-4 pl-16">
                  {step.isCode ? (
                    <div className="bg-zinc-950 rounded-lg p-3 font-mono text-sm text-orange-400 overflow-x-auto">
                      {step.content}
                    </div>
                  ) : (
                    <p className="text-zinc-400 text-sm">{step.content}</p>
                  )}
                  {step.description && (
                    <p className="text-zinc-500 text-sm mt-2">{step.description}</p>
                  )}
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-400 text-sm mt-2 hover:underline"
                    >
                      View installation guide <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Execution Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => setShowModes(!showModes)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
          >
            <span className="text-white font-medium">Execution Modes</span>
            {showModes ? (
              <ChevronDown className="w-5 h-5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-zinc-500" />
            )}
          </button>
          {showModes && (
            <div className="mt-3 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-3 text-zinc-400 font-medium">Flag</th>
                    <th className="text-left p-3 text-zinc-400 font-medium">Mode</th>
                    <th className="text-left p-3 text-zinc-400 font-medium hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {executionModes.map((mode, index) => (
                    <tr key={index} className="border-b border-zinc-800/50 last:border-0">
                      <td className="p-3 font-mono text-orange-400">{mode.flag}</td>
                      <td className="p-3 text-white">{mode.mode}</td>
                      <td className="p-3 text-zinc-500 hidden sm:table-cell">{mode.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* DeepWiki Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href={siteConfig.links.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Read full documentation on DeepWiki <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
