-- ============================================
-- ADD REMAINING TABLES FOR SACKNEST
-- ============================================

-- 3. BLOGS TABLE
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

-- 4. PREMIUM PACKS TABLE
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

-- 5. EMAIL LEADS TABLE
CREATE TABLE email_leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  consent BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'popup',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDERS TABLE
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

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Simple policies (allow all for now)
CREATE POLICY "Allow all on blogs" ON blogs FOR ALL USING (true);
CREATE POLICY "Allow all on premium_packs" ON premium_packs FOR ALL USING (true);
CREATE POLICY "Allow all on email_leads" ON email_leads FOR ALL USING (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true);

-- Insert sample blogs
INSERT INTO blogs (id, title, slug, "contentMarkdown", published, "seoTitle", "seoDescription") VALUES
('blog_001', '10 AI Prompt Tips Every Creator Needs', 'ai-prompt-tips-creators', '# 10 AI Prompt Tips Every Creator Needs

AI is revolutionizing content creation. Here are the essential tips:

## 1. Be Specific
The more specific your prompt, the better the results.

## 2. Provide Context
AI works best when it understands your context and goals.

## 3. Use Examples
Show the AI what you want with clear examples.

Start experimenting today!', true, '10 AI Prompt Tips for Creators', 'Master AI prompts with these tips');

-- Insert sample premium packs
INSERT INTO premium_packs (id, name, description, "priceInr", "priceUsd", enabled) VALUES
('pack_001', 'Instagram Creator Starter Pack', 'Everything you need to kickstart your Instagram creator journey. Includes 50+ prompts for captions, Reels scripts, Stories ideas.', 999.00, 12.99, true),
('pack_002', 'YouTube Content Master Bundle', 'Complete YouTube toolkit with 75+ prompts for video titles, descriptions, scripts, and SEO optimization.', 1499.00, 19.99, true),
('pack_003', 'Brand Deal Closing Kit', 'Land your first brand deal with 30+ email templates, media kit prompts, and negotiation scripts.', 1999.00, 24.99, true);

-- Success message
SELECT 'All tables created! 🎉 Premium packs, blogs, email leads, and orders are now ready.' as message;
