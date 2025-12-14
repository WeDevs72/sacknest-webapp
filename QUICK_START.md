# 🚀 SackNest - Quick Start Guide

## Current Status
✅ **Application is fully built and ready**
⚠️ **Requires Supabase configuration to enable database features**

## What Works Without Supabase
- ✅ Landing page UI (but won't fetch real prompts)
- ✅ All page navigation
- ✅ UI components and animations
- ✅ Payment checkout UI (Razorpay)

## What Needs Supabase
- ❌ Admin login
- ❌ Prompt browsing (fetching from database)
- ❌ Blog posts
- ❌ Premium packs
- ❌ Email lead capture (saving to database)
- ❌ Order management

---

## 📝 Step-by-Step Setup (5 minutes)

### Step 1: Create Supabase Project (2 min)

1. Go to **[supabase.com](https://supabase.com)** and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `sacknest` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 1-2 minutes

### Step 2: Get Your Credentials (1 min)

1. In your Supabase project, go to **Settings** (⚙️ icon on left sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### Step 3: Configure SackNest (30 seconds)

1. Open `/app/.env` file in your editor
2. Replace these lines:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   With your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

### Step 4: Create Database Tables (1 min)

1. In Supabase, click **SQL Editor** on the left sidebar
2. Click **"New query"**
3. Open the file `/app/SUPABASE_SETUP.md` and copy the **entire SQL script** (it's long!)
4. Paste it into the SQL Editor
5. Click **"Run"** button (or press Cmd/Ctrl + Enter)
6. You should see: `Database setup complete! 🎉`

### Step 5: Restart the Server (30 seconds)

Run this command in terminal:
```bash
sudo supervisorctl restart nextjs
```

---

## ✅ Verify Setup

### Test 1: Check API Health
Visit: `https://your-url.com/api/health`

You should see:
```json
{
  "status": "ok",
  "supabaseConfigured": true,
  "razorpayConfigured": false
}
```

### Test 2: Admin Login
1. Go to: `https://your-url.com/admin/login`
2. Login with:
   - Email: `admin@sacknest.com`
   - Password: `admin123`
3. You should be redirected to the dashboard

### Test 3: Browse Prompts
1. Go to: `https://your-url.com/prompts`
2. You should see 15 sample prompts loaded from the database

---

## 🎯 What's Included (Sample Data)

Once Supabase is configured, you'll have:
- **15 AI Prompts** across multiple categories:
  - Instagram Creators
  - Reels & Shorts
  - YouTubers
  - Brand Collaborations
  - Freelancers
  - Small Businesses
  - AI Content Creators

- **3 Blog Posts**:
  - "10 AI Prompt Tips Every Creator Needs"
  - "How to Grow Your Instagram Following in 2025"
  - "The Ultimate Guide to AI Tools for Content Creators"

- **3 Premium Packs**:
  - Instagram Creator Starter Pack - ₹999 / $12.99
  - YouTube Content Master Bundle - ₹1499 / $19.99
  - Brand Deal Closing Kit - ₹1999 / $24.99

- **1 Admin User**:
  - Email: `admin@sacknest.com`
  - Password: `admin123` (⚠️ Change this immediately!)

---

## 🔐 Security: Change Admin Password

After first login:

1. **Option A: Create New Admin (Recommended)**
   - Use the API to create a new admin:
   ```bash
   curl -X POST https://your-url.com/api/auth/admin/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"email":"your@email.com","password":"your-secure-password"}'
   ```

2. **Option B: Update in Supabase**
   - Go to Supabase → Table Editor → `admin_users`
   - Update the password hash (use bcrypt)

---

## 🐛 Troubleshooting

### Issue: "Database not configured" error
**Solution**: Make sure you've added the correct Supabase credentials to `.env` and restarted the server.

### Issue: "relation does not exist" error
**Solution**: You haven't run the SQL schema. Go to Step 4 above.

### Issue: "new row violates row-level security policy"
**Solution**: The SQL script didn't complete. Re-run the entire SQL script from `SUPABASE_SETUP.md`.

### Issue: Admin login still not working
**Solution**: 
1. Check the Supabase credentials are correct
2. Verify the SQL script ran successfully (check for the success message)
3. Check browser console for errors
4. Try clearing browser cache and cookies

---

## 📞 Need Help?

If you're stuck:
1. Check `/app/SUPABASE_SETUP.md` for detailed instructions
2. Check browser console (F12) for errors
3. Check server logs: `tail -f /var/log/supervisor/nextjs.out.log`

---

## 🎨 Next Steps After Setup

Once everything is working:

1. **Customize Content**
   - Login to admin panel
   - Add your own prompts
   - Write blog posts
   - Configure premium packs

2. **Configure Razorpay** (Optional)
   - Get API keys from razorpay.com
   - Add to `.env` file
   - Test payment flow

3. **Customize Design**
   - Update colors in `tailwind.config.js`
   - Change logo and branding
   - Modify content on landing page

4. **Deploy to Production**
   - Push to GitHub
   - Deploy on Vercel/Netlify
   - Update environment variables
   - Switch Razorpay to live mode

---

## 🎉 You're All Set!

Your SackNest platform is ready to launch. Start adding content and building your AI prompt library! 🚀
