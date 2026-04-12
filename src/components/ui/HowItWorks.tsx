const steps = [
    { number: 1, title: "Sign Up", description: "Fill out our partner application form.", position: "top" },
    { number: 2, title: "Verify & Approve", description: "Our team reviews and approves your asset.", position: "bottom" },
    { number: 3, title: "List & Manage", description: "Upload your cars, villas, clubs, or events.", position: "top" },
    { number: 4, title: "Earn Revenue", description: "Start receiving bookings from high-end clients.", position: "bottom" },
];

export default function HowItWorks() {
    return (
        <section className="w-full bg-white px-4 sm:px-8 md:px-12 lg:px-20 pt-64 md:pt-72 2xl:pt-[450px]">

            {/* Heading */}
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-gray-900">How It Works</h2>
                <p className="mt-4 text-sm sm:text-base 2xl:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                    Partner with Vidi Vici Rental in four easy steps and start earning from your luxury
                    assets with ease and confidence.
                </p>
            </div>

            {/* ── Desktop Layout (md+) ─────────────────────────────── */}
            <div className="hidden md:block relative">
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1000 260"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <path d="M 125 65 C 210 65, 230 195, 375 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 375 195 C 530 195, 470 65, 625 65" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 625 65 C 780 65, 720 195, 875 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                </svg>

                <div className="relative z-10 grid grid-cols-4" style={{ height: "260px" }}>
                    {steps.map((step) =>
                        step.position === "top" ? (
                            <div key={step.number} className="flex flex-col items-center text-center pt-8">
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                                <div className="mt-5 max-w-[160px] 2xl:max-w-[200px]">
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl">{step.title}</p>
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div key={step.number} className="flex flex-col items-center text-center justify-end pb-8">
                                <div className="max-w-[160px] 2xl:max-w-[200px] mb-5">
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 leading-relaxed">{step.description}</p>
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl mt-2">{step.title}</p>
                                </div>
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* ── Mobile Layout (<md) — zigzag 2-column ────────────── */}
            <div className="md:hidden">

                {/* Single SVG that covers both rows + connector */}
                <div className="relative" style={{ minHeight: "410px" }}>
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 300 410"
                        preserveAspectRatio="none"
                        fill="none"
                    >
                        {/* Step 1 → Step 2 */}
                        <path
                            d="M 75 40 C 150 40, 150 140, 225 140"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 2 → Step 3 */}
                        <path
                            d="M 225 140 C 225 230, 75 230, 75 270"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 3 → Step 4 */}
                        <path
                            d="M 75 270 C 150 270, 150 370, 225 370"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                    </svg>

                    {/* Step 1 — left, top-aligned */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4 pt-8" style={{ top: -16 }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            1
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Sign Up</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                Fill out our partner application form.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 — right, at ~140px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "34px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                Our team reviews and approves your asset.
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">Verify &amp; Approve</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            2
                        </div>
                    </div>

                    {/* Step 3 — left, at ~270px from top (circle center) */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "240px" }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            3
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">List &amp; Manage</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                Upload your cars, villas, clubs, or events.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 — right, at ~370px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "260px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                Start receiving bookings from high-end clients.
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">Earn Revenue</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            4
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}