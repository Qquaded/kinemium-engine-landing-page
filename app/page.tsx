import { SmoothScroll } from "@/components/smooth-scroll"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { LogoMarquee } from "@/components/logo-marquee"
import { CodeExamples } from "@/components/code-examples"
import { BentoGrid } from "@/components/bento-grid"
import { GettingStarted } from "@/components/getting-started"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <Hero />
        <LogoMarquee />
        <CodeExamples />
        <BentoGrid />
        <GettingStarted />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
