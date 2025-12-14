# Supabase Storage Setup for Premium Pack Files

## Overview
This guide explains how to set up Supabase Storage to securely store and deliver premium prompt pack files (PDFs, ZIPs, etc.)

---

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pykcgjszguewrydqzcqk

2. Click **"Storage"** in the left sidebar

3. Click **"Create a new bucket"**

4. Configure the bucket:
   - **Name**: `premium-content`
   - **Public**: ✅ **Yes** (so download links work)
   - **File size limit**: 50 MB (or higher if needed)
   - **Allowed MIME types**: Leave empty or add: `application/pdf, application/zip`

5. Click **"Create bucket"**

---

## Step 2: Upload Files

### Option A: Via Supabase Dashboard (Easiest)

1. Go to **Storage** → **premium-content** bucket

2. Click **"Upload file"** button

3. Select your PDF/ZIP file

4. After upload, click on the file

5. Click **"Get public URL"** or **"Copy URL"**

6. **Copy this URL** - you'll paste it in the admin panel

### Option B: Via Admin Panel (Coming Soon)
We can add a file upload feature directly in the admin panel if needed.

---

## Step 3: Add File URL to Premium Pack

1. Go to `/admin/premium-packs` in your SackNest admin panel

2. Click **"Edit"** on a premium pack

3. In the **"Download File URL"** field:
   - Paste the public URL from Supabase Storage
   - Example: `https://pykcgjszguewrydqzcqk.supabase.co/storage/v1/object/public/premium-content/pack_001.pdf`

4. Click **"Update Pack"**

---

## Step 4: Test the Download Flow

1. **Go to** `/premium` page

2. **Click "Buy Now"** on a pack (use test Razorpay keys)

3. **Complete payment** with test card:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

4. **You'll be redirected** to `/download/[orderId]`

5. **Click "Download Premium Prompts"** button

6. File should download from Supabase Storage!

---

## Security Best Practices

### Current Setup (Good for MVP):
- ✅ Files stored in Supabase
- ✅ Download requires valid paid order
- ✅ Order verification before download
- ✅ Public URLs for easy access

### Production Enhancements (Optional):
- 🔒 Use **signed URLs** with 24-72 hour expiration
- 🔒 Generate new signed URL each time user accesses download page
- 🔒 Track download count per order
- 🔒 Rate limiting on downloads

---

## File Organization Tips

Organize your files in folders:

```
premium-content/
├── instagram-creator-pack/
│   └── instagram_prompts_v1.pdf
├── youtube-master-bundle/
│   └── youtube_prompts_v2.pdf
└── brand-deal-kit/
    └── brand_collaboration_templates.pdf
```

To create folders in Supabase Storage:
1. Click **"Create folder"** in the bucket
2. Upload files to that folder
3. Use folder path in URL: `...premium-content/instagram-creator-pack/prompts.pdf`

---

## Troubleshooting

### Issue: Download link doesn't work
**Solution**: Make sure the bucket is **public**. Go to Storage → premium-content → Settings → Make public.

### Issue: File not found error
**Solution**: 
1. Check the file URL is correct
2. Make sure file was uploaded successfully
3. Verify the bucket name is `premium-content`

### Issue: Access denied
**Solution**: 
1. Verify payment status is 'paid' in orders table
2. Check order ID matches Razorpay order ID
3. Ensure packId in orders matches pack with fileUrl

---

## Advanced: Signed URLs (Production)

To implement secure signed URLs with expiration:

1. Update `/app/lib/supabaseStorage.js` (already created!)

2. Modify `/app/app/api/[[...path]]/route.js` download endpoint:

```javascript
// Instead of returning pack.fileUrl directly
import { getSignedDownloadUrl } from '@/lib/supabaseStorage'

// In download endpoint:
const signedUrl = await getSignedDownloadUrl(pack.fileUrl)
return NextResponse.json({
  success: true,
  downloadUrl: signedUrl, // This expires in 24 hours
  packName: pack.name
})
```

3. This generates a secure URL that expires, preventing sharing.

---

## Current File URL Examples

Your premium packs currently have these fileUrl values:
- Pack 1: (empty - needs file upload)
- Pack 2: (empty - needs file upload)
- Pack 3: (empty - needs file upload)

**Action Required**: Upload files to Supabase Storage and update the URLs in admin panel!

---

## Quick Checklist

- [ ] Create `premium-content` bucket in Supabase
- [ ] Make bucket public
- [ ] Upload at least 1 test PDF file
- [ ] Copy public URL from Supabase
- [ ] Paste URL in admin panel for a premium pack
- [ ] Test purchase flow with test Razorpay card
- [ ] Verify download works from `/download/[orderId]` page

---

**Need Help?** Check the logs:
```bash
# Check if Supabase Storage is configured
curl http://localhost:3000/api/health

# Test download endpoint
curl http://localhost:3000/api/download/ORDER_ID
```

Your premium delivery flow is ready! Just upload the files! 🚀
