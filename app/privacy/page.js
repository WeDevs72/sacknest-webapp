"use client";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicy() {
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
          Privacy Policy
        </span>

        <h1 className="text-5xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">
          Privacy Policy
        </h1>

        <p className="text-gray-500 font-bold uppercase tracking-wide mb-12">Last Updated: 30 December 2025</p>

        <div className="space-y-12 text-gray-800 dark:text-gray-200 leading-relaxed font-medium">

          {[
            {
              title: "1. Information We Collect",
              content: (
                <>
                  <p className="mb-2">We may collect the following information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal details like name, email, and contact information</li>
                    <li>Device, browser, IP address, and usage analytics</li>
                    <li>Account and activity data</li>
                    <li>Payment details handled securely by third-party gateways</li>
                  </ul>
                </>
              )
            },
            {
              title: "2. How We Use Information",
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and operate services</li>
                  <li>To manage accounts and subscriptions</li>
                  <li>To process payments</li>
                  <li>To improve platform performance</li>
                  <li>To communicate important updates</li>
                  <li>To ensure legal and security compliance</li>
                </ul>
              )
            },
            {
              title: "3. Cookies",
              content: "We use cookies for analytics, functionality, and enhanced experience. You may disable cookies in browser settings."
            },
            {
              title: "4. Data Security",
              content: "We implement reasonable security measures. However, no online transmission is 100% secure."
            },
            {
              title: "5. Sharing of Information",
              content: "We may share data with analytics providers, payment processors, and legal authorities if required. We do not sell your personal data."
            },
            {
              title: "6. Data Retention",
              content: "We retain personal data only as long as necessary for service or legal purposes."
            },
            {
              title: "7. Your Rights",
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your data</li>
                  <li>Request corrections</li>
                  <li>Request deletion</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              )
            },
            {
              title: "8. Children’s Privacy",
              content: "SackNest is not intended for children under 13."
            },
            {
              title: "9. Policy Updates",
              content: "We may update this policy anytime and changes will be posted on this page."
            },
            {
              title: "10. Contact",
              content: "Email: sacknest.info@gmail.com"
            }
          ].map((section, index) => (
            <section key={index} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border-2 border-black">
              <h2 className="text-2xl font-black mb-4 uppercase text-black dark:text-white">{section.title}</h2>
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
