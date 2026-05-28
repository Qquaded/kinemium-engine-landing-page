import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { Calendar, Tag, ArrowRight, Rss, Eye, Heart } from "lucide-react"
import { AuthorCard } from "@/components/author-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `Articles — ${siteConfig.name}`,
  description: `News, updates, and announcements from the ${siteConfig.name} team.`,
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            From the team
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
            Articles & Announcements
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
            Engine updates, release notes, and developer news — synced automatically from the{" "}
            <a
              href="https://kinemiumengine.discourse.group/c/announcements/8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 underline underline-offset-2"
            >
              Kinemium Forums
            </a>
            .
          </p>
        </div>

        {/* Articles list */}
        {articles.length === 0 ? (
          <div className="text-center py-24 text-zinc-500 dark:text-zinc-600">
            <p className="text-lg">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, i) => (
              <div key={article.id} className="group relative">
                <article className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                  {/* Accent line */}
                  <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Index number */}
                    <span className="hidden sm:block text-2xl font-bold text-zinc-200 dark:text-zinc-800 select-none w-10 shrink-0 pt-0.5 text-right">
                      {String(articles.length - i).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <Link href={`/articles/${article.slug}`}>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {/* Author with avatar */}
                        <AuthorCard author={article.author} size="sm" showName={true} />

                        <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                          <Calendar size={11} />
                          {formatDate(article.date)}
                        </span>

                        {/* Stats */}
                        <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500">
                          <Eye size={11} />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500">
                          <Heart size={11} />
                          {article.likes.toLocaleString()}
                        </span>

                        {/* Tags */}
                        {article.tags.length > 0 && (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                            <Tag size={11} />
                            {article.tags.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <ArrowRight
                        size={18}
                        className="text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1"
                      />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
