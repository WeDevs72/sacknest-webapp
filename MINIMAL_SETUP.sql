-- ============================================
-- MINIMAL SACKNEST SETUP - Core Tables Only
-- ============================================

-- 1. ADMIN USERS TABLE (for login)
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROMPTS TABLE (for browsing)
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

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Allow all operations (simple policy for now)
CREATE POLICY "Allow all on admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow all on prompts" ON prompts FOR ALL USING (true);

-- Insert default admin user
-- Email: admin@sacknest.com | Password: admin123
INSERT INTO admin_users (id, email, "passwordHash") VALUES
('admin_001', 'admin@sacknest.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa');

-- Insert 3 sample prompts for testing
INSERT INTO prompts (id, title, category, tags, "promptText", "exampleOutput", "isPremium") VALUES
('prompt_001', 'Instagram Carousel Ideas', 'Instagram Creators', ARRAY['instagram', 'content'], 'Generate 10 engaging Instagram carousel post ideas for [NICHE] that increase engagement.', 'Here are 10 carousel ideas: 1. "5 Myths About..." 2. "My Journey..."', false),
('prompt_002', 'Viral Reels Script', 'Reels & Shorts', ARRAY['reels', 'viral'], 'Create a viral Instagram Reel script for [TOPIC] that hooks viewers in 3 seconds.', 'HOOK: "I spent $10,000 learning this..." BODY: Quick tips...', false),
('prompt_003', 'YouTube Title Generator', 'YouTubers', ARRAY['youtube', 'seo'], 'Generate 15 SEO-optimized YouTube titles for [TOPIC] with power words.', '1. "I Tried [TOPIC] for 30 Days" 2. "The #1 Mistake..." 3. "[TOPIC]: Complete Guide"', false);

-- Success message
SELECT 'Minimal setup complete! 🎉 You can now login and browse prompts.' as message;
