'use client'

import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f7f8fd]">

            {/* Top Navigation */}
            <div className="max-w-5xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                >
                    ← Back to Home
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-10">

                <span className="text-sm text-purple-600 font-medium">About Us</span>

                <h1 className="text-4xl font-bold text-purple-700 mt-2">
                    About SackNest
                </h1>

                <p className="text-gray-500 mt-2">
                    Last Updated: 30 December 2025
                </p>

                {/* Section 1 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Who We Are
                    </h2>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        SackNest is an AI-powered prompt platform built to help creators, entrepreneurs,
                        and learners unlock the real potential of artificial intelligence.
                        We make it easy for anyone to use tools like ChatGPT, Gemini, Midjourney,
                        and other AI engines without needing technical skills.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Our Mission
                    </h2>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        Our mission is to simplify AI for everyone. Most people fail with AI not because
                        the technology is weak, but because they don’t know how to communicate with it.
                        SackNest bridges that gap by providing well-crafted prompts that turn ideas into
                        real results.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        What We Do
                    </h2>
                    <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
                        <li>Provide high-quality AI prompts for text, image, and video generation</li>
                        <li>Help users create content, designs, ebooks, and online products</li>
                        <li>Offer business, marketing, and branding prompts</li>
                        <li>Curate trending and viral AI prompt ideas</li>
                        <li>Save time by removing trial-and-error from AI usage</li>
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Why SackNest Exists
                    </h2>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        AI is becoming the backbone of the modern internet, but most people don’t know
                        how to use it properly. SackNest was created so anyone — student, freelancer,
                        creator, or business owner — can use AI confidently to grow, earn, and build.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Who Can Use SackNest
                    </h2>
                    <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
                        <li>Content creators & YouTubers</li>
                        <li>Designers & digital artists</li>
                        <li>Students & teachers</li>
                        <li>Entrepreneurs & startups</li>
                        <li>Freelancers & agencies</li>
                        <li>Anyone interested in using AI effectively</li>
                    </ul>
                </section>

                {/* Section 6 */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Our Vision
                    </h2>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        We aim to make SackNest the world’s most useful AI prompt hub — a place where
                        creativity, productivity, and income generation come together. From writing books
                        to launching brands, SackNest will be the foundation of AI-powered creation.
                    </p>
                </section>

                {/* Footer Line */}
                <div className="mt-14 border-t pt-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} SackNest. All rights reserved.
                </div>

            </div>
        </div>
    )
}
