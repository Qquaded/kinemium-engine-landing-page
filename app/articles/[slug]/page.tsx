import { getArticleBySlug, getAllSlugs } from "@/lib/articles"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Tag, ArrowLeft, ExternalLink, Eye, Heart } from "lucide-react"
import { AuthorCard } from "@/components/author-card"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  if (slugs.length === 0) return [{ slug: '_empty' }]
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "Article Not Found" }
  return {
    title: `${article.title} — ${siteConfig.name}`,
    description: article.excerpt,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const forumUrl = `https://kinemiumengine.discourse.group/t/${article.slug}/${article.id}`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/articles"
            className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            All articles
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm text-zinc-900 dark:text-white truncate font-medium">
            {article.title}
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Article header */}
        <header className="mb-12">
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            {/* Author card (avatar + name + popover) */}
            <AuthorCard author={article.author} size="md" showName={true} />

            {/* Date */}
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
              <Calendar size={13} />
              {formatDate(article.date)}
            </span>

            {/* Stats */}
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
              <Eye size={13} />
              {article.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
              <Heart size={13} />
              {article.likes.toLocaleString()} likes
            </span>

            {/* Forum link pushed right */}
            <a
              href={forumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500 hover:text-orange-500 transition-colors ml-auto"
            >
              <ExternalLink size={13} />
              View on Forum
            </a>
          </div>
        </header>

        {/* Article body */}
        <div className="prose prose-zinc dark:prose-invert prose-orange max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800 prose-pre:rounded-xl
          prose-img:rounded-xl prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800
          prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-strong:text-zinc-900 dark:prose-strong:text-white
          prose-p:text-zinc-700 dark:prose-p:text-zinc-300
          prose-li:text-zinc-700 dark:prose-li:text-zinc-300
          prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Author bio card at bottom */}
        <div className="mt-16 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
          {/* Large avatar */}
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-zinc-100 dark:ring-zinc-800">
            {article.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.author.avatar} alt={article.author.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-lg">
                {article.author.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-zinc-900 dark:text-white">{article.author.username}</span>
              {article.author.title && (
                <span className="text-xs text-orange-500 font-medium">{article.author.title}</span>
              )}
            </div>
            {article.author.bio ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">{article.author.bio}</p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-500 italic mb-2">No bio available.</p>
            )}
            {article.author.url && (
              <a
                href={article.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-orange-500 transition-colors"
              >
                <ExternalLink size={11} />
                View Forum Profile
              </a>
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Articles
          </Link>
          <a
            href={forumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            Discuss on Forum
            <ExternalLink size={14} />
          </a>
        </div>
      </main>
    </div>
  )
}
