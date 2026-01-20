"use client";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsConditions() {
  return (
    <section className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-transparent hover:text-yellow-600 pl-0 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <span className="inline-block mb-4 text-sm font-black uppercase tracking-widest text-black bg-yellow-400 border-2 border-black px-4 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Legal
        </span>

        <h1 className="text-5xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">
          Terms & Conditions
        </h1>

        <p className="text-gray-500 font-bold uppercase tracking-wide mb-12">Last Updated: 30 December 2025</p>

        <div className="space-y-8 text-gray-800 dark:text-gray-200 leading-relaxed font-medium">

          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using SackNest, you agree to be bound by these Terms & Conditions. If you do not agree, you must stop using the platform."
            },
            {
              title: "2. Eligibility",
              content: "You must be at least 13 years old and capable of entering a binding agreement."
            },
            {
              title: "3. Services",
              content: "SackNest provides AI prompts, digital resources, and premium tools. We may update, modify, or discontinue services at any time without prior notice."
            },
            {
              title: "4. User Responsibilities",
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must not misuse the platform</li>
                  <li>You must not engage in illegal activities</li>
                  <li>You must not upload spam, malware, or harmful content</li>
                  <li>You must provide accurate account information</li>
                </ul>
              )
            },
            {
              title: "5. Intellectual Property",
              content: "All content on SackNest, including text, design, graphics, and digital resources, is owned by SackNest unless stated otherwise. Unauthorized copying, selling, or redistribution is prohibited."
            },
            {
              title: "6. Payments & Subscriptions",
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Certain features require payment</li>
                  <li>Payments are processed securely via third-party gateways</li>
                  <li>Pricing may change at any time</li>
                </ul>
              )
            },
            {
              title: "7. Disclaimer",
              content: "SackNest is provided “as-is” without warranties of any kind. We do not guarantee error-free service, accuracy, or uninterrupted access."
            },
            {
              title: "8. Limitation of Liability",
              content: "SackNest is not liable for financial loss, data loss, service downtime, or indirect damages arising from platform usage."
            },
            {
              title: "9. Termination",
              content: "We may suspend or terminate user accounts for violating these Terms or engaging in fraudulent or harmful activity."
            },
            {
              title: "10. Governing Law",
              content: "These Terms are governed by applicable laws of your operating country or region."
            },
            {
              title: "11. Changes to Terms",
              content: "We may update these Terms anytime. Continued platform use means you accept the updated Terms."
            },
            {
              title: "12. Contact",
              content: "Email: sacknest.info@gmail.com"
            }
          ].map((section, index) => (
            <section key={index} className="border-l-4 border-black dark:border-white pl-6 py-2">
              <h2 className="text-2xl font-black mb-2 uppercase text-black dark:text-white">{section.title}</h2>
              <div className="text-lg">
                {section.content}
              </div>
            </section>
          ))}

        </div>
      </div>
    </section>
  );
}
