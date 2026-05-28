import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Heart, Bookmark, MoreVertical, ShieldCheck, Gamepad2, FileCheck2, User, ChevronRight } from "lucide-react"
import Link from "next/link"

const PLUGINS_URL = "https://quadigen.github.io/Kinemium-Engine-Plugins/plugins.json"

export async function generateStaticParams() {
  try {
    const res = await fetch(PLUGINS_URL)
    const data = await res.json()
    return (data.plugins || []).map((plugin: any) => ({
      slug: plugin.slug,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function PluginDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let plugin = null
  try {
    const res = await fetch(PLUGINS_URL, { next: { revalidate: 3600 } })
    const data = await res.json()
    plugin = (data.plugins || []).find((p: any) => p.slug === resolvedParams.slug)
  } catch (error) {
    console.error(error)
  }

  if (!plugin) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-1 mt-24 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Plugin not found</h1>
          <Link href="/marketplace">
            <Button variant="outline" className="bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              Back to Marketplace
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const iconUrl = plugin.assets?.iconUrl 
    ? `https://quadigen.github.io/Kinemium-Engine-Plugins/${plugin.assets.iconUrl}`
    : null

  const intents = plugin.manifest?.intents || []
  const keywords = plugin.manifest?.keywords || []

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            <Link href="/marketplace" className="hover:text-zinc-900 dark:hover:text-zinc-200">Marketplace</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-zinc-900 dark:text-zinc-200">{plugin.manifest?.name}</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/60">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                {iconUrl ? (
                  <img src={iconUrl} alt={plugin.manifest?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{plugin.manifest?.name}</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">{plugin.manifest?.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>0</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {intents.includes("FFI") || keywords.includes("scripts") ? (
                      <span className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full text-xs">Scripts</span>
                    ) : null}
                    <span className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full text-xs">Community</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a href={plugin.manifest?.repository || plugin.manifest?.homepage || "#"} target="_blank" rel="noreferrer">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download
                </Button>
              </a>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Left Content Area */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 bg-white dark:bg-[#18181b] w-fit p-1 rounded-full border border-zinc-200 dark:border-zinc-800/60">
                <button className="px-5 py-2 text-sm font-semibold rounded-full bg-orange-500/20 text-orange-500">
                  Description
                </button>
              </div>

              {/* Markdown-like Content */}
              <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-8 text-zinc-700 dark:text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">About {plugin.manifest?.name}</h2>
                <div className="space-y-6 leading-relaxed">
                  <p>
                    {plugin.manifest?.description}
                  </p>
                  <p>
                    This plugin is developed by <strong>{plugin.manifest?.author}</strong> and currently sits at version <code>{plugin.manifest?.version}</code>. 
                    It operates under the {plugin.manifest?.license} license.
                  </p>
                  
                  {plugin.manifest?.homepage && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Links</h3>
                      <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-400">
                        <li>
                          <a href={plugin.manifest.homepage} target="_blank" rel="noreferrer" className="hover:underline">
                            Homepage
                          </a>
                        </li>
                        {plugin.manifest.repository && plugin.manifest.repository !== plugin.manifest.homepage && (
                          <li>
                            <a href={plugin.manifest.repository} target="_blank" rel="noreferrer" className="hover:underline">
                              Repository
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {intents.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Required Intents</h3>
                      <div className="flex flex-wrap gap-2">
                        {intents.map((intent: string) => (
                          <span key={intent} className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-md text-sm">
                            {intent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Compatibility */}
              <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Compatibility</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Kinemium Engine</h4>
                  <span className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                    {plugin.manifest?.engine?.minVersion ? `>= ${plugin.manifest.engine.minVersion}` : "Any"}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 bg-[#4f46e5]/10 border border-[#4f46e5]/20 text-[#818cf8] text-xs px-2.5 py-1 rounded-md font-medium">
                      <Gamepad2 className="w-3.5 h-3.5" /> Windows
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#4f46e5]/10 border border-[#4f46e5]/20 text-[#818cf8] text-xs px-2.5 py-1 rounded-md font-medium">
                      <Gamepad2 className="w-3.5 h-3.5" /> Linux
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Supported environments</h4>
                  <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 text-xs px-2.5 py-1 rounded-full w-fit">
                    <ShieldCheck className="w-3.5 h-3.5" /> Client and server
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword: string) => (
                    <span key={keyword} className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 text-xs px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                  {keywords.length === 0 && (
                    <span className="text-sm text-zinc-500 dark:text-zinc-500">No tags specified</span>
                  )}
                </div>
              </div>

              {/* Creators */}
              <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Creators</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-200">{plugin.manifest?.author}</span>
                      <span className="text-yellow-500 text-xs">👑</span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">Owner</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Details</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <FileCheck2 className="w-4 h-4 text-zinc-500 dark:text-zinc-500" />
                  <span>Licensed under <strong className="text-blue-600 dark:text-blue-400">{plugin.manifest?.license || "Custom"}</strong></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
