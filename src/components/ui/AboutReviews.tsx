"use client";

const reviews = [
  {
    id: 1,
    name: "James Whitfield",
    avatar: "https://i.pravatar.cc/40?img=11",
    rating: 5,
    text: "Absolutely seamless experience from start to finish. The Rolls Royce Ghost was immaculate and the chauffeur was incredibly professional. Vidi Vici sets a new standard for luxury car rentals in LA.",
  },
  {
    id: 2,
    name: "Sofia Reyes",
    avatar: "https://i.pravatar.cc/40?img=47",
    rating: 5,
    text: "I booked a Lamborghini Huracán for a weekend trip to Malibu. The process was effortless, no hidden fees, and the car was a dream. Will absolutely be back for every special occasion.",
  },
  {
    id: 3,
    name: "Marcus Chen",
    avatar: "https://i.pravatar.cc/40?img=33",
    rating: 4,
    text: "Rented the Porsche Carrera for my anniversary. My partner was blown away. The team went above and beyond to ensure every detail was perfect. Highly recommend to anyone wanting a premium experience.",
  },
  {
    id: 4,
    name: "Priya Nair",
    avatar: "https://i.pravatar.cc/40?img=56",
    rating: 5,
    text: "From the VIP event service to the Tesla Cybertruck delivery right to my door, nothing was short of spectacular. Vidi Vici truly understands what luxury hospitality means.",
  },
  {
    id: 5,
    name: "Ethan Brooks",
    avatar: "https://i.pravatar.cc/40?img=15",
    rating: 5,
    text: "The Ferrari 488 Spider was in perfect condition and the whole booking process took under five minutes. Transparent pricing, friendly staff, and an unforgettable drive along the Pacific Coast Highway.",
  },
  {
    id: 6,
    name: "Lena Müller",
    avatar: "https://i.pravatar.cc/40?img=44",
    rating: 4,
    text: "I was skeptical at first but Vidi Vici completely exceeded my expectations. The Range Rover V8 was spotless and delivery was on time. Customer support was responsive and kind throughout.",
  },
  {
    id: 7,
    name: "Andre Fontaine",
    avatar: "https://i.pravatar.cc/40?img=22",
    rating: 5,
    text: "Used Vidi Vici for a client event and it made a huge impression. The vehicles are pristine and the professionalism is unmatched. This is the only service I trust for luxury rentals.",
  },
  {
    id: 8,
    name: "Camille Torres",
    avatar: "https://i.pravatar.cc/40?img=49",
    rating: 5,
    text: "Booked the Bentley for my wedding day and it was perfect. The team coordinated everything flawlessly. I cannot imagine that special day without the magic Vidi Vici added to it.",
  },
  {
    id: 9,
    name: "Noah Williams",
    avatar: "https://i.pravatar.cc/40?img=7",
    rating: 4,
    text: "Great selection of exotic cars and honest pricing. I've rented twice now and both times the experience has been top tier. The app makes it incredibly easy to manage your booking.",
  },
];

const col1 = reviews.slice(0, 3);
const col2 = reviews.slice(3, 6);
const col3 = reviews.slice(6, 9);

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < rating ? "#FACC15" : "none"}
          stroke={i < rating ? "#FACC15" : "#D1D5DB"}
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 w-full">
      {/* Avatar + name + stars on top */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-[13px] font-semibold text-gray-900 leading-none mb-1">
            {review.name}
          </p>
          <Stars rating={review.rating} />
        </div>
      </div>
      {/* Text below */}
      <p className="text-[12.5px] text-gray-500 leading-relaxed">{review.text}</p>
    </div>
  );
}

interface ColProps {
  reviews: typeof col1;
  duration: number;
  tilt: number;
}

function ScrollColumn({ reviews, duration, tilt }: ColProps) {
  const doubled = [...reviews, ...reviews];
  return (
    <div
      className="flex-1 overflow-hidden scroll-col"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .scroll-col:hover > div { animation-play-state: paused; }
      `}</style>
      <div
        className="flex flex-col"
        style={{ animation: `scrollUp ${duration}s linear infinite` }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative w-full bg-white py-32 px-20 overflow-hidden">

      {/* Header */}
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          What Our Customers Are Saying
        </h2>
        <p className="mt-3 text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          From first-class service to unforgettable moments, our clients share
          why Vidi Vici is their choice for luxury in Los Angeles.
        </p>
      </div>

      {/* Columns */}
      <div className=" flex gap-5 h-[600px]">
        <ScrollColumn reviews={col1} duration={22} tilt={-1.5} />
        <ScrollColumn reviews={col2} duration={18} tilt={0} />
        <ScrollColumn reviews={col3} duration={25} tilt={1.5} />
      </div>

      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, white, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, white, transparent)" }} />

    </section>
  );
}