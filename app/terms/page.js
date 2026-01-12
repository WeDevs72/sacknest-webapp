"use client";
import Link from "next/link";

export default function TermsConditions() {
  return (
    <section className="min-h-screen bg-[#eceffb] py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        <Link href="/" className="text-sm text-gray-700 hover:text-black mb-6 block">
          ← Back to Home
        </Link>

        <span className="inline-block mb-4 text-sm font-medium text-purple-700 bg-purple-100 px-4 py-1 rounded-full">
          Terms & Conditions
        </span>

        <h1 className="text-4xl font-bold text-[#6b42ff] mb-2">
          Terms & Conditions – SackNest
        </h1>

        <p className="text-gray-600 mb-10">Last Updated: 30 December 2025</p>

        <div className="space-y-8 text-gray-800 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SackNest, you agree to be bound by these Terms &
              Conditions. If you do not agree, you must stop using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Eligibility</h2>
            <p>
              You must be at least 13 years old and capable of entering a binding agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Services</h2>
            <p>
              SackNest provides AI prompts, digital resources, and premium tools. We may
              update, modify, or discontinue services at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must not misuse the platform</li>
              <li>You must not engage in illegal activities</li>
              <li>You must not upload spam, malware, or harmful content</li>
              <li>You must provide accurate account information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Intellectual Property</h2>
            <p>
              All content on SackNest, including text, design, graphics, and digital
              resources, is owned by SackNest unless stated otherwise. Unauthorized
              copying, selling, or redistribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Payments & Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Certain features require payment</li>
              <li>Payments are processed securely via third-party gateways</li>
              <li>Pricing may change at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Disclaimer</h2>
            <p>
              SackNest is provided “as-is” without warranties of any kind. We do not
              guarantee error-free service, accuracy, or uninterrupted access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Limitation of Liability</h2>
            <p>
              SackNest is not liable for financial loss, data loss, service downtime, or
              indirect damages arising from platform usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">9. Termination</h2>
            <p>
              We may suspend or terminate user accounts for violating these Terms or
              engaging in fraudulent or harmful activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">10. Governing Law</h2>
            <p>
              These Terms are governed by applicable laws of your operating country or
              region.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">11. Changes to Terms</h2>
            <p>
              We may update these Terms anytime. Continued platform use means you accept
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">12. Contact</h2>
            <p>Email: sacknest.info@gmail.com</p>
          </section>

        </div>
      </div>
    </section>
  );
}
