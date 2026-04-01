"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Banner from "@/components/ui/Banner";

type Category = "All" | "Cars" | "Villas" | "Events" | "Payments & Policies";

interface FAQ {
  id: number;
  category: Exclude<Category, "All">;
  question: string;
  answer: string;
}

const categories: Category[] = ["All", "Cars", "Villas", "Events", "Payments & Policies"];

const faqs: FAQ[] = [
  {
    id: 1,
    category: "Cars",
    question: "What types of luxury cars do you offer?",
    answer: "We offer an extensive fleet including supercars, SUVs, convertibles, and chauffeur-driven vehicles from brands like Ferrari, Lamborghini, Rolls Royce, Bentley, Porsche, and more.",
  },
  {
    id: 2,
    category: "Cars",
    question: "What is the minimum rental period for a car?",
    answer: "Our minimum rental period is 24 hours. For certain exotic vehicles, a 2-day minimum may apply. Long-term rentals of a week or more come with preferential rates.",
  },
  {
    id: 3,
    category: "Cars",
    question: "Is there a security deposit required?",
    answer: "Yes, a refundable security deposit is required at the time of pickup. The amount varies by vehicle class, typically ranging from $2,000 to $10,000.",
  },
  {
    id: 4,
    category: "Cars",
    question: "Can I get the car delivered to my location?",
    answer: "Absolutely. We offer complimentary delivery and pickup within the greater Los Angeles area. Airport deliveries to LAX, BUR, and SNA are also available.",
  },
  {
    id: 5,
    category: "Villas",
    question: "What amenities are included with villa rentals?",
    answer: "All villas include private pools, high-speed WiFi, fully equipped kitchens, and concierge service. Many properties also offer home theaters, gyms, and stunning city or ocean views.",
  },
  {
    id: 6,
    category: "Villas",
    question: "Is daily housekeeping available?",
    answer: "Yes, daily housekeeping is available on request for all villa rentals. This can be arranged through your dedicated concierge at the time of booking.",
  },
  {
    id: 7,
    category: "Villas",
    question: "What is the minimum stay for a villa?",
    answer: "The minimum stay is typically 2 nights. During peak seasons and holidays, a 3–5 night minimum may apply depending on the property.",
  },
  {
    id: 8,
    category: "Events",
    question: "What kind of VIP events do you provide access to?",
    answer: "We curate access to exclusive nightlife events, private parties, celebrity gatherings, art openings, and high-profile sporting events throughout Los Angeles.",
  },
  {
    id: 9,
    category: "Events",
    question: "Can you arrange a full VIP experience package?",
    answer: "Yes. Our concierge team can build a complete package including transportation, venue access, private tables, and accommodation — all tailored to your preferences.",
  },
  {
    id: 10,
    category: "Payments & Policies",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), bank transfers, and select cryptocurrency payments. All transactions are secured and encrypted.",
  },
  {
    id: 11,
    category: "Payments & Policies",
    question: "What is your cancellation policy?",
    answer: "Cancellations made 72 hours or more before the rental date receive a full refund. Cancellations within 48 hours are subject to a 50% charge. No-shows are non-refundable.",
  },
  {
    id: 12,
    category: "Payments & Policies",
    question: "Are there any hidden fees?",
    answer: "No hidden fees — ever. All pricing is transparent and itemized at checkout. Taxes, delivery fees, and any optional add-ons are clearly shown before you confirm.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = activeCategory === "All"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="w-full">

      {/* Banner */}
      <Banner
        heading="FAQs"
        description="Find quick answers about our luxury cars, villas & nightlife experiences"
        searchBar={false}
        image="/banner5.png"
        height="h-96 2xl:h-[520px]"
      />

      {/* FAQ Section */}
      <section className="w-full min-h-screen">
        <div className="bg-mist-200 py-16 2xl:py-28 px-6 sm:px-16 lg:px-20 2xl:px-32">
          {/* Heading */}
          <h2 className="text-3xl 2xl:text-7xl font-bold text-mist-900 text-center tracking-tight mb-12 2xl:mb-20">
            Frequently Asked Questions
          </h2>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 2xl:gap-5 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                className={`px-4 2xl:px-8 py-2 2xl:py-4 rounded-lg 2xl:rounded-xl text-[12.5px] 2xl:text-xl font-semibold transition-all duration-200 ${activeCategory === cat
                  ? "bg-mist-900 text-white"
                  : "bg-white border border-mist-200 text-mist-600 hover:border-mist-400"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3 2xl:gap-5 mx-auto max-w-3xl 2xl:max-w-6xl px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-28">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-mist-200 bg-white rounded-2xl 2xl:rounded-3xl overflow-hidden transition-all duration-200 shadow-mist-300"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 2xl:px-8 py-4 2xl:py-6 text-left"
                >
                  <span className="text-[14px] 2xl:text-[1.65rem] font-semibold text-mist-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 2xl:w-12 2xl:h-12 rounded-xl 2xl:rounded-2xl flex items-center justify-center transition-colors duration-200 ${isOpen
                        ? "bg-mist-900 text-white"
                        : "bg-mist-900 text-white"
                      }`}
                  >
                    {isOpen
                      ? <Minus size={14} strokeWidth={2.5} />
                      : <Plus size={14} strokeWidth={2.5} />
                    }
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="bg-mist-50 border-t border-mist-100 px-5 2xl:px-8 py-4 2xl:py-6">
                    <p className="text-[13px] 2xl:text-xl text-mist-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative w-full bg-[#eeeeed] py-16 2xl:py-24 px-6 sm:px-16 lg:px-20 2xl:px-32 text-center overflow-hidden">

          <div className="relative z-10 max-w-md 2xl:max-w-4xl mx-auto flex flex-col items-center gap-8 2xl:gap-10">

            <h2 className="text-4xl 2xl:text-6xl font-bold text-mist-900 tracking-tight">
              Still have questions?
            </h2>
            <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
              Our dedicated support team is available 24/7 to assist you with
              bookings, inquiries, or custom requests.
            </p>
            <button className="mt-2 bg-mist-800 text-white text-base 2xl:text-xl px-7 2xl:px-12 py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
              Contact Us
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}