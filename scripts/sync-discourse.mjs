#!/usr/bin/env node
// scripts/sync-discourse.mjs
// Syncs posts from a Discourse category to local markdown files.
// Run: node scripts/sync-discourse.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── Configuration ────────────────────────────────────────────────────────────
const DISCOURSE_BASE = 'https://kinemiumengine.discourse.group'
const CATEGORY_ID = 8          // announcements category id
const CATEGORY_SLUG = 'announcements'
const CONTENT_DIR = path.join(ROOT, 'content', 'articles')
const IMAGES_DIR = path.join(ROOT, 'public', 'articles')
// ─────────────────────────────────────────────────────────────────────────────

/** Ensure required directories exist */
function ensureDirs() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

/** Fetch JSON from a Discourse endpoint */
async function discourseGet(path) {
  const url = `${DISCOURSE_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'KinemiumSiteSync/1.0' }
  })
  if (!res.ok) throw new Error(`Discourse API error: ${res.status} ${url}`)
  return res.json()
}

/** Slugify a title for use in URLs */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Download an image URL and save it locally.
 * Returns the local public path (e.g. /articles/filename.jpg).
 */
async function downloadImage(imageUrl, articleId) {
  try {
    // Handle Discourse-relative URLs
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${DISCOURSE_BASE}${imageUrl}`
    const res = await fetch(fullUrl)
    if (!res.ok) return imageUrl

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
    // Use URL hash for uniqueness to avoid filename collisions
    const hash = Buffer.from(fullUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
    const filename = `${articleId}-${hash}.${ext}`
    const localPath = path.join(IMAGES_DIR, filename)

    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(localPath, buffer)
    console.log(`  ↓ Image saved: ${filename}`)
    return `/articles/${filename}`
  } catch (e) {
    console.warn(`  ⚠ Failed to download image: ${imageUrl} — ${e.message}`)
    return imageUrl
  }
}

/**
 * Scan cooked HTML / raw markdown for image URLs and download them.
 * Returns the content with rewritten URLs pointing to local copies.
 */
async function processImages(content, articleId) {
  // Match markdown images: ![alt](url)
  const mdImageRe = /!\[([^\]]*)\]\(([^)]+)\)/g
  // Match raw <img src="..."> tags
  const htmlImageRe = /<img[^>]+src="([^"]+)"/g

  const urlsToReplace = new Map()

  let match
  while ((match = mdImageRe.exec(content)) !== null) {
    const url = match[2].split(' ')[0] // strip optional title
    if (!urlsToReplace.has(url)) urlsToReplace.set(url, null)
  }
  while ((match = htmlImageRe.exec(content)) !== null) {
    const url = match[1]
    if (!urlsToReplace.has(url)) urlsToReplace.set(url, null)
  }

  // Download each unique URL
  for (const [url] of urlsToReplace) {
    const localUrl = await downloadImage(url, articleId)
    urlsToReplace.set(url, localUrl)
  }

  // Replace all occurrences in the content
  let result = content
  for (const [original, local] of urlsToReplace) {
    if (original !== local) {
      result = result.split(original).join(local)
    }
  }
  return result
}

/**
 * Convert Discourse's cooked HTML to something React-Markdown can render.
 * Discourse posts are stored as HTML (cooked) but we use the raw field when available.
 */
function convertCookedToMarkdown(cooked) {
  // Replace common Discourse HTML patterns with markdown equivalents
  return cooked
    // Basic block elements
    .replace(/<p>([\s\S]*?)<\/p>/g, '$1\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')
    // Headings
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    // Links and images
    .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/g, '![$2]($1)')
    .replace(/<img[^>]+src="([^"]+)"[^>]*\/?>/g, '![]($1)')
    // Lists
    .replace(/<ul>([\s\S]*?)<\/ul>/g, '$1')
    .replace(/<ol>([\s\S]*?)<\/ol>/g, '$1')
    .replace(/<li>([\s\S]*?)<\/li>/g, '- $1\n')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Build a YAML frontmatter + markdown file */
function buildMarkdownFile({ id, title, slug, date, tags, excerpt, author, authorTitle, authorBio, authorAvatar, authorUrl, isAdmin, isModerator, views, likes, content }) {
  const tagList = tags.length > 0 ? tags.map(t => `  - ${t}`).join('\n') : '  - announcements'
  const safe = (s) => String(s || '').replace(/"/g, '\\"').replace(/\n/g, ' ')
  return `---
id: ${id}
title: "${safe(title)}"
slug: "${safe(slug)}"
date: "${date}"
author: "${safe(author)}"
authorTitle: "${safe(authorTitle)}"
authorBio: "${safe(authorBio)}"
authorAvatar: "${safe(authorAvatar)}"
authorUrl: "${safe(authorUrl)}"
isAdmin: ${!!isAdmin}
isModerator: ${!!isModerator}
views: ${views || 0}
likes: ${likes || 0}
excerpt: "${safe(excerpt).slice(0, 200)}"
tags:
${tagList}
---

${content}
`
}

/** Fetch all topics from the category */
async function fetchCategoryTopics() {
  const data = await discourseGet(`/c/${CATEGORY_SLUG}/${CATEGORY_ID}.json`)
  return data.topic_list?.topics ?? []
}

/** Fetch a single topic's full data including post content */
async function fetchTopic(topicId) {
  return discourseGet(`/t/${topicId}.json`)
}

/** Fetch user profile data */
async function fetchUser(username) {
  try {
    const data = await discourseGet(`/u/${username}.json`)
    return data.user || null
  } catch {
    return null
  }
}

/** Resolve avatar URL from template at a given size */
function resolveAvatar(template, size = 128) {
  if (!template) return null
  const full = template.startsWith('http') ? template : `${DISCOURSE_BASE}${template}`
  return full.replace('{size}', String(size))
}

/** Main sync routine */
async function sync() {
  ensureDirs()
  console.log(`\n🔄  Syncing Discourse category: ${CATEGORY_SLUG} (id=${CATEGORY_ID})\n`)

  const topics = await fetchCategoryTopics()
  console.log(`📋  Found ${topics.length} topic(s)`)

  let created = 0
  let updated = 0
  let skipped = 0

  for (const topic of topics) {
    const filePath = path.join(CONTENT_DIR, `${topic.id}.md`)
    const exists = fs.existsSync(filePath)

    // Check if the topic has been updated since we last synced
    const lastSynced = exists
      ? new Date(fs.statSync(filePath).mtime).toISOString()
      : null
    const lastPostedAt = new Date(topic.last_posted_at).toISOString()

    if (exists && lastSynced && lastSynced >= lastPostedAt) {
      console.log(`✅  Unchanged: "${topic.title}" (id=${topic.id})`)
      skipped++
      continue
    }

    console.log(`${exists ? '✏️  Updating' : '➕  Creating'}: "${topic.title}" (id=${topic.id})`)

    try {
      const topicData = await fetchTopic(topic.id)
      const firstPost = topicData.post_stream?.posts?.[0]

      if (!firstPost) {
        console.warn(`  ⚠ No post content found, skipping`)
        continue
      }

      // Prefer raw markdown if available, fall back to converting cooked HTML
      let content = firstPost.raw
        ? firstPost.raw
        : convertCookedToMarkdown(firstPost.cooked || '')

      // Download images and rewrite URLs
      content = await processImages(content, topic.id)

      const author = firstPost.username || topicData.details?.created_by?.username || 'unknown'
      const tags = (topicData.tags || topic.tags || [])
      const slug = topic.slug || slugify(topic.title)
      const date = topic.created_at

      // Fetch author user profile
      console.log(`  👤 Fetching user profile for ${author}...`)
      const userData = await fetchUser(author)
      const authorTitle  = userData?.title || ''
      const authorBio    = userData?.bio_excerpt || ''
      const authorAvatar = resolveAvatar(firstPost.avatar_template || userData?.avatar_template)
      const authorUrl    = `${DISCOURSE_BASE}/u/${author}`
      const isAdmin      = firstPost.admin || userData?.admin || false
      const isModerator  = firstPost.moderator || userData?.moderator || false

      // Stats from the topic listing
      const views = topic.views || topicData.views || 0
      const likes = topic.like_count || topicData.like_count || 0

      // Generate excerpt from the first ~160 chars of content
      const excerptRaw = content
        .replace(/!\[.*?\]\(.*?\)/g, '')  // strip images
        .replace(/#{1,6}\s/g, '')         // strip headings
        .replace(/[*_`~]/g, '')           // strip inline formatting
        .trim()
      const excerpt = excerptRaw.slice(0, 200)

      const fileContent = buildMarkdownFile({
        id: topic.id,
        title: topic.title,
        slug,
        date,
        tags,
        excerpt,
        author,
        authorTitle,
        authorBio,
        authorAvatar,
        authorUrl,
        isAdmin,
        isModerator,
        views,
        likes,
        content
      })

      fs.writeFileSync(filePath, fileContent, 'utf8')
      exists ? updated++ : created++
    } catch (err) {
      console.error(`  ✗ Error processing topic ${topic.id}: ${err.message}`)
    }
  }

  console.log(`\n✨  Sync complete: ${created} created, ${updated} updated, ${skipped} skipped\n`)
}

sync().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
