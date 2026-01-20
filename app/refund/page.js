"use client";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RefundPolicy() {
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
          Policy
        </span>

        <h1 className="text-5xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">
          Refund Policy
        </h1>

        <p className="text-gray-500 font-bold uppercase tracking-wide mb-12">Last Updated: 30 December 2025</p>

        <div className="space-y-8 text-gray-800 dark:text-gray-200 leading-relaxed font-medium">

          {[
            {
              title: "1. Scope",
              content: "This Refund Policy applies to all purchases made on SackNest including digital products, subscriptions, and premium services."
            },
            {
              title: "2. Nature of Digital Products",
              content: "Since our services provide instant access digital content, refunds are generally not issued once access is granted or content is delivered."
            },
            {
              title: "3. Refund Eligibility",
              content: (
                <>
                  <p>Refunds may be granted only if:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>You were charged incorrectly</li>
                    <li>You were charged twice for the same purchase</li>
                    <li>You did not receive access after successful payment</li>
                  </ul>
                </>
              )
            },
            {
              title: "4. Non-Refundable Situations",
              content: (
                <ul className="list-disc pl-6 space-y-1">
                  <li>Change of mind</li>
                  <li>Dissatisfaction with content quality</li>
                  <li>Content already accessed or downloaded</li>
                  <li>Violation of Terms & Conditions</li>
                </ul>
              )
            },
            {
              title: "5. Subscription Cancellation",
              content: "Users may cancel subscriptions anytime. No partial or prorated refunds. Access remains active until the end of the billing cycle."
            },
            {
              title: "6. Refund Processing Time",
              content: "If approved, refunds may take 7–14 business days depending on the payment provider or bank."
            },
            {
              title: "7. Contact for Refund Support",
              content: (
                <p>
                  To request a refund, email us with your name, email, transaction ID,
                  and reason for request.
                  <br />
                  <span className="font-bold text-black dark:text-white bg-yellow-400 px-2">Email: sacknest.info@gmail.com</span>
                </p>
              )
            }
          ].map((section, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900 border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black mb-2 uppercase text-black dark:text-white">{section.title}</h2>
              <div className="text-lg">
                {section.content}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
