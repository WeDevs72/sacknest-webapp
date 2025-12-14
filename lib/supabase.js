import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Database initialization function
export const initializeDatabase = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env')
    return false
  }
  
  try {
    // Check if data exists
    const { data: existingPrompts } = await supabase
      .from('prompts')
      .select('id')
      .limit(1)
    
    if (!existingPrompts || existingPrompts.length === 0) {
      console.log('No prompts found. Database may need seeding.')
    }
    
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}
