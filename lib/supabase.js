import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  serviceRole
)

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-')
  )
}

// ✅ Keep initialization logic here (no separate file)
export const initializeDatabase = async () => {
  if (!isSupabaseConfigured()) {
    console.warn(
      'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env'
    )
    return false
  }

  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('id')
      .limit(1)

    if (error) throw error

    if (!data || data.length === 0) {
      console.log('No prompts found. Database may need seeding.')
    }

    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}
