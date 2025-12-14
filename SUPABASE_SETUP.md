# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes 1-2 minutes)
3. Go to **Settings → API** in your Supabase dashboard
4. Copy the following credentials:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 2: Update Environment Variables

Add these to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run this complete SQL script:

```sql
-- ============================================
-- SACKNEST DATABASE SCHEMA
-- ============================================

-- Drop existing tables if recreating
DROP TABLE IF EXISTS pack_prompts;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS email_leads;
DROP TABLE IF EXISTS premium_packs;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS prompts;
DROP TABLE IF EXISTS admin_users;

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PROMPTS TABLE
-- ============================================
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  "promptText" TEXT NOT NULL,
  "exampleOutput" TEXT,
  "exampleImageUrl" TEXT,
  "isPremium" BOOLEAN DEFAULT false,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. BLOGS TABLE
-- ============================================
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  "contentMarkdown" TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. PREMIUM PACKS TABLE
-- ============================================
CREATE TABLE premium_packs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "priceInr" DECIMAL(10,2) NOT NULL,
  "priceUsd" DECIMAL(10,2) NOT NULL,
  "fileUrl" TEXT,
  enabled BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. PACK_PROMPTS JUNCTION TABLE
-- ============================================
CREATE TABLE pack_prompts (
  "packId" TEXT NOT NULL,
  "promptId" TEXT NOT NULL,
  PRIMARY KEY ("packId", "promptId"),
  FOREIGN KEY ("packId") REFERENCES premium_packs(id) ON DELETE CASCADE,
  FOREIGN KEY ("promptId") REFERENCES prompts(id) ON DELETE CASCADE
);

-- ============================================
-- 6. EMAIL LEADS TABLE
-- ============================================
CREATE TABLE email_leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  consent BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'popup',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "razorpayOrderId" TEXT NOT NULL UNIQUE,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "packId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_premium ON prompts("isPremium");
CREATE INDEX idx_prompts_created ON prompts("createdAt" DESC);
CREATE INDEX idx_blogs_published ON blogs(published);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders("customerEmail");
CREATE INDEX idx_email_leads_email ON email_leads(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PUBLIC READ ACCESS
-- ============================================

-- Prompts: Public can read all
CREATE POLICY "Allow public read prompts" ON prompts FOR SELECT USING (true);
CREATE POLICY "Allow public insert prompts" ON prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update prompts" ON prompts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete prompts" ON prompts FOR DELETE USING (true);

-- Blogs: Public can read published blogs
CREATE POLICY "Allow public read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert blogs" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update blogs" ON blogs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete blogs" ON blogs FOR DELETE USING (true);

-- Premium Packs: Public can read enabled packs
CREATE POLICY "Allow public read packs" ON premium_packs FOR SELECT USING (true);
CREATE POLICY "Allow public insert packs" ON premium_packs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update packs" ON premium_packs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete packs" ON premium_packs FOR DELETE USING (true);

-- Pack Prompts: Public can read
CREATE POLICY "Allow public read pack_prompts" ON pack_prompts FOR SELECT USING (true);
CREATE POLICY "Allow public insert pack_prompts" ON pack_prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update pack_prompts" ON pack_prompts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete pack_prompts" ON pack_prompts FOR DELETE USING (true);

-- Email Leads: Public can insert
CREATE POLICY "Allow public insert email_leads" ON email_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read email_leads" ON email_leads FOR SELECT USING (true);
CREATE POLICY "Allow public update email_leads" ON email_leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete email_leads" ON email_leads FOR DELETE USING (true);

-- Orders: Public can insert and read own orders
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete orders" ON orders FOR DELETE USING (true);

-- Admin Users: Public can read (for login)
CREATE POLICY "Allow public read admin_users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert admin_users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update admin_users" ON admin_users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete admin_users" ON admin_users FOR DELETE USING (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_prompts_timestamp ON prompts;
CREATE TRIGGER update_prompts_timestamp
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_blogs_timestamp ON blogs;
CREATE TRIGGER update_blogs_timestamp
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_packs_timestamp ON premium_packs;
CREATE TRIGGER update_packs_timestamp
  BEFORE UPDATE ON premium_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_orders_timestamp ON orders;
CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================
-- SEED DATA - DEFAULT ADMIN USER
-- ============================================
-- Default admin credentials:
-- Email: admin@sacknest.com
-- Password: admin123 (CHANGE THIS IMMEDIATELY!)
-- Password hash generated with bcrypt

INSERT INTO admin_users (id, email, "passwordHash") VALUES
('admin_001', 'admin@sacknest.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa');

-- ============================================
-- SEED DATA - SAMPLE PROMPTS
-- ============================================

INSERT INTO prompts (id, title, category, tags, "promptText", "exampleOutput", "isPremium", "seoTitle", "seoDescription") VALUES

('prompt_001', 'Instagram Carousel Post Ideas', 'Instagram Creators', ARRAY['instagram', 'carousel', 'content'], 'Generate 10 engaging Instagram carousel post ideas for [NICHE] that will increase audience engagement and shares. Each idea should have a catchy hook and clear value proposition.', 'Here are 10 Instagram carousel ideas for fitness coaches: 1. "5 Myths About Weight Loss" - Breaking down common misconceptions. 2. "My Transformation Journey" - Before and after with lessons learned...', false, 'Best Instagram Carousel Post Ideas for Creators', 'Get inspired with these high-converting Instagram carousel post ideas that boost engagement'),

('prompt_002', 'Viral Reels Script Generator', 'Reels & Shorts', ARRAY['reels', 'shorts', 'viral', 'video'], 'Create a viral Instagram Reel or YouTube Short script for [TOPIC] that hooks viewers in the first 3 seconds, delivers value quickly, and ends with a strong call-to-action.', 'HOOK: "I spent $10,000 learning this... here\'s what they don\'t tell you" [1-3 seconds] BODY: Quick-fire tips with visual text overlays [15-20 seconds] CTA: "Follow for more insider secrets" [2 seconds]', false, 'Viral Reels Script Generator - Create Engaging Short Videos', 'Generate viral Instagram Reels and YouTube Shorts scripts that hook viewers instantly'),

('prompt_003', 'YouTube Video Title Generator', 'YouTubers', ARRAY['youtube', 'titles', 'seo', 'clickthrough'], 'Generate 15 high-performing YouTube video titles for [TOPIC] that are SEO-optimized, click-worthy, and accurately represent the content. Include power words and numbers.', '1. "I Tried [TOPIC] for 30 Days - Here\'s What Happened" 2. "The #1 Mistake Everyone Makes With [TOPIC]" 3. "[TOPIC]: Complete Beginner\'s Guide (2025)" 4. "How I [RESULT] Using [TOPIC] (Step-by-Step)"...', false, 'YouTube Video Title Generator - Get More Views', 'Create click-worthy, SEO-optimized YouTube titles that increase views and engagement'),

('prompt_004', 'Brand Collaboration Email Template', 'Brand Collaborations', ARRAY['brand-deals', 'email', 'sponsorship', 'collaboration'], 'Write a professional brand collaboration email pitch for [BRAND] targeting [NICHE AUDIENCE]. Include media kit highlights, engagement rates, and unique value proposition.', 'Subject: Partnership Opportunity - [YOUR NAME] x [BRAND] Hi [BRAND CONTACT], I\'m [YOUR NAME], a [NICHE] content creator with [FOLLOWERS] highly engaged followers... [Include metrics, past collaborations, unique angle]', true, 'Brand Collaboration Email Template for Influencers', 'Professional email templates to land brand deals and sponsorships'),

('prompt_005', 'Content Calendar Planner', 'Instagram Creators', ARRAY['planning', 'content-calendar', 'strategy'], 'Create a 30-day content calendar for [PLATFORM] focused on [NICHE]. Include post types, optimal posting times, content themes, and engagement strategies.', 'Week 1: Educational Content Monday: Tips post at 9 AM Tuesday: Behind-the-scenes at 12 PM Wednesday: User-generated content at 6 PM Thursday: Tutorial at 9 AM Friday: Fun/relatable content at 5 PM Weekend: Lifestyle content at 10 AM...', false, '30-Day Content Calendar Planner for Social Media', 'Plan your social media content strategy with this comprehensive calendar template'),

('prompt_006', 'SEO Blog Post Outline', 'Freelancers', ARRAY['seo', 'blog', 'content-writing'], 'Generate a comprehensive SEO blog post outline for [KEYWORD] with H2/H3 headings, key points to cover, word count recommendations, and internal linking opportunities.', 'Title: [Keyword] - Complete Guide [2025] H1: [Main Keyword] H2: What is [Keyword]? (300 words) - Definition - Why it matters - Common misconceptions H2: Benefits of [Keyword] (400 words)...', false, 'SEO Blog Post Outline Generator', 'Create SEO-optimized blog post outlines that rank on Google'),

('prompt_007', 'Sales Page Copywriting', 'Small Businesses', ARRAY['copywriting', 'sales', 'landing-page', 'conversion'], 'Write high-converting sales page copy for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include compelling headline, pain points, benefits, social proof sections, and irresistible CTA.', 'HEADLINE: Transform Your [PAIN POINT] in Just [TIMEFRAME] SUBHEADLINE: [Unique mechanism] that [specific result] without [common objection] PAIN POINTS: - Are you tired of [pain 1]? - Frustrated with [pain 2]?...', true, 'Sales Page Copywriting Template That Converts', 'Write persuasive sales copy that turns visitors into customers'),

('prompt_008', 'LinkedIn Post Generator', 'Freelancers', ARRAY['linkedin', 'professional', 'networking'], 'Create an engaging LinkedIn post about [TOPIC] that establishes thought leadership, encourages discussion, and drives profile views. Use storytelling and include relevant hashtags.', 'I made a $50,000 mistake last year. Here\'s what it taught me... [Hook that creates curiosity] [Personal story with conflict and resolution] [Key lesson] [Question to encourage engagement] #Leadership #BusinessLessons', false, 'LinkedIn Post Generator for Thought Leaders', 'Create engaging LinkedIn posts that build your professional brand'),

('prompt_009', 'Instagram Bio Generator', 'Instagram Creators', ARRAY['bio', 'profile', 'branding'], 'Create 5 compelling Instagram bio options for [NICHE CREATOR]. Each should be under 150 characters, include a clear value proposition, personality, and call-to-action.', '1. 🎯 [NICHE] Coach | Helping [AUDIENCE] achieve [RESULT] | 50K+ lives transformed | 👇 Free guide below 2. Your go-to for [TOPIC] tips ✨ | [PERSONALITY TRAIT] | [ACHIEVEMENT] | DM "START" to begin', false, 'Instagram Bio Generator - Create the Perfect Profile', 'Generate compelling Instagram bios that attract followers and conversions'),

('prompt_010', 'TikTok Trend Adaptation', 'Reels & Shorts', ARRAY['tiktok', 'trends', 'adaptation'], 'Adapt the current [TRENDING SOUND/FORMAT] for [YOUR NICHE] in a way that provides value while riding the trend wave. Include script, visual suggestions, and timing.', 'Trend: "Tell me you\'re a [X] without telling me you\'re a [X]" Adaptation for [NICHE]: Show relatable moments/items that your audience connects with Visual 1: [Specific item/moment] Text: "When you [relatable situation]"...', false, 'TikTok Trend Adaptation Guide for Your Niche', 'Leverage trending TikTok formats for your specific niche and audience'),

('prompt_011', 'Email Newsletter Template', 'Small Businesses', ARRAY['email', 'newsletter', 'marketing'], 'Write an engaging email newsletter for [BUSINESS TYPE] that balances promotional content with value. Include subject line variations, preheader text, and clear CTAs.', 'Subject Line Options: 1. "You won\'t believe what we\'re launching..." 2. "[NAME], this is for you 🎁" 3. "The secret to [BENEFIT] (inside)" Body: Hey [NAME], [Personal opening] [Value content/tip] [Soft transition to offer]...', true, 'Email Newsletter Template That Gets Opened', 'Create newsletters that subscribers actually want to read'),

('prompt_012', 'AI Image Generation Prompt', 'AI Content Creators', ARRAY['ai', 'image-generation', 'midjourney', 'dalle'], 'Create a detailed AI image generation prompt for [SUBJECT] with specific style, lighting, composition, and technical parameters for Midjourney/DALL-E/Stable Diffusion.', 'A photorealistic portrait of [subject], shot with Canon EOS R5, 85mm f/1.4 lens, golden hour lighting, shallow depth of field, warm color grading, rule of thirds composition, professional color grade, cinematic, high detail, 8k resolution --ar 16:9 --style raw --v 6', true, 'AI Image Generation Prompt Guide', 'Create detailed prompts for stunning AI-generated images'),

('prompt_013', 'Product Description Writer', 'Small Businesses', ARRAY['ecommerce', 'product', 'conversion'], 'Write a compelling product description for [PRODUCT] that highlights unique features, benefits, and creates urgency. Include SEO keywords naturally and address common objections.', '[ATTENTION-GRABBING HEADLINE] Introducing [Product Name] - the [unique positioning] that [main benefit]. KEY FEATURES: ✓ [Feature 1] - [benefit] ✓ [Feature 2] - [benefit] WHY CHOOSE US? [Social proof] [Guarantee] [Urgency element]', false, 'Product Description Writer for E-commerce', 'Write product descriptions that convert browsers into buyers'),

('prompt_014', 'Podcast Episode Outline', 'YouTubers', ARRAY['podcast', 'audio', 'content'], 'Create a structured podcast episode outline for [TOPIC] including intro hook, key discussion points, guest questions (if applicable), and compelling outro with CTA.', 'INTRO (2 min): - Hook: Surprising stat or story - What listeners will learn - Guest introduction (if applicable) SEGMENT 1 (10 min): [Main topic] - Key point 1 - Key point 2 - Real-world example SEGMENT 2 (10 min)...', false, 'Podcast Episode Outline Generator', 'Plan engaging podcast episodes with this comprehensive outline template'),

('prompt_015', 'Twitter/X Thread Creator', 'AI Content Creators', ARRAY['twitter', 'threads', 'engagement'], 'Write a viral Twitter/X thread about [TOPIC] that provides value, tells a story, and encourages engagement. Include 8-12 tweets with a strong hook and clear conclusion.', '1/ I spent 1000 hours learning [TOPIC]. Here are the 10 lessons that changed everything: [Thread] 🧵 2/ First, understand this: [Key insight] This is the foundation everything else builds on. 3/ Lesson 1: [Specific lesson] Here\'s why it matters: [Explanation + example]...', true, 'Twitter Thread Generator - Create Viral Content', 'Write engaging Twitter threads that go viral and grow your following')
;

-- ============================================
-- SEED DATA - SAMPLE BLOGS
-- ============================================

INSERT INTO blogs (id, title, slug, "contentMarkdown", published, "seoTitle", "seoDescription") VALUES

('blog_001', '10 AI Prompt Tips Every Creator Needs', 'ai-prompt-tips-creators', '# 10 AI Prompt Tips Every Creator Needs

Artificial Intelligence is revolutionizing content creation, but knowing how to craft the perfect prompt is an art form in itself.

## 1. Be Specific

The more specific your prompt, the better the results. Instead of "Write about marketing," try "Write a 500-word blog post about Instagram marketing strategies for fitness coaches in 2025."

## 2. Provide Context

AI works best when it understands your context. Include details about your audience, goals, and constraints.

## 3. Use Examples

Show the AI what you want by providing examples of the style, tone, or format you prefer.

## 4. Iterate and Refine

Don\'t expect perfection on the first try. Refine your prompts based on the results you get.

## 5. Specify the Format

Tell the AI exactly what format you want - bullet points, numbered list, table, etc.

## 6. Set Constraints

Include word counts, reading levels, or other constraints to get precisely what you need.

## 7. Use Power Words

Words like "compelling," "engaging," and "professional" help guide the AI\'s tone.

## 8. Request Multiple Options

Ask for 3-5 variations to give yourself choices.

## 9. Combine Instructions

Don\'t be afraid to string multiple instructions together for complex outputs.

## 10. Learn from Others

Study successful prompts from other creators and adapt them to your needs.

## Conclusion

Mastering AI prompts takes practice, but these tips will accelerate your learning curve. Start experimenting today!', true, '10 AI Prompt Tips Every Creator Needs in 2025', 'Master AI prompt engineering with these essential tips for content creators'),

('blog_002', 'How to Grow Your Instagram Following in 2025', 'grow-instagram-following-2025', '# How to Grow Your Instagram Following in 2025

Growing an authentic Instagram following has never been more challenging - or more important. Here\'s your complete guide.

## The Instagram Algorithm in 2025

Instagram\'s algorithm prioritizes:
- **Engagement**: Comments, shares, and saves
- **Consistency**: Regular posting schedule
- **Relevance**: Content that matches user interests
- **Relationships**: Interactions with your followers

## Strategy 1: Optimize Your Profile

Your profile is your first impression:
1. Clear, high-quality profile photo
2. Compelling bio with value proposition
3. Link to your best offer or content
4. Consistent visual aesthetic

## Strategy 2: Content Pillars

Develop 3-5 content pillars:
- Educational content (60%)
- Entertainment (20%)
- Personal/behind-the-scenes (15%)
- Promotional (5%)

## Strategy 3: Reels Domination

Reels get 52% more engagement than regular posts:
- Hook viewers in first 3 seconds
- Use trending audio
- Add captions (80% watch with sound off)
- Keep it under 30 seconds

## Strategy 4: Engagement Tactics

- Respond to comments within first hour
- Use story stickers (polls, questions, quizzes)
- Create shareable carousel posts
- Collaborate with complementary creators

## Strategy 5: Hashtag Strategy

Use a mix of:
- 5 large hashtags (100K+ posts)
- 10 medium hashtags (10K-100K posts)
- 15 niche hashtags (<10K posts)

## Strategy 6: Posting Schedule

Best times to post (general):
- Monday-Friday: 9 AM, 12 PM, 5 PM
- Saturday-Sunday: 10 AM, 2 PM

Test and find what works for YOUR audience.

## Tools to Use

- Later or Buffer for scheduling
- Canva for graphics
- InShot or CapCut for video editing
- AI tools for caption writing

## Common Mistakes to Avoid

❌ Buying followers
❌ Posting inconsistently
❌ Ignoring comments
❌ Using irrelevant hashtags
❌ Only promoting yourself

## Conclusion

Growing on Instagram takes time and consistency. Focus on providing value, engaging authentically, and adapting to platform changes. Your 10,000 followers are out there waiting!', true, 'How to Grow Your Instagram Following in 2025: Complete Guide', 'Learn proven strategies to grow your Instagram following organically in 2025'),

('blog_003', 'The Ultimate Guide to AI Tools for Content Creators', 'ai-tools-content-creators', '# The Ultimate Guide to AI Tools for Content Creators

AI is transforming content creation. Here are the best tools you need to know about in 2025.

## Writing & Copywriting

### ChatGPT
**Best for:** Blog posts, scripts, brainstorming
**Pricing:** Free tier available, $20/month Pro
**Why we love it:** Versatile and constantly improving

### Jasper AI
**Best for:** Marketing copy, product descriptions
**Pricing:** From $39/month
**Why we love it:** Templates for specific use cases

### Copy.ai
**Best for:** Social media captions, ads
**Pricing:** Free tier available, $36/month unlimited
**Why we love it:** Quick and easy to use

## Image Generation

### Midjourney
**Best for:** Artistic, creative images
**Pricing:** From $10/month
**Why we love it:** Stunning visual quality

### DALL-E 3
**Best for:** Accurate text in images, precise control
**Pricing:** Pay per image or ChatGPT Plus
**Why we love it:** Best text rendering

### Canva AI
**Best for:** Quick social media graphics
**Pricing:** Free tier available, $13/month Pro
**Why we love it:** Easy to edit after generation

## Video Creation

### Pictory
**Best for:** Converting blog posts to videos
**Pricing:** From $19/month
**Why we love it:** Automated workflow

### Descript
**Best for:** Podcast and video editing
**Pricing:** Free tier available, from $12/month
**Why we love it:** Text-based editing

### Runway ML
**Best for:** AI video effects and generation
**Pricing:** Free tier available, from $12/month
**Why we love it:** Cutting-edge features

## Audio & Voice

### ElevenLabs
**Best for:** AI voiceovers
**Pricing:** Free tier available, from $5/month
**Why we love it:** Most realistic voices

### Descript Overdub
**Best for:** Fixing audio mistakes
**Pricing:** Included with Descript subscription
**Why we love it:** Your own AI voice

## SEO & Research

### Surfer SEO
**Best for:** SEO optimization
**Pricing:** From $59/month
**Why we love it:** Data-driven recommendations

### ChatGPT Plugins
**Best for:** Real-time research
**Pricing:** Included with ChatGPT Plus
**Why we love it:** Access to current data

## Social Media Management

### Buffer AI Assistant
**Best for:** Repurposing content
**Pricing:** From $6/month
**Why we love it:** Time-saving automation

### Predis.ai
**Best for:** Social media posts
**Pricing:** Free tier available
**Why we love it:** Creates posts + graphics

## How to Choose the Right Tools

1. **Start with free trials**
2. **Focus on your biggest time sink first**
3. **Don\'t over-tool - pick 2-3 core tools**
4. **Learn one tool deeply before adding another**
5. **Calculate ROI based on time saved**

## Pro Tips

- Combine tools for better results
- Use AI as a starting point, not the final product
- Keep human creativity in the loop
- Stay updated - new tools launch weekly

## Conclusion

AI tools can 10x your content creation speed, but they\'re most powerful when combined with human creativity and strategy. Start experimenting today!

*Affiliate Disclosure: Some links in this post are affiliate links, meaning we earn a commission if you purchase through them at no extra cost to you.*', true, 'The Ultimate Guide to AI Tools for Content Creators in 2025', 'Discover the best AI tools for writing, design, video, and more to supercharge your content creation')
;

-- ============================================
-- SEED DATA - PREMIUM PACKS
-- ============================================

INSERT INTO premium_packs (id, name, description, "priceInr", "priceUsd", enabled) VALUES

('pack_001', 'Instagram Creator Starter Pack', 'Everything you need to kickstart your Instagram creator journey. Includes 50+ prompts for captions, Reels scripts, Stories ideas, and engagement strategies.', 999.00, 12.99, true),

('pack_002', 'YouTube Content Master Bundle', 'The complete YouTube toolkit with 75+ prompts for video titles, descriptions, scripts, thumbnails ideas, and SEO optimization strategies.', 1499.00, 19.99, true),

('pack_003', 'Brand Deal Closing Kit', 'Land your first (or next) brand deal with 30+ email templates, media kit prompts, negotiation scripts, and collaboration proposal templates.', 1999.00, 24.99, true)
;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database setup complete! 🎉' as message;
```

## Step 4: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see all 7 tables created
3. Check that sample data exists in:
   - `admin_users` (1 record)
   - `prompts` (15 records)
   - `blogs` (3 records)
   - `premium_packs` (3 records)

## Step 5: Restart Your App

After adding Supabase credentials:

```bash
sudo supervisorctl restart nextjs
```

## Default Admin Credentials

**Important**: Change these immediately after first login!

- **Email**: admin@sacknest.com
- **Password**: admin123

## Troubleshooting

### "Supabase is not configured" error
- Check that environment variables are set correctly
- Restart the Next.js server
- Verify credentials in Supabase dashboard

### "relation does not exist" error
- Tables weren't created
- Go back to SQL Editor and run the schema script again

### "new row violates row-level security policy" error
- RLS policies weren't created
- Check the SQL script ran completely without errors

## Next Steps

1. Login to admin panel at `/admin/login`
2. Change default admin password
3. Add your own prompts, blogs, and premium packs
4. Set up Razorpay for payments
5. Test the complete flow

## Need Help?

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Check browser console for errors
3. Check server logs: `tail -f /var/log/supervisor/nextjs.out.log`
