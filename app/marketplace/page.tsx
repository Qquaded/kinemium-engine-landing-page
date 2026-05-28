import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarketplaceClient } from "./marketplace-client"

const PLUGINS_URL = "https://quadigen.github.io/Kinemium-Engine-Plugins/plugins.json"

export default async function MarketplacePage() {
  let plugins = []
  try {
    const res = await fetch(PLUGINS_URL, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error("Failed to fetch plugins")
    const data = await res.json()
    plugins = data.plugins || []
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mt-10">
        <MarketplaceClient plugins={plugins} />
      </main>
      <Footer />
    </div>
  )
}
