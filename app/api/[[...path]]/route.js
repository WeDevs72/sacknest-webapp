import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { supabaseServer as supabase } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// ============================================
// UTILITY FUNCTIONS
// ============================================

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Simple JWT alternative for admin authentication
const generateToken = (userId) => {
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64')
}

const verifyToken = (token) => {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

// Razorpay instance
const razorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret || keyId.includes('YOUR_KEY')) {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  })
}

// ============================================
// AUTHENTICATION HELPERS
// ============================================

const getAuthUser = (request) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  return verifyToken(token)
}

// ============================================
// API ROUTE HANDLER
// ============================================

export async function GET(request) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace('/api/', '')

  // Handle missing Supabase configuration
  if (!isSupabaseConfigured() && !path.startsWith('health')) {
    return NextResponse.json({
      error: 'Database not configured',
      message: 'Please configure Supabase credentials in .env file. See SUPABASE_SETUP.md for instructions.'
    }, { status: 503 })
  }

  try {
    // Health check
    if (path === 'health' || path === '') {
      return NextResponse.json({
        status: 'ok',
        supabaseConfigured: isSupabaseConfigured(),
        razorpayConfigured: razorpayInstance() !== null
      })
    }



    // ==================== TRENDING AI IMAGES ====================

    if (path === 'trending-ai-images' || path.startsWith('trending-ai-images?')) {
      const url = new URL(request.url)
      const limit = parseInt(url.searchParams.get('limit') || '100')

      const { data, error } = await supabase
        .from('trending_ai_images')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(limit)

      if (error) throw error
      return NextResponse.json(data || [])
    }

    if (path.match(/^trending-ai-images\/[^\/]+$/)) {
      const id = path.split('/')[1]
      const { data, error } = await supabase
        .from('trending_ai_images')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }


    // ==================== PROMPTS ====================

    if (path === 'prompts' || path.startsWith('prompts?')) {
      const url = new URL(request.url)
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const category = url.searchParams.get('category')
      const premium = url.searchParams.get('premium')

      let query = supabase
        .from('prompts')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      if (premium !== null) {
        query = query.eq('isPremium', premium === 'true')
      }

      const { data, error } = await query

      if (error) throw error
      return NextResponse.json(data || [])
    }

    if (path.match(/^prompts\/[^\/]+$/)) {
      const id = path.split('/')[1]
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // ==================== CATEGORIES ====================

    if (path === 'categories') {
      const { data, error } = await supabase
        .from('prompts')
        .select('category')

      if (error) throw error

      const categories = [...new Set(data.map(p => p.category))].filter(Boolean)
      return NextResponse.json(categories)
    }

    // ==================== BLOGS ====================

    if (path === 'blogs' || path.startsWith('blogs?')) {
      const url = new URL(request.url)
      const publishedOnly = url.searchParams.get('published') !== 'false'

      let query = supabase
        .from('blogs')
        .select('*')
        .order('createdAt', { ascending: false })

      if (publishedOnly) {
        query = query.eq('published', true)
      }

      const { data, error } = await query

      if (error) throw error
      return NextResponse.json(data || [])
    }

    if (path.match(/^blogs\/[^\/]+$/)) {
      const identifier = path.split('/')[1]

      // Try to find by ID first, then by slug
      let { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', identifier)
        .single()

      if (error || !data) {
        const slugResult = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', identifier)
          .single()

        data = slugResult.data
        error = slugResult.error
      }

      if (error) throw error
      return NextResponse.json(data)
    }

    // ==================== PREMIUM PACKS ====================

    if (path === 'premium-packs' || path.startsWith('premium-packs?')) {
      const url = new URL(request.url)
      const enabledOnly = url.searchParams.get('enabled') !== 'false'

      let query = supabase
        .from('premium_packs')
        .select('*')

      if (enabledOnly) {
        query = query.eq('enabled', true)
      }

      const { data, error } = await query

      if (error) {
        console.error("PREMIUM PACKS ERROR:", error)
        return NextResponse.json({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }, { status: 500 })
      }

      return NextResponse.json(data || [])
    }


    // UPDATE PREMIUM PACK
    // if (request.method === 'PUT' && path.match(/^premium-packs\/[^\/]+$/)) {
    //   const id = path.split('/')[1]
    //   const formData = await request.formData()

    //   const title = formData.get('title')
    //   const description = formData.get('description')
    //   const enabled = formData.get('enabled') === 'true'
    //   const file = formData.get('file')

    //   let pdfUrl = null

    //   if (file) {
    //     const fileName = `${Date.now()}-${file.name}`

    //     const { error: uploadError } = await supabase.storage
    //       .from('premium_packs')
    //       .upload(`pdfs/${fileName}`, file)

    //     if (uploadError) {
    //       return NextResponse.json(
    //         { error: 'Upload failed', details: uploadError.message },
    //         { status: 400 }
    //       )
    //     }

    //     const { data: publicUrlData } = supabase.storage
    //       .from('premium_packs')
    //       .getPublicUrl(`pdfs/${fileName}`)

    //     pdfUrl = publicUrlData.publicUrl
    //   }

    //   const updatePayload = {
    //     title,
    //     description,
    //     enabled,
    //     ...(pdfUrl && { pdf_url: pdfUrl })
    //   }

    //   const { data, error } = await supabase
    //     .from('premium_packs')
    //     .update(updatePayload)
    //     .eq('id', id)
    //     .select()
    //     .single()

    //   if (error) throw error
    //   return NextResponse.json(data)
    // }



    // ==================== ADMIN: EMAIL LEADS ====================

    if (path === 'admin/email-leads') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data, error } = await supabase
        .from('email_leads')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      return NextResponse.json(data || [])
    }

    // ==================== ADMIN: ORDERS ====================

    if (path === 'admin/orders') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      return NextResponse.json(data || [])
    }

    // ==================== ORDER DETAILS ====================

    if (path.match(/^orders\/[^\/]+$/)) {
      const orderId = path.split('/')[1]

      // Find order by Razorpay order ID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpayOrderId', orderId)
        .single()

      if (orderError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Get pack details if packId exists
      let pack = null
      if (order.packId) {
        const { data: packData } = await supabase
          .from('premium_packs')
          .select('*')
          .eq('id', order.packId)
          .single()
        pack = packData
      }

      return NextResponse.json({ order, pack })
    }

    // ==================== SECURE DOWNLOAD ====================

    if (path.match(/^download\/[^\/]+$/)) {
      const orderId = path.split('/')[1]

      // Verify order exists and is paid
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpayOrderId', orderId)
        .single()

      if (orderError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      if (order.status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 403 })
      }

      // Get pack and file URL
      const { data: pack, error: packError } = await supabase
        .from('premium_packs')
        .select('*')
        .eq('id', order.packId)
        .single()

      if (packError || !pack || !pack.fileUrl) {
        return NextResponse.json({ error: 'File not available' }, { status: 404 })
      }

      // Return the file URL (in production, generate signed URL)
      // For now, return direct URL - in production use signed URLs with expiration
      return NextResponse.json({
        success: true,
        downloadUrl: pack.fileUrl,
        packName: pack.name
      })
    }

    // Default 404
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace('/api/', '')

  if (!isSupabaseConfigured() && !path.startsWith('health')) {
    return NextResponse.json({
      error: 'Database not configured',
      message: 'Please configure Supabase credentials in .env file'
    }, { status: 503 })
  }

  try {
    // ==================== FILE UPLOAD ====================

    if (path === 'upload-pack-file') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await request.formData()
      const file = formData.get('file')
      const packId = formData.get('packId')

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Get file extension
      const fileExt = file.name.split('.').pop()
      const fileName = `${packId}_${Date.now()}.${fileExt}`
      const filePath = `packs/${fileName}`

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('premium_packs')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({
          error: 'Upload failed',
          message: uploadError.message
        }, { status: 500 })
      }

      // Get public URL
      const { data } = supabase.storage
        .from('premium_packs')
        .getPublicUrl(filePath)

      const fileUrl = data?.publicUrl || data?.publicURL


      return NextResponse.json({
        success: true,
        fileUrl: fileUrl,
        fileName: fileName,
        filePath: filePath
      })
    }
    //===================== ADD TRENDING IMAGES =====================
    if (path === 'admin/trending-ai-images') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await request.formData()

      const image = formData.get("image")
      const promptText = formData.get("promptText")
      const aiToolName = formData.get("aiToolName")
      const aiToolUrl = formData.get("aiToolUrl")
      const title = formData.get("title")

      if (!image) {
        return NextResponse.json({ error: "Image is required" }, { status: 400 })
      }
      if (!promptText || !aiToolName) {
        return NextResponse.json({ error: "promptText and aiToolName required" }, { status: 400 })
      }

      const id = `ai_${Date.now()}`
      const ext = image.name?.split('.').pop() || "jpg"
      const filePath = `images/${id}.${ext}`

      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("trending-images")
        .upload(filePath, buffer, {
          contentType: image.type,
          cacheControl: "3600",
          upsert: true
        })

      if (uploadError) {
        console.error(uploadError)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
      }

      // Get public URL
      // Get public URL
      const { data: urlData, error: urlError } = supabase.storage
        .from("trending-images")
        .getPublicUrl(filePath)

      console.log("PUBLIC URL RESULT:", urlData, urlError)

      if (urlError) {
        console.error("URL ERROR:", urlError)
        return NextResponse.json({ error: "Failed to generate image URL" }, { status: 500 })
      }

      // Support both formats (just in case)
      const imageUrl = urlData?.publicUrl || urlData?.publicURL

      if (!imageUrl) {
        console.error("NO PUBLIC URL GENERATED:", urlData)
        return NextResponse.json({ error: "Image URL missing" }, { status: 500 })
      }

      // Save DB Record
      const { data, error } = await supabase
        .from("trending_ai_images")
        .insert([
          { id, imageUrl, promptText, aiToolName, aiToolUrl, title }
        ])
        .select()
        .single()

      if (error) {
        console.error(error)
        return NextResponse.json({ error: "Database insert failed" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Trending AI image added successfully",
        data
      })
    }

    const body = await request.json()

    // ==================== AUTH: ADMIN LOGIN ====================

    if (path === 'auth/admin/login') {
      const { email, password } = body

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
      }

      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !admin) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const passwordMatch = await bcrypt.compare(password, admin.passwordHash)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = generateToken(admin.id)
      return NextResponse.json({
        success: true,
        token,
        admin: {
          id: admin.id,
          email: admin.email
        }
      })
    }





    // ==================== AUTH: ADMIN REGISTER ====================

    if (path === 'auth/admin/register') {
      const authUser = getAuthUser(request)
      // Only allow first admin or existing admin to create new admins

      const { email, password } = body

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
      }

      // Check if admin already exists
      const { data: existing } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Admin already exists' }, { status: 400 })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const id = generateId('admin')

      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          id,
          email,
          passwordHash
        }])
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        admin: { id: data.id, email: data.email }
      })
    }

    // ==================== EMAIL LEADS ====================

    if (path === 'email-leads') {
      const { email, source = 'unknown' } = body

      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
      }

      // Check if email already exists
      const { data: existing } = await supabase
        .from('email_leads')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        return NextResponse.json({ success: true, message: 'Already subscribed' })
      }

      const id = generateId('lead')
      const { error } = await supabase
        .from('email_leads')
        .insert([{
          id,
          email,
          consent: true,
          source
        }])

      if (error) throw error

      return NextResponse.json({ success: true, message: 'Subscribed successfully' })
    }

    // ==================== ADMIN: CREATE PROMPT ====================

    if (path === 'admin/prompts') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { title, category, tags, promptText, exampleOutput, exampleImageUrl, isPremium, seoTitle, seoDescription } = body

      if (!title || !category || !promptText) {
        return NextResponse.json({ error: 'Title, category, and prompt text required' }, { status: 400 })
      }

      const id = generateId('prompt')
      const { data, error } = await supabase
        .from('prompts')
        .insert([{
          id,
          title,
          category,
          tags: tags || [],
          promptText,
          exampleOutput,
          exampleImageUrl,
          isPremium: isPremium || false,
          seoTitle,
          seoDescription
        }])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // ==================== ADMIN: CREATE BLOG ====================

    if (path === 'admin/blogs') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { title, slug, contentMarkdown, published, seoTitle, seoDescription } = body

      if (!title || !slug || !contentMarkdown) {
        return NextResponse.json({ error: 'Title, slug, and content required' }, { status: 400 })
      }

      const id = generateId('blog')
      const { data, error } = await supabase
        .from('blogs')
        .insert([{
          id,
          title,
          slug,
          contentMarkdown,
          published: published || false,
          seoTitle,
          seoDescription
        }])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // ==================== ADMIN: CREATE PREMIUM PACK ====================

    if (path === 'admin/premium-packs') {
      const authUser = getAuthUser(request)
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { name, description, priceInr, priceUsd, fileUrl, enabled } = body

      if (!name || !priceInr || !priceUsd) {
        return NextResponse.json({ error: 'Name and prices required' }, { status: 400 })
      }

      const id = generateId('pack')
      const { data, error } = await supabase
        .from('premium_packs')
        .insert([{
          id,
          name,
          description,
          priceInr,
          priceUsd,
          fileUrl,
          enabled: enabled !== false
        }])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // ==================== RAZORPAY: CREATE ORDER ====================

    if (path === 'razorpay/create-order') {
      const razorpay = razorpayInstance()
      if (!razorpay) {
        return NextResponse.json({
          error: 'Razorpay not configured',
          message: 'Please add Razorpay credentials to .env file'
        }, { status: 503 })
      }

      const { amount, currency = 'INR', customerEmail, packId } = body

      if (!amount || !customerEmail) {
        return NextResponse.json({ error: 'Amount and email required' }, { status: 400 })
      }

      if (!['INR', 'USD'].includes(currency)) {
        return NextResponse.json({ error: 'Currency must be INR or USD' }, { status: 400 })
      }

      // Convert to subunits (paise for INR, cents for USD)
      const amountInSubunits = Math.round(amount * 100)

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInSubunits,
        currency: currency,
        receipt: generateId('receipt'),
        notes: {
          customerEmail,
          packId: packId || ''
        }
      })

      // Save order to database
      const orderId = generateId('order')
      const { error } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          userId: customerEmail,
          razorpayOrderId: razorpayOrder.id,
          amount,
          currency,
          status: 'created',
          customerEmail,
          packId
        }])

      if (error) {
        console.error('Error saving order:', error)
      }

      return NextResponse.json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      })
    }

    // ==================== RAZORPAY: VERIFY PAYMENT ====================

    if (path === 'razorpay/verify-payment') {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
      }

      // Verify signature
      const body_data = `${razorpayOrderId}|${razorpayPaymentId}`
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body_data)
        .digest('hex')

      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 401 })
      }

      // Update order in database
      const { error } = await supabase
        .from('orders')
        .update({
          razorpayPaymentId,
          razorpaySignature,
          status: 'paid'
        })
        .eq('razorpayOrderId', razorpayOrderId)

      if (error) {
        console.error('Error updating order:', error)
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId
      })
    }

    // Default 404
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(request) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace('/api/', '')

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ==================== UPDATE PROMPT ====================
    if (path.match(/^admin\/prompts\/[^\/]+$/)) {
      const id = path.split('/')[2]
      const body = await request.json()

      const { error } = await supabase
        .from('prompts')
        .update(body)
        .eq('id', id)

      if (error) throw error

      const { data } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

      return NextResponse.json(data)
    }

    // ==================== UPDATE BLOG ====================
    if (path.match(/^admin\/blogs\/[^\/]+$/)) {
      const id = path.split('/')[2]
      const body = await request.json()

      const { error } = await supabase
        .from('blogs')
        .update(body)
        .eq('id', id)

      if (error) throw error

      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      return NextResponse.json(data)
    }

    // ==================== UPDATE PREMIUM PACK ====================
    if (path.match(/^admin\/premium-packs\/[^\/]+$/)) {
      const id = path.split('/')[2]
      const body = await request.json()

      const { error } = await supabase
        .from('premium_packs')
        .update(body)
        .eq('id', id)

      if (error) throw error

      const { data } = await supabase
        .from('premium_packs')
        .select('*')
        .eq('id', id)
        .single()

      return NextResponse.json(data)
    }

    // ==================== UPDATE TRENDING IMAGE ====================
    if (path.match(/^admin\/trending-ai-images\/[^\/]+$/)) {
      const id = path.split('/')[2]

      const contentType = request.headers.get("content-type") || ""
      let updatedFields = {}

      // ---------- FORM DATA (with optional image) ----------
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData()

        const promptText = formData.get("promptText")
        const aiToolName = formData.get("aiToolName")
        const aiToolUrl = formData.get("aiToolUrl")
        const title = formData.get("title")
        const image = formData.get("image")

        updatedFields = { promptText, aiToolName, aiToolUrl, title }

        if (image) {
          const ext = image.name?.split(".").pop() || "jpg"
          const filePath = `images/${id}.${ext}`

          const bytes = await image.arrayBuffer()
          const buffer = Buffer.from(bytes)

          const { error: uploadError } = await supabase.storage
            .from("trending-images")
            .upload(filePath, buffer, {
              contentType: image.type,
              cacheControl: "3600",
              upsert: true
            })

          if (uploadError) {
            console.error(uploadError)
            return NextResponse.json(
              { error: "Image upload failed" },
              { status: 500 }
            )
          }

          const { data: urlData } = supabase.storage
            .from("trending-images")
            .getPublicUrl(filePath)

          updatedFields.imageUrl = urlData?.publicUrl
        }
      }

      // ---------- JSON UPDATE ----------
      else {
        const body = await request.json()
        updatedFields = body
      }

      const { data, error } = await supabase
        .from("trending_ai_images")
        .update({
          ...updatedFields,
          updatedAt: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error(error)
        return NextResponse.json(
          { error: "Failed to update record" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Trending image updated successfully",
        data
      })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export async function DELETE(request) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace('/api/', '')

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ==================== DELETE TRENDING IMAGE ====================
    if (path.match(/^admin\/trending-ai-images\/[^\/]+$/)) {
      const id = path.split('/')[2]

      // Get record first
      const { data: record, error: fetchError } = await supabase
        .from('trending_ai_images')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !record) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })
      }

      // Extract storage path
      const imageUrl = record.imageUrl
      const storagePath = imageUrl.split('/trending-images/')[1]

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('trending-images')
        .remove([storagePath])

      if (storageError) {
        console.error('Storage delete failed:', storageError)
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
      }

      // Delete DB row
      const { error: deleteError } = await supabase
        .from('trending_ai_images')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error(deleteError)
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Trending image deleted successfully'
      })
    }

    // ==================== DELETE PROMPT ====================
    if (path.match(/^admin\/prompts\/[^\/]+$/)) {
      const id = path.split('/')[2]

      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    // ==================== DELETE BLOG ====================
    if (path.match(/^admin\/blogs\/[^\/]+$/)) {
      const id = path.split('/')[2]

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    // ==================== DELETE PREMIUM PACK ====================
    if (path.match(/^admin\/premium-packs\/[^\/]+$/)) {
      const id = path.split('/')[2]

      const { error } = await supabase
        .from('premium_packs')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


