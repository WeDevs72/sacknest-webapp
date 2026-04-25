import { NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const pdf = formData.get('pdf')

    if (!pdf) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    // Create 'assets' bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.find(b => b.name === 'assets')) {
      const { error: createError } = await supabase.storage.createBucket('assets', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
      })
      if (createError) console.warn('Failed to auto-create assets bucket (might already exist):', createError)
    }

    // Delete existing free_prompts.pdf if it exists to cleanly overwrite
    await supabase.storage.from('assets').remove(['free_prompts.pdf'])

    // Upload to assets bucket 
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(`free_prompts.pdf`, pdf, {
        upsert: true,
        contentType: 'application/pdf',
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload PDF to Supabase Storage: ' + uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(`free_prompts.pdf`)

    const publicUrl = publicUrlData.publicUrl

    return NextResponse.json({ success: true, url: publicUrl })

  } catch (error) {
    console.error('Admin pdf upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
