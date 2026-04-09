"use client";

import { useState } from "react";
import FAQ from "@/components/home/FAQ";
import Banner from "@/components/ui/Banner";
import toast, { Toaster } from "react-hot-toast";
import HowItWorks from "@/components/ui/HowItWorks";
import {
    Eye, SlidersHorizontal, ShieldCheck,
    BadgeDollarSign, Headphones, Globe, ChevronDown
} from "lucide-react";

const whyPartnerFeatures = [
    {
        icon: <Eye size={22} />,
        title: "Elite Exposure",
        description: "Get your listings seen by CEOs, celebrities, and international travelers.",
    },
    {
        icon: <SlidersHorizontal size={22} />,
        title: "Full Control",
        description: "Manage rates, schedules, and availability with ease.",
    },
    {
        icon: <ShieldCheck size={22} />,
        title: "Secure Bookings",
        description: "Verified clients, insurance checks, and trusted transactions.",
    },
    {
        icon: <BadgeDollarSign size={22} />,
        title: "Zero Subscription Fees",
        description: "You earn, we earn — simple and transparent.",
    },
    {
        icon: <Headphones size={22} />,
        title: "Concierge Support",
        description: "A dedicated team ensures a seamless partnership experience.",
    },
    {
        icon: <Globe size={22} />,
        title: "Global Reach",
        description: "Connect with elite clients and luxury travelers worldwide.",
    },
];

const whoCanJoin = [
    {
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
        title: "Supercar Owners",
        description: "List your exotic vehicles and earn premium returns.",
    },
    {
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
        title: "Villa Owners",
        description: "Showcase your exclusive properties to an elite audience.",
    },
    {
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&q=80",
        title: "Clubs & Venues",
        description: "Connect with top clients, host events and private parties.",
    },
    {
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
        title: "Event Hosts",
        description: "Curate high-end events and experiences for a premium clientele.",
    },
];

export default function PartnerPage() {
    const inputCls = "w-full border border-mist-200 rounded-xl bg-mist-100 px-4 py-2.5 text-sm text-mist-950 placeholder-mist-300 outline-none focus:border-mist-400 transition-colors ";
    const [pForm, setPForm] = useState({ fullName: "", email: "", phone: "", company: "", listingType: "", location: "", capacity: "", rates: "", blackoutDates: "", insurance: "", website: "", description: "", agreed: false });
    const [pSubmitting, setPSubmitting] = useState(false);

    const handlePartnerSubmit = async () => {
        if (!pForm.fullName || !pForm.email) { toast.error("Name and email are required"); return; }
        if (!pForm.agreed) { toast.error("Please agree to be contacted"); return; }
        setPSubmitting(true);
        try {
            const category = pForm.listingType === "Luxury Car" ? "Car" : pForm.listingType === "Villa / Property" ? "Villa" : pForm.listingType === "Club / Venue" || pForm.listingType === "Event Space" ? "Event" : "General";
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source: "partner",
                    category,
                    name: pForm.fullName,
                    email: pForm.email,
                    phone: pForm.phone,
                    subject: `Partner Application - ${pForm.listingType || "General"}`,
                    message: pForm.description,
                    data: { company: pForm.company, listingType: pForm.listingType, location: pForm.location, capacity: pForm.capacity, rates: pForm.rates, blackoutDates: pForm.blackoutDates, insurance: pForm.insurance, website: pForm.website },
                }),
            });
            if (!res.ok) throw new Error();
            toast.success("Application submitted successfully!");
            setPForm({ fullName: "", email: "", phone: "", company: "", listingType: "", location: "", capacity: "", rates: "", blackoutDates: "", insurance: "", website: "", description: "", agreed: false });
        } catch {
            toast.error("Failed to submit. Please try again.");
        } finally {
            setPSubmitting(false);
        }
    };
    return (
        <div className="w-full">
            <Toaster position="top-right" />

            {/* Banner */}
            <Banner
                heading="Become a Partner"
                description="Turn your luxury assets into a premium revenue stream with Vidi Vici Rental."
                image="/banner5.png"
                height="h-96 2xl:h-[700px]"
                overlay="bg-bold/60"
                searchBar={false}
            />

            {/* Hero pitch — Your Assets section */}
            <section className="w-full bg-white sm:px-16 lg:px-20 px-6 py-16 2xl:py-28 2xl:px-32">
                <div className="flex flex-col md:flex-row items-center gap-10 2xl:gap-20 ">

                    {/* Left text */}
                    <div className="flex-1 flex flex-col gap-5 2xl:gap-8">
                        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight tracking-tight">
                            Your Assets. Our<br />
                            Luxury Platform.<br />
                            Unlimited Potential.
                        </h2>
                        <p className="text-base 2xl:text-2xl text-mist-400 leading-relaxed max-w-sm 2xl:max-w-2xl">
                            At <span className="font-normal text-mist-700">Vidi Vici Rental</span>, we connect owners of luxury cars,
                            exclusive villas, world-class clubs, and event spaces with high-profile clients seeking
                            unforgettable experiences. By partnering with us, you gain access to an elite marketplace
                            designed to maximize visibility, prestige, and profitability.
                        </p>
                        <button className="w-fit bg-mist-900 text-white text-base 2xl:text-2xl font-medium px-7 2xl:px-12 py-3 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
                            Apply Now
                        </button>
                    </div>

                    {/* Right image */}
                    <div className="flex-1 w-full max-w-sm md:max-w-none">
                        <div className="rounded-2xl 2xl:rounded-[40px] overflow-hidden shadow-md aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
                                alt="Business handshake"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* Why Partner With Us */}
            <section className="w-full sm:px-16 lg:px-20 px-6 py-16 2xl:py-32 2xl:px-32">
                <div className="">

                    <div className="text-center mb-12 2xl:mb-20 space-y-6 2xl:space-y-10">
                        <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">
                            Why Partner With Us
                        </h2>
                        <p className="mt-2 text-base 2xl:text-2xl text-mist-400 max-w-xl 2xl:max-w-4xl mx-auto leading-relaxed">
                            Unlock the full potential of your luxury assets and reach an elite audience effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-10 my-16 2xl:my-24">
                        {whyPartnerFeatures.map((f) => (
                            <div
                                key={f.title}
                                className="
  bg-white rounded-2xl 2xl:rounded-[32px] border border-mist-200 p-6 2xl:p-10 flex flex-col gap-3 2xl:gap-5
  shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_30px_rgba(0,0,0,0.10)]
  transition-all duration-300
"
                            >
                                <div className="w-10 2xl:w-16 h-10 2xl:h-16 rounded-lg 2xl:rounded-2xl bg-mist-100 border border-mist-100 flex items-center justify-center text-neutral-600">
                                    <span className="2xl:scale-[1.5]">{f.icon}</span>
                                </div>
                                <h3 className="text-lg 2xl:text-3xl font-bold text-mist-900">{f.title}</h3>
                                <p className="text-base 2xl:text-2xl text-mist-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Who Can Join */}
            <section
                className="relative w-full sm:px-16 lg:px-20 px-6 pt-16 2xl:pt-28 overflow-visible h-[450px] 2xl:h-[800px]"
                style={{ backgroundColor: "#f0f0ee" }}
            >
                <img
                    src="/Vector 7.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180  "
                />

                <img
                    src="/Vector 7.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180 "
                />

                <div className="relative z-10 2xl:max-w-[1800px] 2xl:mx-auto">

                    {/* Heading */}
                    <div className="text-center">
                        <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900">
                            Who Can Join
                        </h2>

                        <p className="mt-3 2xl:mt-6 text-sm 2xl:text-2xl text-mist-500 max-w-xl 2xl:max-w-4xl mx-auto">
                            Whether you own a supercar, villa, club, or host exclusive events,
                            there's a place for your luxury asset in our elite network.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-10 relative z-10 top-20 2xl:top-36">
                        {whoCanJoin.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-xl 2xl:rounded-3xl overflow-hidden shadow-lg 2xl:shadow-2xl"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-56 2xl:h-96 p-3 2xl:p-6 rounded-3xl 2xl:rounded-[40px] object-cover"
                                />

                                <div className="p-4 2xl:p-8">
                                    <h3 className="text-lg 2xl:text-3xl font-bold text-mist-900">
                                        {item.title}
                                    </h3>

                                    <p className="text-base 2xl:text-2xl text-mist-500 mt-1 2xl:mt-4 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

        <HowItWorks />

            {/* Become a Partner Form */}
            <section className="w-full sm:px-16 lg:px-28 px-6 py-16 2xl:py-32 2xl:px-48">
                <div className="">

                    {/* Heading */}
                    <div className="text-center mb-16 2xl:mb-24">
                        <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">Become a Partner</h2>
                        <p className="mt-4 2xl:mt-8 text-base 2xl:text-2xl text-mist-400 leading-relaxed max-w-2xl 2xl:max-w-5xl mx-auto">
                            Share your vehicles or properties with our vetted clientele. Complete the form below
                            and our team will get back to you shortly.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-3xl 2xl:rounded-[48px] border border-mist-100 px-8 2xl:px-16 py-10 2xl:py-20 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_30px_rgba(0,0,0,0.10)]
  transition-all duration-300">
                        <div className="flex flex-col gap-5 2xl:gap-10">

                            {/* Row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Full Name</label>
                                    <input placeholder="Enter your full name" value={pForm.fullName} onChange={e => setPForm({...pForm, fullName: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Email</label>
                                    <input type="email" placeholder="Enter your email" value={pForm.email} onChange={e => setPForm({...pForm, email: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Phone</label>
                                    <div className="flex items-center border border-mist-200 rounded-xl 2xl:rounded-2xl overflow-hidden focus-within:border-mist-400 transition-colors bg-white">
                                        <span className="px-3 2xl:px-6 py-2.5 2xl:py-5 text-base 2xl:text-2xl border-r border-mist-200 bg-mist-50 text-mist-600 flex-shrink-0">🇺🇸</span>
                                        <input placeholder="Enter your phone number" value={pForm.phone} onChange={e => setPForm({...pForm, phone: e.target.value})} className="flex-1 px-3 2xl:px-6 py-2.5 2xl:py-5 text-base 2xl:text-xl bg-mist-100 text-mist-900 placeholder-mist-300 outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                        <label className="text-base 2xl:text-xl font-semibold text-mist-700">
                                            Company <span className="text-mist-300 font-normal">(optional)</span>
                                    </label>
                                    <input placeholder="Enter your company name" value={pForm.company} onChange={e => setPForm({...pForm, company: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">What do you want to list?</label>
                                    <div className="relative">
                                        <select className={`${inputCls} pr-10 appearance-none text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl text-mist-400`} value={pForm.listingType} onChange={e => setPForm({...pForm, listingType: e.target.value})}>
                                            <option value="" disabled>Select one</option>
                                            <option>Luxury Car</option>
                                            <option>Villa / Property</option>
                                            <option>Club / Venue</option>
                                            <option>Event Space</option>
                                        </select>
                                        <ChevronDown size={16} className="pointer-events-none absolute right-3 2xl:right-6 top-1/2 -translate-y-1/2 text-mist-400 2xl:scale-150" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Primary Location / City</label>
                                    <input placeholder="Enter your location" value={pForm.location} onChange={e => setPForm({...pForm, location: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Fleet Size / Bedrooms / Capacity</label>
                                    <input placeholder="e.g. 6 cars • 12 bedrooms • 260 pax" value={pForm.capacity} onChange={e => setPForm({...pForm, capacity: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Your Rates (daily/weekly/monthly)</label>
                                    <input placeholder="$1,500/day • $8,500/week • $32,000/month" value={pForm.rates} onChange={e => setPForm({...pForm, rates: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-8">
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Availability Blackout Dates</label>
                                    <input placeholder="e.g. Available year-round except Aug 5-20" value={pForm.blackoutDates} onChange={e => setPForm({...pForm, blackoutDates: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                                </div>
                                <div className="flex flex-col gap-1.5 2xl:gap-3">
                                    <label className="text-base 2xl:text-xl font-semibold text-mist-700">Insurance/Liability Coverage</label>
                                    <div className="relative">
                                        <select className={`${inputCls} pr-10 appearance-none text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl text-mist-400`} value={pForm.insurance} onChange={e => setPForm({...pForm, insurance: e.target.value})}>
                                            <option value="" disabled>Select coverage status</option>
                                            <option>Yes, verified coverage</option>
                                            <option>No coverage yet</option>
                                            <option>In progress</option>
                                        </select>
                                        <ChevronDown size={16} className="pointer-events-none absolute right-3 2xl:right-6 top-1/2 -translate-y-1/2 text-mist-400 2xl:scale-150" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 6 — full width */}
                            <div className="flex flex-col gap-1.5 2xl:gap-3">
                                <label className="text-base 2xl:text-xl font-semibold text-mist-700">Website / Instagram</label>
                                <input placeholder="e.g. yoursite.com, @handle" value={pForm.website} onChange={e => setPForm({...pForm, website: e.target.value})} className={`${inputCls} text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`} />
                            </div>

                            {/* Textarea */}
                            <div className="flex flex-col gap-1.5 2xl:gap-3">
                                <label className="text-base 2xl:text-xl font-semibold text-mist-700">Tell us about your asset(s)</label>
                                <textarea
                                    rows={4}
                                    placeholder="Models, specs, amenities, restrictions, preferred clientele, etc."
                                    value={pForm.description}
                                    onChange={e => setPForm({...pForm, description: e.target.value})}
                                    className={`${inputCls} resize-none text-base 2xl:text-xl py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl`}
                                />
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-2.5 2xl:gap-5 cursor-pointer">
                                <input type="checkbox" checked={pForm.agreed} onChange={e => setPForm({...pForm, agreed: e.target.checked})} className="w-4 2xl:w-6 h-4 2xl:h-6 rounded border-mist-300 accent-mist-900" />
                                <span className="text-[12.5px] 2xl:text-lg text-mist-500">I agree to be contacted about my application.</span>
                            </label>

                            {/* Submit */}
                            <button onClick={handlePartnerSubmit} disabled={pSubmitting} className="w-full bg-mist-900 text-white text-[14px] 2xl:text-2xl font-semibold py-4 2xl:py-8 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200 mt-1 disabled:opacity-50">
                                {pSubmitting ? "Submitting..." : "Submit Application"}
                            </button>

                            {/* Trust badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 2xl:gap-12 pt-2 2xl:pt-4">
                                {["Verified Client Base", "100% Secure Data", "Transparent Commission Structure"].map((badge) => (
                                    <div key={badge} className="flex items-center gap-1.5 2xl:gap-4 text-[11.5px] 2xl:text-xl text-mist-500 font-medium">
                                        <div className="w-4 2xl:w-8 h-4 2xl:h-8 rounded-full bg-mist-900 flex items-center justify-center flex-shrink-0">
                                            <svg width="8" height="8" viewBox="0 0 10 8" fill="none" className="2xl:w-5 2xl:h-5">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        {badge}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <FAQ />

            <div className="relative w-full bg-[#eeeeed] py-16 2xl:py-32 px-6 2xl:px-40 text-center mt-16 2xl:mt-32">

                <div className="relative z-10 max-w-md 2xl:max-w-4xl mx-auto flex flex-col items-center gap-8 2xl:gap-12">

                    <h2 className="text-5xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">
                        Still have questions?
                    </h2>
                    <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
                        Our dedicated support team is available 24/7 to assist you with
                        bookings, inquiries, or custom requests.
                    </p>
                    <button className="mt-2 bg-mist-800 text-white text-base 2xl:text-2xl px-7 2xl:px-12 py-3 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
                        Contact Us
                    </button>
                </div>

            </div>

        </div>
    );
}