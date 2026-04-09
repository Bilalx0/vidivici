import { Metadata } from "next";
import Banner from "@/components/ui/Banner";

export const metadata: Metadata = {
  title: "Terms and Conditions - Vidi Vici Rental",
  description:
    "Read our comprehensive terms and conditions for car rentals and villa/property rentals.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
              <Banner
                            heading="Terms and Conditions"
                            description=""
                            searchBar={false}
                            image="/banner5.png"
                            height="h-96 2xl:h-[700px]"
                          />
      {/* Content */}
      <div className="sm:px-16 lg:px-20 px-6 py-12 lg:py-16 2xl:py-32 2xl:px-48">
        {/* Welcome Section */}
        <section className="mb-12 2xl:mb-20">
          <p className="text-mist-700 leading-relaxed mb-4 2xl:mb-8 text-base 2xl:text-2xl">
            Welcome to Vidi Vici Rental. These Terms of Service ("Agreement")
            govern your use of all services provided by Vidi Vici Rental,
            including but not limited to car rentals, villa bookings, and VIP
            event arrangements.
          </p>
          <p className="text-mist-700 leading-relaxed text-base 2xl:text-2xl">
            By accessing, browsing, or using our services, you acknowledge that
            you have read, understood, and agreed to these Terms of Service in
            full.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-12 2xl:mb-20">
          <h2 className="text-2xl 2xl:text-5xl font-bold text-mist-900 mb-6 2xl:mb-12">
            1. Definitions
          </h2>
          <ul className="space-y-4 2xl:space-y-8">
            <li className="flex gap-4 2xl:gap-8">
              <span className="font-semibold text-mist-900 min-w-fit text-base 2xl:text-2xl">
                "Agreement"
              </span>
              <span className="text-mist-700 text-base 2xl:text-2xl">
                This Terms of Service document, including all attachments and
                addenda.
              </span>
            </li>
            <li className="flex gap-4 2xl:gap-8">
              <span className="font-semibold text-mist-900 min-w-fit text-base 2xl:text-2xl">
                "Service"
              </span>
              <span className="text-mist-700 text-base 2xl:text-2xl">
                The rental or event booking service provided by Vidi Vici
                Rental.
              </span>
            </li>
            <li className="flex gap-4 2xl:gap-8">
              <span className="font-semibold text-mist-900 min-w-fit text-base 2xl:text-2xl">
                "Guest/Client"
              </span>
              <span className="text-mist-700 text-base 2xl:text-2xl">
                Any individual or entity renting a vehicle, booking a property,
                or engaging our services.
              </span>
            </li>
            <li className="flex gap-4 2xl:gap-8">
              <span className="font-semibold text-mist-900 min-w-fit text-base 2xl:text-2xl">
                "Property"
              </span>
              <span className="text-mist-700 text-base 2xl:text-2xl">
                Any villa or property listed on Vidi Vici Rental for rental or
                event use.
              </span>
            </li>
            <li className="flex gap-4 2xl:gap-8">
              <span className="font-semibold text-mist-900 min-w-fit text-base 2xl:text-2xl">
                "Vehicle"
              </span>
              <span className="text-mist-700 text-base 2xl:text-2xl">
                Any automobile made available for rental under this Agreement.
              </span>
            </li>
          </ul>
        </section>

        {/* CAR RENTAL TERMS */}
        <section className="mb-12 2xl:mb-20 pb-12 2xl:pb-20 border-b border-mist-200">
          <h2 className="text-3xl 2xl:text-6xl font-bold text-mist-900 mb-8 2xl:mb-16">
            CAR RENTAL TERMS OF SERVICE
          </h2>

          {/* 2. Rental Agreement */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              2. Rental Agreement
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  By renting a vehicle, you are entering a binding legal contract
                  with Vidi Vici Rental.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  You agree to use the vehicle only as permitted.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Payment must be made in full before vehicle delivery.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  All rental terms and conditions must be observed.
                </span>
              </li>
            </ul>
          </div>

          {/* 3. Eligibility and Identification */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              3. Eligibility and Identification
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  All renters and authorized drivers must be 21 years of age or
                  older.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  A valid driver&apos;s license is required from all drivers.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  International driver&apos;s permits may be required for certain
                  nationalities.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Vehicle Condition and Inspection */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              4. Vehicle Condition and Inspection
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Vehicles are delivered in clean, safe, and fully operational
                  condition.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  You must inspect the vehicle and report any damage immediately.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Pre-existing damage not documented may result in liability charges.
                </span>
              </li>
            </ul>
          </div>

          {/* 5. Use and Prohibited Actions */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              5. Use and Prohibited Actions
            </h3>
            <p className="text-mist-700 mb-3 2xl:mb-8 font-semibold text-base 2xl:text-2xl">
              You are prohibited from:
            </p>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Operating the vehicle under the influence of drugs or alcohol.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Driving while tired, drowsy, or impaired in any manner.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Using the vehicle for commercial purposes or ride-sharing.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Transporting hazardous materials.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Off-roading or reckless driving.
                </span>
              </li>
            </ul>
          </div>

          {/* 6. Damage, Loss, and Liability */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              6. Damage, Loss, and Liability
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  You are responsible for all damage, loss, theft, and diminution
                  in value.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Repairs must be made at Vidi Vici Rental authorized centers.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Accident reports and police documentation must be provided
                  immediately.
                </span>
              </li>
            </ul>
          </div>

          {/* 7. Collision Damage Waiver (CDW) */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              7. Collision Damage Waiver (CDW)
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  CDW coverage may be purchased to cover certain damages that do
                  not cover.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Review all CDW terms carefully.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  A deductible may still apply.
                </span>
              </li>
            </ul>
          </div>

          {/* 8. Insurance Requirements */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              8. Insurance Requirements
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  You must maintain adequate insurance coverage.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Liability and comprehensive coverage are required.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  You are fully responsible for insurance claims arising from
                  breaches of this Agreement.
                </span>
              </li>
            </ul>
          </div>

          {/* 9. Fees, Deposits, and Payments */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              9. Fees, Deposits, and Payments
            </h3>
            <p className="text-mist-700 mb-3 2xl:mb-8 text-base 2xl:text-2xl">
              Standard charges include daily rental, mileage, fuel, and optional
              extras including:
            </p>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700 ml-4 2xl:ml-8">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">Collision damage waiver</span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">Additional drivers</span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">GPS navigation</span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">Coupé, coupe, or replacement units</span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">Late fees, taxes, tolls, and other charges</span>
              </li>
            </ul>
          </div>
        </section>

        {/* VILLA/PROPERTY RENTAL TERMS */}
        <section className="mb-12 2xl:mb-20">
          <h2 className="text-3xl 2xl:text-6xl font-bold text-mist-900 mb-8 2xl:mb-16">
            VILLA/PROPERTY RENTAL TERMS OF SERVICE
          </h2>

          {/* 10. Parties and Agreement */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              10. Parties and Agreement
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  <span className="font-semibold">Resident:</span> Individual
                  booking and using the property.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  <span className="font-semibold">Property:</span> The villa,
                  apartment, or residential unit being rented.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  <span className="font-semibold">Agreement is binding once:</span>
                  Payment is received, security deposit is provided, and booking
                  is confirmed.
                </span>
              </li>
            </ul>
          </div>

          {/* 11. Services Covered */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              11. Services Covered
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Accommodation, furnishings, utilities, administrative charges,
                  and applicable taxes.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Monthly housekeeping services included (daily cleaning at extra
                  cost).
                </span>
              </li>
            </ul>
          </div>

          {/* 12. Guest Responsibilities */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              12. Guest Responsibilities
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Property management body must be notified of major issues.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Pets and guests must arrive written approval from management.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Smoking is prohibited unless designated area assigned.
                </span>
              </li>
            </ul>
          </div>

          {/* 13. Cancellation and Refunds */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              13. Cancellation and Refunds
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Cancellations are non-refundable.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Guests are encouraged to obtain travel or rental insurance.
                </span>
              </li>
            </ul>
          </div>

          {/* 14. Property Use and Conduct */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              14. Property Use and Conduct
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Residential use only.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Illegal activities are strictly prohibited.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Noise restrictions apply after designated quiet hours.
                </span>
              </li>
            </ul>
          </div>

          {/* 15. Liability and Indemnification */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              15. Liability and Indemnification
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Guests assume all risk of personal injury or property damage.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Guests agree to indemnify Vidi Vici Rental for rental business
                  claims, damages, or losses.
                </span>
              </li>
            </ul>
          </div>

          {/* 16. Security, Cleaning, and Damage */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              16. Security, Cleaning, and Damage
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Guests must maintain the property in good condition.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Excessive cleaning, stains, or damage will incur additional
                  charges.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Emergency repairs may be made without prior notice.
                </span>
              </li>
            </ul>
          </div>

          {/* 17. Dispute Resolution */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              17. Dispute Resolution
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Disputes are represented by their initial judgment.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Both parties agree to arbitration before legal proceedings.
                </span>
              </li>
            </ul>
          </div>

          {/* 18. Governing Law and Dispute Resolution */}
          <div className="mb-10 2xl:mb-20">
            <h3 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-4 2xl:mb-8">
              18. Governing Law and Dispute Resolution
            </h3>
            <ul className="space-y-3 2xl:space-y-6 text-mist-700">
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  California law governs this Agreement.
                </span>
              </li>
              <li className="flex gap-3 2xl:gap-6">
                <span className="text-mist-400 font-semibold text-base 2xl:text-2xl">•</span>
                <span className="text-base 2xl:text-2xl">
                  Disputes are resolved in Los Angeles County courts.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Acknowledgment Section */}
        <section className="bg-mist-50 p-8 2xl:p-16 rounded-2xl 2xl:rounded-[32px] border border-mist-200">
          <p className="text-mist-700 leading-relaxed text-center font-semibold text-base 2xl:text-2xl">
            By using Vidi Vici Rental services, you acknowledge that you have
            read, understood, and agreed to these Terms of Service in full.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mt-12 2xl:mt-24 text-center text-mist-600 text-sm 2xl:text-xl">
          <p className="mb-2 2xl:mb-4">
            For questions about our Terms of Service or your rights, contact:
          </p>
          <p className="font-semibold text-mist-900 text-base 2xl:text-2xl">Vidi Vici Rental</p>
          <p className="text-base 2xl:text-2xl">admin@vidivicitrental.com</p>
          <p className="text-base 2xl:text-2xl">(310) 555-0991</p>
          <p className="text-base 2xl:text-2xl">8687 Melrose Ave, Los Angeles, CA 90069, USA</p>
        </section>
      </div>
    </main>
  );
}
