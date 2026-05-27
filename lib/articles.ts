import fs from 'fs'
import path from 'path'

export interface ArticleAuthor {
  username: string
  title: string
  bio: string
  avatar: string
  url: string
  isAdmin: boolean
  isModerator: boolean
}

export interface Article {
  id: number
  title: string
  slug: string
  date: string
  author: ArticleAuthor
  excerpt: string
  tags: string[]
  views: number
  likes: number
  content: string
}

export interface ArticleMeta {
  id: number
  title: string
  slug: string
  date: string
  author: ArticleAuthor
  excerpt: string
  tags: string[]
  views: number
  likes: number
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles')

/** Parse raw frontmatter YAML (simple key: value parser, no external dep) */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const frontmatter = match[1]
  const content = match[2].trim()
  const data: Record<string, unknown> = {}

  let currentKey = ''
  let currentList: string[] | null = null

  for (const line of frontmatter.split('\n')) {
    const listMatch = line.match(/^  - (.+)$/)
    if (listMatch && currentKey) {
      if (!currentList) {
        currentList = []
        data[currentKey] = currentList
      }
      currentList.push(listMatch[1].trim())
      continue
    }

    currentList = null
    const kvMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (!kvMatch) continue

    currentKey = kvMatch[1]
    const raw = kvMatch[2].trim()
    // Parse booleans
    if (raw === 'true') { data[currentKey] = true; continue }
    if (raw === 'false') { data[currentKey] = false; continue }
    // Parse numbers
    if (/^\d+$/.test(raw)) { data[currentKey] = Number(raw); continue }
    // Strip surrounding quotes
    data[currentKey] = raw.replace(/^"(.*)"$/, '$1')
  }

  return { data, content }
}

/** Read and parse a single article file */
function parseFile(filePath: string): Article | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = parseFrontmatter(raw)

    const author: ArticleAuthor = {
      username: String(data.author || ''),
      title: String(data.authorTitle || ''),
      bio: String(data.authorBio || ''),
      avatar: String(data.authorAvatar || ''),
      url: String(data.authorUrl || ''),
      isAdmin: Boolean(data.isAdmin),
      isModerator: Boolean(data.isModerator),
    }

    return {
      id: Number(data.id) || 0,
      title: String(data.title || ''),
      slug: String(data.slug || ''),
      date: String(data.date || ''),
      author,
      excerpt: String(data.excerpt || ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      views: Number(data.views) || 0,
      likes: Number(data.likes) || 0,
      content,
    }
  } catch {
    return null
  }
}

/** Get all articles sorted by date descending */
export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))

  return files
    .map(f => parseFile(path.join(CONTENT_DIR, f)))
    .filter((a): a is Article => a !== null && a.title !== '')
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Get a single article by its slug */
export function getArticleBySlug(slug: string): Article | null {
  if (!fs.existsSync(CONTENT_DIR)) return null

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const article = parseFile(path.join(CONTENT_DIR, file))
    if (article && article.slug === slug) return article
  }
  return null
}

/** Get all article slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug)
}
