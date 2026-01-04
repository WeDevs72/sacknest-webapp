import { supabase } from './supabase'

// Upload file to Supabase Storage
export async function uploadPackFile(file, packId) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${packId}_${Date.now()}.${fileExt}`
  const filePath = `premium-packs/${fileName}`

  const { data, error } = await supabase.storage
    .from('premium-content')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('premium-content')
    .getPublicUrl(filePath)

  return { path: filePath, url: publicUrl }
}

// Get signed URL for secure download (expires in 24 hours)
export async function getSignedDownloadUrl(filePath) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase.storage
    .from('premium-content')
    .createSignedUrl(filePath, 86400) // 24 hours

  if (error) throw error
  return data.signedUrl
}

// Delete file from storage
export async function deletePackFile(filePath) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase.storage
    .from('premium-content')
    .remove([filePath])

  if (error) throw error
  return true
}
