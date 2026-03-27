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
    <section className="w-full bg-white py-8 px-4 sm:px-10 md:py-16 md:px-24">
      <div className="">

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center tracking-tight mb-10 mt-20">
          Frequently Asked Questions
        </h2>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Question row */}
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-semibold text-gray-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      isOpen
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-[13px] text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}