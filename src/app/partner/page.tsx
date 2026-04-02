"use client";

import { useState } from "react";
import FAQ from "@/components/home/FAQ";
import Banner from "@/components/ui/Banner";
import toast, { Toaster } from "react-hot-toast";
import {
    Eye, SlidersHorizontal, ShieldCheck,
    BadgeDollarSign, Headphones, Globe
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
                height="h-96"
                overlay="bg-bold/60"
                searchBar={false}
            />

            {/* Hero pitch — Your Assets section */}
            <section className="w-full bg-white sm:px-16 lg:px-20 px-6 py-16">
                <div className="flex flex-col md:flex-row items-center gap-10">

                    {/* Left text */}
                    <div className="flex-1 flex flex-col gap-5">
                        <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight tracking-tight">
                            Your Assets. Our<br />
                            Luxury Platform.<br />
                            Unlimited Potential.
                        </h2>
                        <p className="text-base text-mist-400 leading-relaxed max-w-sm">
                            At <span className="font-normal text-mist-700">Vidi Vici Rental</span>, we connect owners of luxury cars,
                            exclusive villas, world-class clubs, and event spaces with high-profile clients seeking
                            unforgettable experiences. By partnering with us, you gain access to an elite marketplace
                            designed to maximize visibility, prestige, and profitability.
                        </p>
                        <button className="w-fit bg-mist-900 text-white text-base font-medium px-7 py-3 rounded-xl hover:bg-mist-700 transition-colors duration-200">
                            Apply Now
                        </button>
                    </div>

                    {/* Right image */}
                    <div className="flex-1 w-full max-w-sm md:max-w-none">
                        <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
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
            <section className="w-full sm:px-16 lg:px-20 px-6 py-16">
                <div className="">

                    <div className="text-center mb-12 space-y-6">
                        <h2 className="text-4xl font-bold text-mist-900 tracking-tight">
                            Why Partner With Us
                        </h2>
                        <p className="mt-2 text-base text-mist-400 max-w-xl mx-auto leading-relaxed">
                            Unlock the full potential of your luxury assets and reach an elite audience effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-16">
                        {whyPartnerFeatures.map((f) => (
                            <div
                                key={f.title}
                                className="
  bg-white rounded-2xl border border-mist-200 p-6 flex flex-col gap-3
  shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_30px_rgba(0,0,0,0.10)]
  transition-all duration-300
"
                            >
                                <div className="w-10 h-10 rounded-lg bg-mist-100 border border-mist-100 flex items-center justify-center text-neutral-600">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-mist-900">{f.title}</h3>
                                <p className="text-base text-mist-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Who Can Join */}
            <section
                className="relative w-full sm:px-16 lg:px-20 px-6 pt-16 overflow-visible"
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

                <div className="relative z-10">

                    {/* Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-mist-900">
                            Who Can Join
                        </h2>

                        <p className="mt-3 text-sm text-mist-500 max-w-xl mx-auto">
                            Whether you own a supercar, villa, club, or host exclusive events,
                            there's a place for your luxury asset in our elite network.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 top-36">
                        {whoCanJoin.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-56 p-3 rounded-3xl object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-mist-900">
                                        {item.title}
                                    </h3>

                                    <p className="text-base text-mist-500 mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* How It Works */}
            <section className="w-full bg-white sm:px-16 lg:px-20 px-6 mb-56 mt-72">
                <div className="">

                    {/* Heading */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-mist-900">How It Works</h2>

                        <p className="mt-6 text-base text-mist-500 max-w-xl mx-auto">
                            Partner with Vidi Vici Rental in four easy steps and start earning from your luxury
                            assets with ease and confidence.
                        </p>
                    </div>

                    {/* Steps Container */}
                    <div className="relative my-20 top-20">

                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-7 left-10 right-10 border-t-2 border-dashed border-mist-200"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0">

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-14 h-14 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                    1
                                </div>

                                <div className="mt-4 max-w-[150px]">
                                    <p className="font-semibold text-mist-900">Sign Up</p>
                                    <p className="text-sm text-mist-500 mt-1">
                                        Fill out our partner application form.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center relative z-10 -mt-20">
                                <div className="max-w-[150px] mb-4">
                                    <p className="text-sm text-mist-500">
                                        Our team reviews and approves your asset.
                                    </p>
                                    <p className="font-semibold text-mist-900 mt-1">
                                        Verify & Approve
                                    </p>
                                </div>

                                <div className="w-14 h-14 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                    2
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-14 h-14 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                    3
                                </div>

                                <div className="mt-4 max-w-[150px]">
                                    <p className="font-semibold text-mist-900">List & Manage</p>
                                    <p className="text-sm text-mist-500 mt-1">
                                        Upload your cars, villas, clubs, or events.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center relative z-10 -mt-20">
                                <div className="max-w-[150px] mb-4">
                                    <p className="text-sm text-mist-500">
                                        Start receiving bookings from high-end clients.
                                    </p>
                                    <p className="font-semibold text-mist-900 mt-1">
                                        Earn Revenue
                                    </p>
                                </div>

                                <div className="w-14 h-14 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                    4
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Become a Partner Form */}
            <section className="w-full sm:px-16 lg:px-20 px-6 py-16">
                <div className="">

                    {/* Heading */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-mist-900 tracking-tight">Become a Partner</h2>
                        <p className="mt-4 text-base text-mist-400 leading-relaxed max-w-2xl mx-auto">
                            Share your vehicles or properties with our vetted clientele. Complete the form below
                            and our team will get back to you shortly.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-3xl border border-mist-100 px-8 py-10  shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_30px_rgba(0,0,0,0.10)]
  transition-all duration-300">
                        <div className="flex flex-col gap-5">

                            {/* Row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Full Name</label>
                                    <input placeholder="Enter your full name" value={pForm.fullName} onChange={e => setPForm({...pForm, fullName: e.target.value})} className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Email</label>
                                    <input type="email" placeholder="Enter your email" value={pForm.email} onChange={e => setPForm({...pForm, email: e.target.value})} className={inputCls} />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Phone</label>
                                    <div className="flex items-center border border-mist-200 rounded-xl overflow-hidden focus-within:border-mist-400 transition-colors bg-white">
                                        <span className="px-3 py-2.5 text-sm border-r border-mist-200 bg-mist-50 text-mist-600 flex-shrink-0">🇺🇸</span>
                                        <input placeholder="Enter your phone number" value={pForm.phone} onChange={e => setPForm({...pForm, phone: e.target.value})} className="flex-1 px-3 py-2.5 text-base bg-mist-100 text-mist-900 placeholder-mist-300 outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">
                                        Company <span className="text-mist-300 font-normal">(optional)</span>
                                    </label>
                                    <input placeholder="Enter your company name" value={pForm.company} onChange={e => setPForm({...pForm, company: e.target.value})} className={inputCls} />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">What do you want to list?</label>
                                    <select className={`${inputCls} text-mist-400`} value={pForm.listingType} onChange={e => setPForm({...pForm, listingType: e.target.value})}>
                                        <option value="" disabled>Select one</option>
                                        <option>Luxury Car</option>
                                        <option>Villa / Property</option>
                                        <option>Club / Venue</option>
                                        <option>Event Space</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Primary Location / City</label>
                                    <input placeholder="Enter your location" value={pForm.location} onChange={e => setPForm({...pForm, location: e.target.value})} className={inputCls} />
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Fleet Size / Bedrooms / Capacity</label>
                                    <input placeholder="e.g. 6 cars • 12 bedrooms • 260 pax" value={pForm.capacity} onChange={e => setPForm({...pForm, capacity: e.target.value})} className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Your Rates (daily/weekly/monthly)</label>
                                    <input placeholder="$1,500/day • $8,500/week • $32,000/month" value={pForm.rates} onChange={e => setPForm({...pForm, rates: e.target.value})} className={inputCls} />
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Availability Blackout Dates</label>
                                    <input placeholder="e.g. Available year-round except Aug 5-20" value={pForm.blackoutDates} onChange={e => setPForm({...pForm, blackoutDates: e.target.value})} className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-base font-semibold text-mist-700">Insurance/Liability Coverage</label>
                                    <select className={`${inputCls} text-mist-400`} value={pForm.insurance} onChange={e => setPForm({...pForm, insurance: e.target.value})}>
                                        <option value="" disabled>Select coverage status</option>
                                        <option>Yes, verified coverage</option>
                                        <option>No coverage yet</option>
                                        <option>In progress</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 6 — full width */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-semibold text-mist-700">Website / Instagram</label>
                                <input placeholder="e.g. yoursite.com, @handle" value={pForm.website} onChange={e => setPForm({...pForm, website: e.target.value})} className={inputCls} />
                            </div>

                            {/* Textarea */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-semibold text-mist-700">Tell us about your asset(s)</label>
                                <textarea
                                    rows={4}
                                    placeholder="Models, specs, amenities, restrictions, preferred clientele, etc."
                                    value={pForm.description}
                                    onChange={e => setPForm({...pForm, description: e.target.value})}
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={pForm.agreed} onChange={e => setPForm({...pForm, agreed: e.target.checked})} className="w-4 h-4 rounded border-mist-300 accent-mist-900" />
                                <span className="text-[12.5px] text-mist-500">I agree to be contacted about my application.</span>
                            </label>

                            {/* Submit */}
                            <button onClick={handlePartnerSubmit} disabled={pSubmitting} className="w-full bg-mist-900 text-white text-[14px] font-semibold py-4 rounded-xl hover:bg-mist-700 transition-colors duration-200 mt-1 disabled:opacity-50">
                                {pSubmitting ? "Submitting..." : "Submit Application"}
                            </button>

                            {/* Trust badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                                {["Verified Client Base", "100% Secure Data", "Transparent Commission Structure"].map((badge) => (
                                    <div key={badge} className="flex items-center gap-1.5 text-[11.5px] text-mist-500 font-medium">
                                        <div className="w-4 h-4 rounded-full bg-mist-900 flex items-center justify-center flex-shrink-0">
                                            <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
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

            <div className="relative w-full bg-[#eeeeed] py-16 px-6 text-center mt-16">

                <div className="relative z-10 max-w-md mx-auto flex flex-col items-center gap-8">

                    <h2 className="text-5xl font-bold text-mist-900 tracking-tight">
                        Still have questions?
                    </h2>
                    <p className="text-base text-mist-500 leading-relaxed">
                        Our dedicated support team is available 24/7 to assist you with
                        bookings, inquiries, or custom requests.
                    </p>
                    <button className="mt-2 bg-mist-800 text-white text-base px-7 py-3 rounded-xl hover:bg-mist-700 transition-colors duration-200">
                        Contact Us
                    </button>
                </div>

            </div>

        </div>
    );
}