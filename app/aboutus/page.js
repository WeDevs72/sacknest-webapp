'use client'

import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
            {/* Top Navigation */}
            <div className="max-w-5xl mx-auto px-6 pt-12">
                <Link href="/">
                    <Button variant="ghost" className="hover:bg-transparent hover:text-yellow-600 pl-0 text-lg">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">

                <span className="inline-block mb-4 text-sm font-black uppercase tracking-widest text-black bg-yellow-400 border-2 border-black px-4 py-1 rounded-full">
                    About Us
                </span>

                <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mt-2 uppercase tracking-tighter mb-4">
                    About <span className="underline decoration-yellow-400 decoration-8 underline-offset-4">SackNest</span>
                </h1>

                <p className="text-gray-500 font-bold uppercase tracking-wide">
                    Last Updated: 30 December 2025
                </p>

                {/* Section 1 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        Who We Are
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium border-l-4 border-yellow-400 pl-6">
                        SackNest is an AI-powered prompt platform built to help creators, entrepreneurs,
                        and learners unlock the real potential of artificial intelligence.
                        We make it easy for anyone to use tools like ChatGPT, Gemini, Midjourney,
                        and other AI engines without needing technical skills.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        Our Mission
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium border-l-4 border-green-400 pl-6">
                        Our mission is to simplify AI for everyone. Most people fail with AI not because
                        the technology is weak, but because they don’t know how to communicate with it.
                        SackNest bridges that gap by providing well-crafted prompts that turn ideas into
                        real results.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        What We Do
                    </h2>
                    <ul className="grid md:grid-cols-2 gap-4">
                        {[
                            "Provide high-quality AI prompts",
                            "Help users create content & products",
                            "Offer business & marketing tools",
                            "Curate trending viral ideas",
                            "Remove trial-and-error from AI"
                        ].map((item, i) => (
                            <li key={i} className="bg-gray-50 dark:bg-gray-900 list-none p-4 rounded-xl border-2 border-black font-bold flex items-center">
                                <span className="w-3 h-3 bg-yellow-400 rounded-full border border-black mr-3"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        Why SackNest Exists
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium border-l-4 border-blue-400 pl-6">
                        AI is becoming the backbone of the modern internet, but most people don’t know
                        how to use it properly. SackNest was created so anyone — student, freelancer,
                        creator, or business owner — can use AI confidently to grow, earn, and build.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        Who Can Use SackNest
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {["Content creators", "YouTubers", "Designers", "Artists", "Students", "Teachers", "Entrepreneurs", "Startups", "Freelancers"].map((tag, i) => (
                            <span key={i} className="bg-white dark:bg-black text-black dark:text-white border-2 border-black px-4 py-2 rounded-lg font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Section 6 */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase mb-6">
                        Our Vision
                    </h2>
                    <div className="bg-black text-white p-8 rounded-[2rem] border-4 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-2xl font-bold leading-relaxed">
                            We aim to make SackNest the world’s most useful AI prompt hub — a place where
                            creativity, productivity, and income generation come together.
                        </p>
                    </div>
                </section>

                {/* Footer Line */}
                <div className="mt-20 border-t-4 border-black pt-8 text-center font-black uppercase tracking-widest text-gray-500">
                    © {new Date().getFullYear()} SackNest. All rights reserved.
                </div>

            </div>
        </div>
    )
}
