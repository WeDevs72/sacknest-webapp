/**
 * Server-side data helpers for prompts.
 * These run at build time (SSG) and are NEVER imported by client components.
 * They bypass the API layer and query Supabase directly using the service role key.
 */

import { supabaseServer as supabase } from '@/lib/supabase-server'

/**
 * Fetch all prompts — used by generateStaticParams and the /prompts index page.
 */
export async function getAllPrompts() {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('[prompts-data] getAllPrompts error:', error)
    return []
  }

  return data || []
}

/**
 * Fetch a single prompt by its ID (used as the "slug" in the URL).
 */
export async function getPromptById(id) {
  // Guard against undefined — Next.js may invoke this during build-time stub generation
  if (!id) return null

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`[prompts-data] getPromptById(${id}) error:`, error)
    return null
  }

  return data
}

/**
 * Fetch all distinct categories — used to pre-populate the sidebar on the index page.
 */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('prompts')
    .select('category')

  if (error) {
    console.error('[prompts-data] getAllCategories error:', error)
    return []
  }

  const categories = [...new Set((data || []).map((p) => p.category))].filter(Boolean)
  return categories
}

/**
 * Fetch up to `limit` related prompts for a given prompt.
 * Prefers same platform match, then falls back to same category.
 * Always excludes the current prompt itself.
 */
export async function getRelatedPrompts(currentPrompt, limit = 4) {
  if (!currentPrompt?.id) return []

  // Try same platform first
  const platform = currentPrompt.platform || currentPrompt.tags?.[0]
  let related = []

  if (platform) {
    const { data: byPlatform } = await supabase
      .from('prompts')
      .select('id, title, category, platform, promptText')
      .neq('id', currentPrompt.id)
      .ilike('platform', platform)
      .limit(limit)

    related = byPlatform || []
  }

  // Backfill with same category if not enough
  if (related.length < limit && currentPrompt.category) {
    const existingIds = [currentPrompt.id, ...related.map((p) => p.id)]
    const needed = limit - related.length

    const { data: byCategory } = await supabase
      .from('prompts')
      .select('id, title, category, platform, promptText')
      .eq('category', currentPrompt.category)
      .not('id', 'in', `(${existingIds.join(',')})`)
      .limit(needed)

    related = [...related, ...(byCategory || [])]
  }

  return related
}
