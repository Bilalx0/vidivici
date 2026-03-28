"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 2 seconds
    setTimeout(() => {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
      });
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <section className="w-full bg-white py-12 sm:px-16 lg:px-20 px-10">
      <div className="">
        <div className="border border-gray-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Left Panel - Contact Info */}
          <div className="bg-gray-100 p-8 md:w-1/3 flex-shrink-0 flex flex-col gap-8 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-400 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Header Text */}
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-mist-900 leading-snug mb-3">
                Have questions or want to book your luxury experience?
              </h3>
              <p className="text-sm text-mist-600 leading-relaxed">
                Our team is here to assist you with cars, villas, and VIP events in Los Angeles
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300"></div>

            {/* Contact Info Items */}
            <div className="relative z-10 flex flex-col gap-6">
              <ContactInfo
                icon={<Phone size={16} />}
                label="Phone"
                value="(310) 555-0991"
              />
              <ContactInfo
                icon={<Mail size={16} />}
                label="Email"
                value="admin@vidivicitrental.com"
              />
              <ContactInfo
                icon={<MapPin size={16} />}
                label="Address"
                value="8687 Melrose Ave, Los Angeles CA 90069, United States"
              />
              <ContactInfo
                icon={<Clock size={16} />}
                label="Working Hours"
                value="Mon–Sun: 8 AM – 8 PM"
              />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-mist-900 mb-8 tracking-tight">
              Get in touch with us
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Full Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Full Name">
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200 bg-white"
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
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200 bg-white"
                    required
                  />
                </Field>
              </div>

              {/* Phone & Inquiry Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Phone">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-gray-400 transition-colors duration-200 bg-white">
                    <span className="px-4 py-3 text-lg border-r border-gray-300 bg-gray-50 flex items-center gap-2 text-mist-600 flex-shrink-0">
                      🇺🇸
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 text-sm text-mist-900 placeholder-gray-400 outline-none bg-white"
                      required
                    />
                  </div>
                </Field>
                <Field label="Inquiry Type">
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200 bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Select your inquiry type
                    </option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200 bg-white resize-none"
                  required
                />
              </Field>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-mist-900 text-white font-semibold py-4 rounded-xl hover:bg-mist-800 transition-colors duration-200 mt-2"
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">
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
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-mist-900">{label}</p>
        <p className="text-sm text-mist-600 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
