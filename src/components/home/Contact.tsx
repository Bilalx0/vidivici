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

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll be in touch shortly.");
  };

  return (
    <section className="w-full bg-white py-8 px-4 sm:px-10 md:py-16 md:px-20">
      <div className="border border-gray-200 rounded-3xl flex flex-col md:flex-row p-3 gap-3 md:h-[500px]">

          {/* Left panel */}
          <div className="bg-[#F0F1F2] p-5 sm:p-8 md:w-[380px] flex-shrink-0 flex flex-col gap-6 relative overflow-hidden rounded-2xl">
            {/* Vector image */}
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-[89%] w-auto object-contain object-right pointer-events-none select-none"
            />

            <div>
              <h3 className="text-[18px] font-black text-gray-900 leading-snug mb-2">
                Have questions or want to book your luxury experience?
              </h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                Our team is here to assist you with cars, villas, and VIP events in Los Angeles
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 flex flex-col gap-5">
              <ContactInfo
                icon={<Phone size={15} />}
                label="Phone"
                value="(310) 555-0991"
              />
              <ContactInfo
                icon={<Mail size={15} />}
                label="Email"
                value="admin@vidivicitrental.com"
              />
              <ContactInfo
                icon={<MapPin size={15} />}
                label="Address"
                value={"8687 Melrose Ave, Los Angeles CA\n90069, United States"}
              />
              <ContactInfo
                icon={<Clock size={15} />}
                label="Working Hours"
                value="Mon–Sun: 8 AM – 8 PM"
              />
            </div>
          </div>

          {/* Right form */}
          <div className="flex-1 p-4 sm:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
              Get in touch with us
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-base"
                  />
                </Field>
                <Field label="Email">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="input-base"
                  />
                </Field>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-400 transition-colors">
                    <span className="px-3 py-2.5 text-sm border-r border-gray-200 bg-gray-50 flex items-center gap-1.5 text-gray-600">
                      🇺🇸
                    </span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="flex-1 px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 outline-none bg-white"
                    />
                  </div>
                </Field>
                <Field label="Inquiry Type">
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className="input-base text-gray-400 appearance-none"
                  >
                    <option value="" disabled>Select your inquiry type</option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t} className="text-gray-900">{t}</option>
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
                  rows={4}
                  className="input-base resize-none"
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white text-[14px] font-semibold py-3.5 rounded-xl hover:bg-gray-700 transition-colors duration-200 mt-1"
              >
                Send
              </button>
            </form>
          </div>
        </div>

      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          color: #111827;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base::placeholder { color: #d1d5db; }
        .input-base:focus { border-color: #9ca3af; }
      `}</style>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function ContactInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-bold text-gray-900">{label}</p>
        <p className="text-[12px] text-gray-400 leading-relaxed whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}