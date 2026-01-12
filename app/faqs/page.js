"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "What is SackNest?",
    a: "SackNest is a platform that provides AI prompts, digital tools, resources, and premium content to help users create faster, learn smarter, and grow productivity."
  },
  {
    q: "Do I need an account to use SackNest?",
    a: "You can browse some content without an account, but accessing premium prompts, exclusive content, and certain features may require registration."
  },
  {
    q: "Is SackNest free?",
    a: "We offer both free and premium plans. Free users get limited content while premium users enjoy full access and exclusive tools."
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are generally not provided for digital content unless there is a billing error or access issue. Please refer to our Refund Policy page."
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed securely via trusted third-party gateways. SackNest does not store payment card details."
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you may cancel anytime. Your access remains active until the end of the billing cycle."
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="min-h-screen bg-[#eceffb] py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        <Link href="/" className="text-sm text-gray-700 hover:text-black mb-6 block">
          ← Back to Home
        </Link>

        <span className="inline-block mb-4 text-sm font-medium text-purple-700 bg-purple-100 px-4 py-1 rounded-full">
          FAQs
        </span>

        <h1 className="text-4xl font-bold text-[#6b42ff] mb-2">
          Frequently Asked Questions
        </h1>

        <p className="text-gray-600 mb-10">
          Find answers to the most common questions about SackNest.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.q}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 text-2xl"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: "easeInOut"
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-gray-700 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-700">
          Still have questions?
          <span className="font-semibold"> Contact us at: </span>
          your@email.com
        </div>
      </div>
    </section>
  );
}
