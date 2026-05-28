"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export function MarketplaceClient({ plugins }: { plugins: any[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("any")
  const [supportLevel, setSupportLevel] = useState({
    testing: false,
    community: false,
    featured: false
  })
  const [version, setVersion] = useState("any")
  const [license, setLicense] = useState("any")
  const [orderBy, setOrderBy] = useState("updated")
  const [reverse, setReverse] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState("20")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPlugins = useMemo(() => {
    let result = [...plugins]

    // 1. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.manifest?.name?.toLowerCase().includes(query) ||
        p.manifest?.description?.toLowerCase().includes(query) ||
        p.manifest?.author?.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
      )
    }

    // 2. Category filter
    if (category !== "any") {
      if (category === "scripts") {
        result = result.filter(p => 
          p.manifest?.intents?.includes("FFI") || 
          p.manifest?.keywords?.includes("scripts") || 
          p.slug.includes("discord") || 
          p.slug.includes("fart") || 
          p.slug.includes("oneko")
        )
      }
    }

    // 3. Support level (mock implementation based on keywords for now)
    const anySupportChecked = supportLevel.testing || supportLevel.community || supportLevel.featured
    if (anySupportChecked) {
      result = result.filter(p => {
        const isTesting = p.manifest?.keywords?.includes("testing") || p.manifest?.version?.includes("alpha") || p.manifest?.version?.includes("beta")
        const isFeatured = p.manifest?.keywords?.includes("featured")
        const isCommunity = !isFeatured // Default to community if not featured
        
        return (supportLevel.testing && isTesting) || 
               (supportLevel.community && isCommunity) || 
               (supportLevel.featured && isFeatured)
      })
    }

    // 4. Kinemium Version
    if (version !== "any") {
      result = result.filter(p => p.manifest?.engine?.minVersion === version)
    }

    // 5. License
    if (license !== "any") {
      result = result.filter(p => p.manifest?.license?.toLowerCase() === license.toLowerCase())
    }

    // 6. Sort
    result.sort((a, b) => {
      let dateA = a.updatedAt || a.generatedAt || ""
      let dateB = b.updatedAt || b.generatedAt || ""
      
      if (orderBy === "newest") {
        dateA = a.generatedAt || a.updatedAt || ""
        dateB = b.generatedAt || b.updatedAt || ""
      }
      
      return dateB.localeCompare(dateA) // Descending by default
    })

    // 7. Reverse
    if (reverse) {
      result.reverse()
    }

    return result
  }, [plugins, searchQuery, category, supportLevel, version, license, orderBy, reverse])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPlugins.length / parseInt(itemsPerPage)))
  // Ensure current page is valid
  const validCurrentPage = Math.min(currentPage, totalPages)
  
  const paginatedPlugins = filteredPlugins.slice(
    (validCurrentPage - 1) * parseInt(itemsPerPage),
    validCurrentPage * parseInt(itemsPerPage)
  )

  const handleSupportLevelChange = (key: keyof typeof supportLevel, checked: boolean) => {
    setSupportLevel(prev => ({ ...prev, [key]: checked }))
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8 mt-16">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-6 shrink-0">
          {/* Search */}
          <div className="flex gap-0">
            <Input 
              placeholder="Search for..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-r-none border-r-0 bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-500 h-10"
            />
            <Button className="rounded-l-none bg-[#f97316] hover:bg-[#ea580c] text-white border-none h-10 font-bold px-5">
              Search
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Category</Label>
              <Select value={category} onValueChange={(val) => { setCategory(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="scripts">Scripts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Support level</Label>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="testing" 
                    checked={supportLevel.testing}
                    onCheckedChange={(checked) => handleSupportLevelChange('testing', checked as boolean)}
                    className="border-zinc-300 dark:border-zinc-700 bg-transparent data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-700 data-[state=checked]:text-white rounded-[4px]" 
                  />
                  <Label htmlFor="testing" className="font-medium text-[13px] text-zinc-700 dark:text-zinc-200 cursor-pointer">Testing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="community" 
                    checked={supportLevel.community}
                    onCheckedChange={(checked) => handleSupportLevelChange('community', checked as boolean)}
                    className="border-zinc-300 dark:border-zinc-700 bg-transparent data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-700 data-[state=checked]:text-white rounded-[4px]" 
                  />
                  <Label htmlFor="community" className="font-medium text-[13px] text-zinc-700 dark:text-zinc-200 cursor-pointer">Community</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={supportLevel.featured}
                    onCheckedChange={(checked) => handleSupportLevelChange('featured', checked as boolean)}
                    className="border-zinc-300 dark:border-zinc-700 bg-transparent data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-700 data-[state=checked]:text-white rounded-[4px]" 
                  />
                  <Label htmlFor="featured" className="font-medium text-[13px] text-zinc-700 dark:text-zinc-200 cursor-pointer">Featured</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Kinemium version</Label>
              <Select value={version} onValueChange={(val) => { setVersion(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">License</Label>
              <Select value={license} onValueChange={(val) => { setLicense(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="mit">MIT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Order by</Label>
              <Select value={orderBy} onValueChange={(val) => { setOrderBy(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 h-9">
                  <SelectValue placeholder="Updated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-0.5">
              <Checkbox 
                id="reverse" 
                checked={reverse}
                onCheckedChange={(checked) => { setReverse(checked as boolean); setCurrentPage(1); }}
                className="border-zinc-300 dark:border-zinc-700 bg-transparent data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-700 data-[state=checked]:text-white rounded-[4px]" 
              />
              <Label htmlFor="reverse" className="font-medium text-[13px] text-zinc-700 dark:text-zinc-200 cursor-pointer">Reverse</Label>
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Items per page</Label>
              <Select value={itemsPerPage} onValueChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 h-9">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-1">
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-0.5">ASSETS</p>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Showing all {filteredPlugins.length} published assets.</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold tracking-wide text-zinc-700 dark:text-zinc-300">
              <span className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1">{plugins.length} total</span>
              <span className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1">{filteredPlugins.length} visible</span>
              <span className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1">Updated 2026-05-28 06:32</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {paginatedPlugins.map((plugin) => {
              const imageUrl = plugin.assets?.thumbnailUrl 
                  ? `https://quadigen.github.io/Kinemium-Engine-Plugins/${plugin.assets.thumbnailUrl}`
                  : plugin.assets?.iconUrl 
                    ? `https://quadigen.github.io/Kinemium-Engine-Plugins/${plugin.assets.iconUrl}`
                    : null
              const iconUrl = plugin.assets?.iconUrl 
                  ? `https://quadigen.github.io/Kinemium-Engine-Plugins/${plugin.assets.iconUrl}`
                  : null

              return (
                <Link href={`/marketplace/${plugin.slug}`} key={plugin.slug} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group">
                  {/* Left Side: Thumbnail */}
                  <div className="w-full sm:w-[150px] h-[150px] shrink-0 bg-zinc-100 dark:bg-[#09090b] rounded-xl overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt={plugin.manifest?.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-zinc-400 dark:text-zinc-700" />
                    )}
                  </div>
                  
                  {/* Right Side: Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        {iconUrl && <img src={iconUrl} alt="icon" className="w-7 h-7 rounded-md object-contain bg-zinc-200 dark:bg-zinc-900" />}
                        <h3 className="font-bold text-[17px] leading-tight text-zinc-900 dark:text-zinc-100 flex-1">{plugin.manifest?.name}</h3>
                        
                        <div className="flex flex-wrap gap-1.5 ml-auto justify-end max-w-[140px]">
                          {plugin.manifest?.intents?.includes("FFI") || plugin.manifest?.keywords?.includes("scripts") || plugin.slug.includes("discord") || plugin.slug.includes("fart") || plugin.slug.includes("oneko") ? (
                            <span className="bg-zinc-100 dark:bg-[#3f3f46] text-zinc-600 dark:text-zinc-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px]">Scripts</span>
                          ) : null}
                          {plugin.manifest?.license && (
                            <span className="bg-zinc-100 dark:bg-[#3f3f46] text-zinc-600 dark:text-zinc-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px]">{plugin.manifest.license}</span>
                          )}
                          <span className="bg-zinc-100 dark:bg-[#3f3f46] text-zinc-600 dark:text-zinc-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px]">Community</span>
                        </div>
                      </div>
                      
                      <p className="text-[13px] text-zinc-600 dark:text-zinc-400 line-clamp-3 mt-3 pr-2">
                        {plugin.manifest?.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-[12px] font-medium">
                      <div className="flex items-center">
                        <span className="text-zinc-500 mr-1.5">by</span>
                        <span className="text-blue-600 dark:text-[#3b82f6] hover:underline cursor-pointer">{plugin.manifest?.author}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" />
                          <span>0</span>
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-400">{plugin.updatedAt ? plugin.updatedAt.split("T")[0] : "2026-05-28"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
            
            {paginatedPlugins.length === 0 && (
              <div className="col-span-1 xl:col-span-2 py-12 text-center text-zinc-500">
                No plugins match your current filters.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="bg-white dark:bg-[#18181b] border-zinc-200 dark:border-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#27272a] h-9 px-4 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 px-2">Page {validCurrentPage} of {totalPages}</span>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="bg-white dark:bg-[#18181b] border-zinc-200 dark:border-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#27272a] h-9 px-4 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
