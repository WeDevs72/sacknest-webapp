"use client";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <section className="min-h-screen bg-[#eceffb] py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        <Link href="/" className="text-sm text-gray-700 hover:text-black mb-6 block">
          ← Back to Home
        </Link>

        <span className="inline-block mb-4 text-sm font-medium text-purple-700 bg-purple-100 px-4 py-1 rounded-full">
          Refund Policy
        </span>

        <h1 className="text-4xl font-bold text-[#6b42ff] mb-2">
          Refund Policy – SackNest
        </h1>

        <p className="text-gray-600 mb-10">Last Updated: 30 December 2025</p>

        <div className="space-y-8 text-gray-800 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Scope</h2>
            <p>
              This Refund Policy applies to all purchases made on SackNest including
              digital products, subscriptions, and premium services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Nature of Digital Products</h2>
            <p>
              Since our services provide instant access digital content, refunds are
              generally not issued once access is granted or content is delivered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Refund Eligibility</h2>
            <p>Refunds may be granted only if:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You were charged incorrectly</li>
              <li>You were charged twice for the same purchase</li>
              <li>You did not receive access after successful payment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Non-Refundable Situations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Change of mind</li>
              <li>Dissatisfaction with content quality</li>
              <li>Content already accessed or downloaded</li>
              <li>Violation of Terms & Conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Subscription Cancellation</h2>
            <p>
              Users may cancel subscriptions anytime. No partial or prorated refunds.
              Access remains active until the end of the billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Refund Processing Time</h2>
            <p>
              If approved, refunds may take 7–14 business days depending on the payment
              provider or bank.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Contact for Refund Support</h2>
            <p>
              To request a refund, email us with your name, email, transaction ID,
              and reason for request.
              <br />
              Email: sacknest.info@gmail.com
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
