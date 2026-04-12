"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Who can become a partner with Vidi Vici Rental?",
    answer:
      "We welcome owners of luxury cars, exclusive villas, high-end clubs, and premium event spaces who want to connect with an elite clientele.",
  },
  {
    id: 2,
    question: "Are there any subscription or listing fees?",
    answer:
      "There are no upfront subscription fees. We operate on a commission-based model, meaning we only earn when you do. Listing your asset is completely free.",
  },
  {
    id: 3,
    question: "How do I set my rates and availability?",
    answer:
      "You have full control over your pricing and calendar. Through your partner dashboard, you can set daily rates, block dates, and update availability in real time.",
  },
  {
    id: 4,
    question: "What kind of clients will I be connected with?",
    answer:
      "Our clientele consists of high-net-worth individuals, celebrities, corporate executives, and discerning travelers seeking premium experiences in Los Angeles.",
  },
  {
    id: 5,
    question: "How long does it take to get approved as a partner?",
    answer:
      "Our vetting process typically takes 2–4 business days. Once approved, your listing goes live immediately and is promoted across our platform.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(1);

  return (
    /* Increased horizontal and vertical padding for 2xl */
    <section className="w-full bg-white mt-24 2xl:mt-48 sm:px-24 md:px-32 px-10 2xl:px-72">
      <div className="">

        {/* Header - Scaled to 7xl for 2xl screens */}
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center tracking-tight mb-10 2xl:mb-24 mt-20 2xl:mt-0">
          Frequently Asked Questions
        </h2>

        {/* Accordion Container - Larger gap for 2xl */}
        <div className="flex flex-col gap-3 2xl:gap-8">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-mist-200 rounded-2xl 2xl:rounded-3xl overflow-hidden transition-all duration-200"
              >
                {/* Question row - Increased padding and text size */}
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 2xl:px-12 2xl:py-6 text-left"
                >
                  <span className="text-base 2xl:text-2xl font-normal text-mist-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg 2xl:rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      isOpen
                        ? "bg-mist-900 text-white"
                        : "bg-mist-100 text-mist-600 hover:bg-mist-200"
                    }`}
                  >
                    {isOpen ? 
                      <Minus className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={2.5} /> : 
                      <Plus className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={2.5} />
                    }
                  </span>
                </button>

                {/* Answer Area - Increased max-height for 2xl text volume */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 2xl:max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-mist-50 border-t border-mist-100 px-5 py-4 2xl:px-12 2xl:py-10">
                    <p className="text-sm 2xl:text-2xl text-mist-500 leading-relaxed 2xl:max-w-4xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}