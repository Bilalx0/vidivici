import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    await prisma.user.upsert({
      where: { email: 'admin@vidivici.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@vidivici.com',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+1-310-887-7005',
      },
    })

    // Create categories
    const categories = [
      { name: 'Supercar', slug: 'supercar', description: 'High-performance exotic supercars', order: 1 },
      { name: 'Convertible', slug: 'convertible', description: 'Open-top luxury convertibles', order: 2 },
      { name: 'SUV', slug: 'suv', description: 'Luxury SUVs and crossovers', order: 3 },
      { name: 'Chauffeur', slug: 'chauffeur', description: 'Premium chauffeur services', order: 4 },
      { name: 'EV', slug: 'ev', description: 'Electric vehicles', order: 5 },
      { name: 'Coupe/Sports', slug: 'coupe-sports', description: 'Sports coupes and performance cars', order: 6 },
      { name: 'Sedan', slug: 'sedan', description: 'Luxury sedans and 4-door vehicles', order: 7 },
      { name: 'Ultra-Luxury', slug: 'ultra-luxury', description: 'The most exclusive luxury vehicles', order: 8 },
    ]

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      })
    }

    // Create brands
    const brands = [
      { name: 'Rolls-Royce', slug: 'rolls-royce', description: 'The pinnacle of luxury automotive engineering', order: 1 },
      { name: 'Bentley', slug: 'bentley', description: 'Handcrafted luxury and performance', order: 2 },
      { name: 'Aston Martin', slug: 'aston-martin', description: 'British luxury grand tourers', order: 3 },
      { name: 'Lamborghini', slug: 'lamborghini', description: 'Italian supercar excellence', order: 4 },
      { name: 'Ferrari', slug: 'ferrari', description: 'The prancing horse of performance', order: 5 },
      { name: 'McLaren', slug: 'mclaren', description: 'Formula 1 technology for the road', order: 6 },
      { name: 'Porsche', slug: 'porsche', description: 'German engineering perfection', order: 7 },
      { name: 'Mercedes', slug: 'mercedes', description: 'The best or nothing', order: 8 },
      { name: 'BMW', slug: 'bmw', description: 'The ultimate driving machine', order: 9 },
      { name: 'Range Rover', slug: 'range-rover', description: 'Luxury meets capability', order: 10 },
      { name: 'Cadillac', slug: 'cadillac', description: 'Bold American luxury', order: 11 },
      { name: 'Corvette', slug: 'corvette', description: 'Americas iconic sports car', order: 12 },
      { name: 'Tesla', slug: 'tesla', description: 'Electric innovation and performance', order: 13 },
      { name: 'Audi', slug: 'audi', description: 'Vorsprung durch Technik', order: 14 },
      { name: 'Rivian', slug: 'rivian', description: 'Electric adventure vehicles', order: 15 },
      { name: 'Hummer', slug: 'hummer', description: 'Bold electric SUV power', order: 16 },
    ]

    for (const brand of brands) {
      await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: brand,
        create: brand,
      })
    }

    // Create sample cars
    const lambo = await prisma.brand.findUnique({ where: { slug: 'lamborghini' } })
    const ferrari = await prisma.brand.findUnique({ where: { slug: 'ferrari' } })
    const rollsRoyce = await prisma.brand.findUnique({ where: { slug: 'rolls-royce' } })
    const porsche = await prisma.brand.findUnique({ where: { slug: 'porsche' } })
    const mercedes = await prisma.brand.findUnique({ where: { slug: 'mercedes' } })
    const bentley = await prisma.brand.findUnique({ where: { slug: 'bentley' } })

    const supercar = await prisma.category.findUnique({ where: { slug: 'supercar' } })
    const ultraLuxury = await prisma.category.findUnique({ where: { slug: 'ultra-luxury' } })
    const suv = await prisma.category.findUnique({ where: { slug: 'suv' } })
    const coupe = await prisma.category.findUnique({ where: { slug: 'coupe-sports' } })

    if (lambo && ferrari && rollsRoyce && porsche && mercedes && bentley && supercar && ultraLuxury && suv && coupe) {
      const sampleCars = [
        { name: 'Lamborghini Huracán EVO', slug: 'lamborghini-huracan-evo', brandId: lambo.id, categoryId: supercar.id, pricePerDay: 1500, year: 2024, seats: 2, horsepower: 631, topSpeed: '202 mph', acceleration: '2.9s 0-60', description: 'The Huracán EVO represents the natural evolution of the most successful V10-powered Lamborghini ever.', shortDescription: 'V10 supercar perfection', isFeatured: true, milesIncluded: 100, extraMileRate: 10 },
        { name: 'Ferrari 488 Spider', slug: 'ferrari-488-spider', brandId: ferrari.id, categoryId: supercar.id, pricePerDay: 1800, year: 2024, seats: 2, horsepower: 661, topSpeed: '205 mph', acceleration: '3.0s 0-60', description: 'The Ferrari 488 Spider is a stunning convertible supercar with breathtaking performance.', shortDescription: 'Twin-turbo V8 convertible supercar', isFeatured: true, milesIncluded: 100, extraMileRate: 12 },
        { name: 'Rolls-Royce Cullinan', slug: 'rolls-royce-cullinan', brandId: rollsRoyce.id, categoryId: ultraLuxury.id, pricePerDay: 2500, year: 2024, seats: 5, horsepower: 563, topSpeed: '155 mph', acceleration: '4.8s 0-60', description: 'The Rolls-Royce Cullinan is the most luxurious SUV ever created, offering effortless everywhere.', shortDescription: 'The ultimate luxury SUV', isFeatured: true, milesIncluded: 150, extraMileRate: 9 },
        { name: 'Porsche 911 Turbo S', slug: 'porsche-911-turbo-s', brandId: porsche.id, categoryId: coupe.id, pricePerDay: 1200, year: 2024, seats: 4, horsepower: 640, topSpeed: '205 mph', acceleration: '2.6s 0-60', description: 'The 911 Turbo S delivers incredible performance with everyday usability.', shortDescription: 'Iconic German performance', isFeatured: true, milesIncluded: 100, extraMileRate: 9 },
        { name: 'Mercedes-AMG G63', slug: 'mercedes-amg-g63', brandId: mercedes.id, categoryId: suv.id, pricePerDay: 1100, year: 2024, seats: 5, horsepower: 577, topSpeed: '137 mph', acceleration: '4.5s 0-60', description: 'The iconic G-Class with AMG performance and unmistakable presence.', shortDescription: 'Iconic luxury SUV', isFeatured: false, milesIncluded: 100, extraMileRate: 9 },
        { name: 'Bentley Continental GT', slug: 'bentley-continental-gt', brandId: bentley.id, categoryId: ultraLuxury.id, pricePerDay: 1400, year: 2024, seats: 4, horsepower: 542, topSpeed: '198 mph', acceleration: '3.5s 0-60', description: 'The Bentley Continental GT is the definitive grand tourer, combining luxury with performance.', shortDescription: 'Handcrafted grand tourer', isFeatured: false, milesIncluded: 100, extraMileRate: 10 },
      ]

      for (const car of sampleCars) {
        await prisma.car.upsert({
          where: { slug: car.slug },
          update: car,
          create: car,
        })
      }
    }

    // Create sample testimonials
    const testimonials = [
      { name: 'James R.', content: 'Absolutely incredible experience! The Lamborghini Huracán was in perfect condition and the delivery service was flawless. Will definitely be back!', rating: 5 },
      { name: 'Sarah M.', content: 'Rented a Rolls-Royce Cullinan for our wedding weekend. The team went above and beyond to make everything perfect. Highly recommend!', rating: 5 },
      { name: 'Michael T.', content: 'Best exotic car rental in LA. The process was smooth, no hidden fees, and the car was immaculate. The Ferrari 488 Spider was a dream!', rating: 5 },
      { name: 'Emily K.', content: 'Professional, transparent, and reliable. The Porsche 911 was amazing and they delivered it right to our hotel. Outstanding service!', rating: 5 },
      { name: 'David L.', content: 'Third time renting from VIDIVICI and they never disappoint. Great selection, fair prices, and the cars are always in showroom condition.', rating: 5 },
    ]

    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t })
    }

    // Create sample FAQs
    const faqs = [
      { question: 'What happens if I return the vehicle late?', answer: 'We provide a one-hour grace period. After that, you will be charged 20% of the daily rate per hour. Five hours of late charges equals a full day fee.', order: 1 },
      { question: 'Can I do a one-way trip?', answer: 'Yes! Select the "One-way" option during booking and enter separate delivery and return addresses.', order: 2 },
      { question: 'Do you offer delivery service?', answer: 'Yes, we offer complimentary delivery within Beverly Hills and nearby areas. LAX deliveries are available at a $125 flat fee. Pickup services are also available.', order: 3 },
      { question: 'What are your rental requirements?', answer: 'US customers need a valid drivers license, full coverage insurance, and a major credit card. Non-US customers need a license, passport, credit card, and must be at least 25 years old.', order: 4 },
      { question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, Discover, and American Express. Cashier\'s checks and wire transfers may also be accepted.', order: 5 },
      { question: 'Do I get a discount for longer rentals?', answer: '15% discount for 7-27 day rentals and 30% discount for 28+ consecutive days (applied to base price only).', order: 6 },
      { question: 'What is your cancellation policy?', answer: 'Free cancellation within 24 hours of booking. No fee if cancelled 7+ days before rental. 50% penalty if cancelled within 7 days. Reservations within 48 hours of rental start are final.', order: 7 },
      { question: 'Do you offer hourly rentals?', answer: 'No, our minimum rental period is one day (24 hours). Some vehicles have 2-3 day minimums. Early return does not reduce charges.', order: 8 },
    ]

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq })
    }

    return NextResponse.json({ message: 'Database seeded successfully!' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Seeding failed', details: error.message }, { status: 500 })
  }
}
