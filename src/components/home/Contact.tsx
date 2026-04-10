"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react";
import Turnstile from "@/components/Turnstile";

const inquiryTypes = [
  "Car Rental",
  "Villa Booking",
  "VIP Event",
  "Partnership",
  "General Inquiry",
];

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const category = form.inquiryType === "Car Rental" ? "Car" : form.inquiryType === "Villa Booking" ? "Villa" : form.inquiryType === "VIP Event" ? "Event" : "General";
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "homepage-contact",
          category,
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          subject: form.inquiryType || "General Inquiry",
          message: form.message,
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error();
      setIsSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", inquiryType: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white py-12 2xl:py-32 sm:px-16 lg:px-20 px-6 2xl:px-32">
      <div className="">
        <div className="border border-mist-200 rounded-3xl 2xl:rounded-[48px] overflow-hidden gap-8 2xl:gap-14 sm:p-8 2xl:p-14 px-4 py-6 flex flex-col md:flex-row shadow-sm">
          
          {/* Left Panel - Contact Info */}
          <div className="bg-mist-100 px-4 sm:px-8 py-8 2xl:py-14 md:w-1/3 2xl:w-[480px] flex-shrink-0 flex flex-col gap-8 2xl:gap-12 relative overflow-hidden rounded-2xl 2xl:rounded-[32px]">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-64 h-64 2xl:w-[460px] bg-gradient-to-br from-mist-400 to-transparent rounded-full blur-3xl"></div>
            </div>

            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180"
            />

            {/* Header Text */}
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl 2xl:text-3xl font-bold text-mist-900 leading-tight mb-3 2xl:mb-6">
                Have questions or want to book your luxury experience?
              </h3>
              <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed">
                Our team is here to assist you with cars, villas, and VIP events in Los Angeles
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-mist-300"></div>

            {/* Contact Info Items */}
            <div className="relative z-10 flex flex-col gap-6 2xl:gap-9">
              <ContactInfo
                icon={<Phone className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />}
                label="Phone"
                value="(310) 555-0991"
              />
              <ContactInfo
                icon={<Mail className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />}
                label="Email"
                value="admin@vidivicitrental.com"
              />
              <ContactInfo
                icon={<MapPin className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />}
                label="Address"
                value="8687 Melrose Ave, Los Angeles CA 90069, United States"
              />
              <ContactInfo
                icon={<Clock className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />}
                label="Working Hours"
                value="Mon–Sun: 8 AM – 8 PM"
              />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-mist-900 mb-8 2xl:mb-12 tracking-tight">
              Get in touch with us
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 2xl:gap-8">
              {/* Full Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
                <Field label="Full Name">
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white"
                    required
                  />
                </Field>
                <Field label="Email">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white"
                    required
                  />
                </Field>
              </div>

              {/* Phone & Inquiry Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
                <Field label="Phone">
                  <div className="flex items-center border border-mist-300 rounded-xl 2xl:rounded-2xl overflow-hidden focus-within:border-mist-400 transition-colors duration-200 bg-white">
                    <span className="px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl border-r border-mist-300 bg-mist-50 flex items-center gap-2 text-mist-600 flex-shrink-0">
                      🇺🇸
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 outline-none bg-white"
                      required
                    />
                  </div>
                </Field>
                <Field label="Inquiry Type">
                  <div className="relative">
                    <select
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={handleChange}
                      className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 pr-12 2xl:px-6 2xl:pr-12 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select your inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500 2xl:right-5 2xl:h-[1.1rem] 2xl:w-[1.1rem]" />
                  </div>
                </Field>
              </div>

              {/* Message */}
              <Field label="Message">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white resize-none"
                  required
                />
              </Field>

              {/* Turnstile */}
              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-mist-900 text-white font-normal py-4 2xl:py-6 rounded-xl 2xl:rounded-2xl text-sm 2xl:text-xl hover:bg-mist-800 transition-all duration-200 mt-2 active:scale-[0.99]"
                disabled={!turnstileToken}
              >
                {isSubmitted ? "Message Sent!" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 2xl:gap-4">
      <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

interface ContactInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ContactInfo({ icon, label, value }: ContactInfoProps) {
  return (
    <div className="flex items-start gap-4 2xl:gap-6">
      <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm 2xl:text-lg font-normal text-mist-900">{label}</p>
        <p className="text-sm 2xl:text-lg text-mist-500 leading-relaxed mt-1">{value}</p>
      </div>
    </div>
  );
}