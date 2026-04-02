"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ReactNode } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Banner from "@/components/ui/Banner";
import FAQ from "@/components/home/FAQ";
import Turnstile from "@/components/Turnstile";

interface ContactDetail {
  icon: ReactNode;
  label: string;
  lines: string[];
}


// Add this helper component outside or inside the page component
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 2xl:gap-3">
      {label && <label className="text-[12px] 2xl:text-xl font-semibold text-mist-700">{label}</label>}
      {children}
    </div>
  );
}

const contactDetails: ContactDetail[] = [
  {
    icon: <Phone size={20} />,
    label: "Phone",
    lines: ["(310) 774-0991"],
  },
  {
    icon: <Mail size={20} />,
    label: "Email",
    lines: ["admin@vidivicitrental.com", "We reply within 24 hours"],
  },
  {
    icon: <MapPin size={20} />,
    label: "Address",
    lines: ["8687 Melrose Ave, Los Angeles", "CA 90069, United States"],
  },
  {
    icon: <Clock size={20} />,
    label: "Working Hours",
    lines: ["Mon–Sun: 9 AM – 11 PM", "24/7 VIP Concierge Available"],
  },
];

export default function ContactPage() {


  type TripNeed = "House" | "Car" | "VIP events";

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", adults: "", kids: "", budget: "", tripNeed: "House" as TripNeed, startDate: "", endDate: "", notes: "" });
  const [startDateFocused, setStartDateFocused] = useState(false);
  const [endDateFocused, setEndDateFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const category = form.tripNeed === "Car" ? "Car" : form.tripNeed === "House" ? "Villa" : form.tripNeed === "VIP events" ? "Event" : "General";
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-page",
          category,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          subject: `Trip Inquiry - ${form.tripNeed}`,
          message: form.notes || null,
          turnstileToken,
          data: {
            adults: form.adults,
            kids: form.kids,
            budget: form.budget,
            tripNeed: form.tripNeed,
            startDate: form.startDate,
            endDate: form.endDate,
          },
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Inquiry submitted successfully!");
      setForm({ firstName: "", lastName: "", email: "", phone: "", adults: "", kids: "", budget: "", tripNeed: "House" as TripNeed, startDate: "", endDate: "", notes: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-mist-200 rounded-md 2xl:rounded-2xl px-4 py-2.5 2xl:px-8 2xl:py-6 text-[13px] 2xl:text-2xl text-mist-900 placeholder-mist-300 outline-none focus:border-mist-400 transition-colors bg-white";

  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <Banner
        heading="Contact Us"
        description={false}
        searchBar={false}
        image="/banner1.png"
        height="h-96"
      />

      <section className="w-full bg-[#F0F1F2] pt-14 pb-96 px-6 sm:px-14 md:px-24 2xl:pt-20 2xl:pb-[600px] 2xl:px-40">
        <div className="mx-auto py-16 2xl:py-32 2xl:max-w-[1800px]">
          <div className="text-center mb-10 space-y-8 2xl:mb-16 2xl:space-y-12">
            <h2 className="text-3xl font-bold text-mist-900 2xl:text-6xl">
              Get in Touch with Vidi Vici
            </h2>
            <p className="mt-2 text-base text-mist-500 leading-relaxed max-w-xl mx-auto 2xl:text-2xl 2xl:max-w-2xl">
              Whether you're booking a luxury car, an exclusive villa, or VIP club access —
              we're here to make it effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-8">
            {contactDetails.map((item) => (
              <div
                key={item.label}
                className="bg-white border border-mist-100 rounded-2xl 2xl:rounded-[40px] py-4 2xl:py-8 flex flex-col items-center text-center gap-2 2xl:gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 2xl:w-16 2xl:h-16 rounded-md border border-mist-100 bg-mist-200 flex items-center justify-center text-mist-500">
                  {item.icon}
                </div>
                <p className="text-[13px] 2xl:text-xl font-normal text-mist-900">{item.label}</p>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-[12px] 2xl:text-lg text-mist-500 leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

        </div>
      </section>
      <section className="-mt-96 relative z-10 2xl:-mt-[600px]">
        <div className="w-full pt-16 2xl:pt-32 px-6 sm:px-14 md:px-24 2xl:px-40">
          <div className="max-w-4xl mx-auto 2xl:max-w-full bg-white rounded-2xl 2xl:rounded-[60px] shadow-sm border border-mist-100 px-8 py-10 2xl:px-16 2xl:py-20">

            <h2 className="text-2xl font-bold text-mist-900 text-center tracking-tight mb-8 2xl:text-5xl 2xl:mb-16">
              Start Planning Your Luxury Experience
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 2xl:gap-10">

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                <Field label="First Name">
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter your first name" className={inputCls} />
                </Field>
                <Field label="Last Name">
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter your last name" className={inputCls} />
                </Field>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                <Field label="Email">
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className={inputCls} />
                </Field>
                <Field label="Phone Number">
                  <div className="flex items-center border border-mist-200 rounded-xl 2xl:rounded-2xl overflow-hidden focus-within:border-mist-400 transition-colors bg-white">
                    <span className="px-3 py-2.5 2xl:px-8 2xl:py-6 text-sm 2xl:text-2xl border-r border-mist-200 bg-mist-50 text-mist-600 flex-shrink-0">🇺🇸 +1</span>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 555-5555" className="flex-1 px-3 py-2.5 2xl:px-8 2xl:py-6 text-[13px] 2xl:text-2xl text-mist-900 placeholder-mist-300 outline-none" />
                  </div>
                </Field>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                <Field label="Adults">
                  <input name="adults" type="number" min={1} value={form.adults} onChange={handleChange} placeholder="1" className={inputCls} />
                </Field>
                <Field label="Kids">
                  <input name="kids" type="number" min={0} value={form.kids} onChange={handleChange} placeholder="2" className={inputCls} />
                </Field>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                <Field label="Your Budget">
                  <div className="relative">
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className={`${inputCls} ${!form.budget ? "text-mist-400" : "text-mist-900"} appearance-none pr-10`}
                    >
                      <option value="" disabled>Select a budget</option>
                      {["$1,000–$5,000", "$5,000–$10,000", "$10,000–$25,000", "$25,000+"].map((o) => (
                        <option key={o} value={o} className="text-mist-900">{o}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mist-500"
                    />
                  </div>
                </Field>
                <Field label="What do you need for your trip?">
                  <div className="flex items-center gap-4 2xl:gap-8 h-[42px] 2xl:h-[80px] px-1">
                    {(["House", "Car", "VIP events"] as const).map((need) => (
                      <label key={need} className="flex items-center gap-1.5 cursor-pointer text-[13px] 2xl:text-2xl text-mist-700">
                        <input type="radio" name="tripNeed" value={need} checked={form.tripNeed === need} onChange={handleChange} className="accent-mist-900 w-4 h-4 2xl:w-6 2xl:h-6" />
                        {need}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                <Field label="Start Date">
                  <input
                    name="startDate"
                    type={startDateFocused ? "date" : "text"}
                    value={form.startDate}
                    onChange={handleChange}
                    onFocus={() => setStartDateFocused(true)}
                    onBlur={() => setStartDateFocused(false)}
                    placeholder="Start date"
                    className={inputCls} 
                  />
                </Field>
                <Field label="End Date">
                  <input
                    name="endDate"
                    type={endDateFocused ? "date" : "text"}
                    value={form.endDate}
                    onChange={handleChange}
                    onFocus={() => setEndDateFocused(true)}
                    onBlur={() => setEndDateFocused(false)}
                    placeholder="End date"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Notes */}
              <Field label="Additional Notes">
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Write any special requests or notes here..." rows={4} className={`${inputCls} resize-none`} />
              </Field>

              <button type="submit" disabled={submitting} className="w-full bg-mist-900 text-white text-[14px] 2xl:text-3xl font-semibold py-3.5 2xl:py-8 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200 mt-1 2xl:mt-2 disabled:opacity-50">
                {submitting ? "Sending..." : "Send Request"}
              </button>

              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

            </form>
          </div>
        </div>
      </section>
      <FAQ />
      <section className="w-full h-96 mt-20 2xl:h-[500px] 2xl:mt-40">
        <iframe
          src="https://www.google.com/maps?q=8687+Melrose+Ave,+Los+Angeles,+CA+90069&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}