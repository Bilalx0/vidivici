"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/ui/CarCard";
import EventCard from "@/components/ui/EventCard";
import VillaCard from "@/components/ui/VillaCard";

type CollectionTab = "All" | "Cars" | "Villas" | "Events";

const cars = [
  {
    id: 1,
    brand: "Range Rover",
    name: "Range Rover V8",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    seats: "5",
    zeroToSixty: "4.4 sec",
    engine: "523 hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: true,
  },
  {
    id: 2,
    brand: "Tesla",
    name: "Cyber Truck",
    image: "https://images.unsplash.com/photo-1698778573682-346d219402b5?w=800&q=80",
    seats: "Up to 6",
    zeroToSixty: "Under 2.9 sec",
    engine: "800+ hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: false,
  },
  {
    id: 3,
    brand: "Porsche",
    name: "Carrera S 992.2 Cabriolet",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    seats: "2+2",
    zeroToSixty: "3.5 sec",
    engine: "443 hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: true,
  },
  {
    id: 4,
    brand: "Rolls Royce",
    name: "Rolls Royce Ghost",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    seats: "4",
    zeroToSixty: "4.8 sec",
    engine: "563 hp",
    pricePerDay: 899,
    originalPrice: "2,100",
    liked: false,
  },
  {
    id: 5,
    brand: "Lamborghini",
    name: "Huracan EVO",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    seats: "2",
    zeroToSixty: "2.9 sec",
    engine: "630 hp",
    pricePerDay: 1299,
    originalPrice: "2,800",
    liked: false,
  },
  {
    id: 6,
    brand: "Ferrari",
    name: "488 Spider",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
    seats: "2",
    zeroToSixty: "3.0 sec",
    engine: "660 hp",
    pricePerDay: 1199,
    originalPrice: "2,600",
    liked: false,
  },
  {
    id: 7,
    brand: "McLaren",
    name: "720S Coupe",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    seats: "2",
    zeroToSixty: "2.8 sec",
    engine: "710 hp",
    pricePerDay: 1399,
    originalPrice: "2,950",
    liked: false,
  },
  {
    id: 8,
    brand: "Mercedes",
    name: "G63 AMG",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
    seats: "5",
    zeroToSixty: "4.5 sec",
    engine: "577 hp",
    pricePerDay: 899,
    originalPrice: "1,950",
    liked: true,
  },
];

const villas = [
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Collina Royale",
    bedrooms: 6,
    guests: 12,
    sqft: "5.5k",
    price: "6,500",
    oldPrice: "7,500",
    isFavorited: false,
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Legende",
    bedrooms: 4,
    guests: 10,
    sqft: "4.8k",
    price: "6,200",
    oldPrice: "7,100",
    isFavorited: true,
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Solare",
    bedrooms: 5,
    guests: 10,
    sqft: "6.2k",
    price: "7,900",
    oldPrice: "9,100",
    isFavorited: false,
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Casa Del Mar",
    bedrooms: 5,
    guests: 10,
    sqft: "5.1k",
    price: "7,200",
    oldPrice: "8,800",
    isFavorited: false,
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Maison Blanc",
    bedrooms: 3,
    guests: 6,
    sqft: "3.9k",
    price: "5,100",
    oldPrice: "6,200",
    isFavorited: false,
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Aurore",
    bedrooms: 7,
    guests: 14,
    sqft: "7.2k",
    price: "9,800",
    oldPrice: "11,500",
    isFavorited: false,
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "The Summit",
    bedrooms: 5,
    guests: 10,
    sqft: "6.0k",
    price: "8,400",
    oldPrice: "9,900",
    isFavorited: true,
  },
];

const events = [
  {
    id: 21,
    venue: "Trinity Ballroom",
    name: "Prestige Gala Night",
    description: "An elevated venue experience for galas, launches, and red carpet evenings.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    liked: false,
  },
  {
    id: 22,
    venue: "Delilah Los Angeles",
    name: "Roaring '20s Private Dinner",
    description: "Iconic atmosphere for private dining and curated live entertainment.",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80",
    liked: true,
  },
  {
    id: 23,
    venue: "Nobu Malibu",
    name: "Oceanfront Celebration",
    description: "A coastal luxury setting for intimate and unforgettable event moments.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    liked: false,
  },
  {
    id: 24,
    venue: "Catch LA",
    name: "Rooftop Influencer Soiree",
    description: "Skyline views, signature dining, and a polished social experience.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    liked: false,
  },
  {
    id: 25,
    venue: "LIV Miami",
    name: "VIP Nightclub Experience",
    description: "High-energy nightlife with premium tables and curated entertainment.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    liked: true,
  },
  {
    id: 26,
    venue: "The Beverly Hills Hotel",
    name: "Garden Black-Tie Dinner",
    description: "Classic luxury venue styling for elegant formal events and receptions.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    liked: false,
  },
  {
    id: 27,
    venue: "Trinity Ballroom",
    name: "Award Night & Gala",
    description: "A cinematic ballroom setup tailored for high-profile award ceremonies.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    liked: false,
  },
];

export default function ExclusiveCollection() {
  const [activeTab, setActiveTab] = useState<CollectionTab>("Cars");
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const resetAndSetTab = (tab: CollectionTab) => {
    setActiveTab(tab);
    setActiveIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const getCardCount = () => {
    if (activeTab === "Cars") return cars.length;
    if (activeTab === "Villas") return villas.length;
    if (activeTab === "Events") return events.length;
    return cars.length + villas.length + events.length;
  };

  const maxIndex = Math.max(0, getCardCount() - 1);

  const getCardWidth = () => {
    if (!trackRef.current) return 300;
    const firstCard = trackRef.current.children[0] as HTMLElement | null;
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 300;
  };

  const scrollTo = (index: number) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, getCardCount() - 1));
    const cardWidth = getCardWidth();
    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const onTrackScroll = () => {
    if (!trackRef.current) return;
    const cardWidth = getCardWidth();
    setActiveIndex(Math.round(trackRef.current.scrollLeft / cardWidth));
  };

  const renderCards = () => {
    if (activeTab === "Cars") {
      return cars.map((car) => <CarCard key={`car-${car.id}`} car={car} />);
    }
    if (activeTab === "Villas") {
      return villas.map((villa) => (
        <VillaCard
          key={`villa-${villa.id}`}
          image={villa.image}
          tag={villa.tag}
          name={villa.name}
          bedrooms={villa.bedrooms}
          guests={villa.guests}
          sqft={villa.sqft}
          price={villa.price}
          oldPrice={villa.oldPrice}
          isFavorited={villa.isFavorited}
        />
      ));
    }
    if (activeTab === "Events") {
      return events.map((event) => <EventCard key={`event-${event.id}`} event={event} />);
    }

    return [
      ...cars.map((car) => <CarCard key={`all-car-${car.id}`} car={car} />),
      ...villas.map((villa) => (
        <VillaCard
          key={`all-villa-${villa.id}`}
          image={villa.image}
          tag={villa.tag}
          name={villa.name}
          bedrooms={villa.bedrooms}
          guests={villa.guests}
          sqft={villa.sqft}
          price={villa.price}
          oldPrice={villa.oldPrice}
          isFavorited={villa.isFavorited}
        />
      )),
      ...events.map((event) => <EventCard key={`all-event-${event.id}`} event={event} />),
    ];
  };

  return (
    <section className="w-full mt-24 2xl:mt-48  overflow-hidden">
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-40">
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center mb-8 2xl:mb-12">Our Exclusive Collection</h2>

        <div className="flex items-center justify-center gap-2 mb-8 2xl:mb-12">
          {(["All", "Cars", "Villas", "Events"] as CollectionTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => resetAndSetTab(tab)}
              className={`px-5 2xl:px-8 py-2 2xl:py-3 rounded-lg text-sm 2xl:text-xl transition-colors ${
                activeTab === tab
                  ? "bg-[#1f1f1f] text-white"
                  : "bg-[#e8e8e8] text-mist-600 hover:bg-[#dddddd]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollTo(activeIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronLeft size={16} className="text-mist-700" />
        </button>

        <button
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronRight size={16} className="text-mist-700" />
        </button>

        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {renderCards()}
          <div className="w-6 shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2  mt-10 2xl:mt-16">
        {Array.from({ length: getCardCount() }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === Math.min(activeIndex, maxIndex)
                ? "w-6 h-3 bg-mist-800"
                : "w-2 h-2 2xl:w-3 2xl:h-3 bg-mist-300 hover:bg-mist-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
