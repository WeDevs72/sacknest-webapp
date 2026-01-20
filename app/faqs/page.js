"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <section className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black py-14 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-transparent hover:text-yellow-600 pl-0 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <span className="inline-block mb-4 text-sm font-black uppercase tracking-widest text-black bg-yellow-400 border-2 border-black px-4 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          FAQs
        </span>

        <h1 className="text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">
          Frequently Asked <span className="underline decoration-yellow-400 decoration-8 underline-offset-4">Questions</span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-bold">
          Find answers to the most common questions about SackNest.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-2xl border-2 border-black transition-all duration-300 ${isOpen ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'shadow-none'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-8 py-6 text-left"
                >
                  <span className="text-xl font-black text-black dark:text-white uppercase tracking-tight">
                    {faq.q}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-black dark:text-white text-2xl font-black bg-yellow-400 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black"
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
                      <div className="px-8 pb-8 text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed border-t-2 border-black border-dashed pt-4 mx-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center bg-black text-white p-8 rounded-[2rem] border-4 border-yellow-400">
          <p className="text-xl font-bold mb-4">Still have questions?</p>
          <a href="mailto:sacknest.info@gmail.com" className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest border-2 border-white hover:bg-white hover:text-black hover:border-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
