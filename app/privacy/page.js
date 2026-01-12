"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-[#eceffb] py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="text-sm text-gray-700 hover:text-black mb-6 block">
          ← Back to Home
        </Link>

        <span className="inline-block mb-4 text-sm font-medium text-purple-700 bg-purple-100 px-4 py-1 rounded-full">
          Privacy Policy
        </span>

        <h1 className="text-4xl font-bold text-[#6b42ff] mb-2">
          Privacy Policy – SackNest
        </h1>

        <p className="text-gray-600 mb-10">Last Updated: 30 December 2025</p>

        <div className="space-y-8 text-gray-800 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="mb-2">We may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Personal details like name, email, and contact information</li>
              <li>Device, browser, IP address, and usage analytics</li>
              <li>Account and activity data</li>
              <li>Payment details handled securely by third-party gateways</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and operate services</li>
              <li>To manage accounts and subscriptions</li>
              <li>To process payments</li>
              <li>To improve platform performance</li>
              <li>To communicate important updates</li>
              <li>To ensure legal and security compliance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Cookies</h2>
            <p>
              We use cookies for analytics, functionality, and enhanced experience. You
              may disable cookies in browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
            <p>
              We implement reasonable security measures. However, no online transmission
              is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Sharing of Information</h2>
            <p>
              We may share data with analytics providers, payment processors, and legal
              authorities if required. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary for service or legal
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your data</li>
              <li>Request corrections</li>
              <li>Request deletion</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Children’s Privacy</h2>
            <p>
              SackNest is not intended for children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">9. Policy Updates</h2>
            <p>
              We may update this policy anytime and changes will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">10. Contact</h2>
            <p>Email: sacknest.info@gmail.com</p>
          </section>
        </div>
      </div>
    </section>
  );
}
