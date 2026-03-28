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
                            heading="Privacy Policy"
                            description=""
                            searchBar={false}
                            image="/banner5.png"
                            height="h-96"
                          />
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Welcome Section */}
        <section className="mb-12">
          <p className="text-mist-700 leading-relaxed mb-4">
            Welcome to Vidi Vici Rental. These Terms of Service ("Agreement")
            govern your use of all services provided by Vidi Vici Rental,
            including but not limited to car rentals, villa bookings, and VIP
            event arrangements.
          </p>
          <p className="text-mist-700 leading-relaxed">
            By accessing, browsing, or using our services, you acknowledge that
            you have read, understood, and agreed to these Terms of Service in
            full.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mist-900 mb-6">
            1. Definitions
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="font-semibold text-mist-900 min-w-fit">
                "Agreement"
              </span>
              <span className="text-mist-700">
                This Terms of Service document, including all attachments and
                addenda.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-mist-900 min-w-fit">
                "Service"
              </span>
              <span className="text-mist-700">
                The rental or event booking service provided by Vidi Vici
                Rental.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-mist-900 min-w-fit">
                "Guest/Client"
              </span>
              <span className="text-mist-700">
                Any individual or entity renting a vehicle, booking a property,
                or engaging our services.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-mist-900 min-w-fit">
                "Property"
              </span>
              <span className="text-mist-700">
                Any villa or property listed on Vidi Vici Rental for rental or
                event use.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-mist-900 min-w-fit">
                "Vehicle"
              </span>
              <span className="text-mist-700">
                Any automobile made available for rental under this Agreement.
              </span>
            </li>
          </ul>
        </section>

        {/* CAR RENTAL TERMS */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-mist-900 mb-8">
            CAR RENTAL TERMS OF SERVICE
          </h2>

          {/* 2. Rental Agreement */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              2. Rental Agreement
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  By renting a vehicle, you are entering a binding legal contract
                  with Vidi Vici Rental.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  You agree to use the vehicle only as permitted.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Payment must be made in full before vehicle delivery.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  All rental terms and conditions must be observed.
                </span>
              </li>
            </ul>
          </div>

          {/* 3. Eligibility and Identification */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              3. Eligibility and Identification
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  All renters and authorized drivers must be 21 years of age or
                  older.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  A valid driver&apos;s license is required from all drivers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  International driver&apos;s permits may be required for certain
                  nationalities.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Vehicle Condition and Inspection */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              4. Vehicle Condition and Inspection
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Vehicles are delivered in clean, safe, and fully operational
                  condition.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  You must inspect the vehicle and report any damage immediately.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Pre-existing damage not documented may result in liability charges.
                </span>
              </li>
            </ul>
          </div>

          {/* 5. Use and Prohibited Actions */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              5. Use and Prohibited Actions
            </h3>
            <p className="text-mist-700 mb-3 font-semibold">
              You are prohibited from:
            </p>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Operating the vehicle under the influence of drugs or alcohol.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Driving while tired, drowsy, or impaired in any manner.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Using the vehicle for commercial purposes or ride-sharing.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Transporting hazardous materials.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Off-roading or reckless driving.
                </span>
              </li>
            </ul>
          </div>

          {/* 6. Damage, Loss, and Liability */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              6. Damage, Loss, and Liability
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  You are responsible for all damage, loss, theft, and diminution
                  in value.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Repairs must be made at Vidi Vici Rental authorized centers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Accident reports and police documentation must be provided
                  immediately.
                </span>
              </li>
            </ul>
          </div>

          {/* 7. Collision Damage Waiver (CDW) */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              7. Collision Damage Waiver (CDW)
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  CDW coverage may be purchased to cover certain damages that do
                  not cover.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Review all CDW terms carefully.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  A deductible may still apply.
                </span>
              </li>
            </ul>
          </div>

          {/* 8. Insurance Requirements */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              8. Insurance Requirements
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  You must maintain adequate insurance coverage.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Liability and comprehensive coverage are required.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  You are fully responsible for insurance claims arising from
                  breaches of this Agreement.
                </span>
              </li>
            </ul>
          </div>

          {/* 9. Fees, Deposits, and Payments */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              9. Fees, Deposits, and Payments
            </h3>
            <p className="text-mist-700 mb-3">
              Standard charges include daily rental, mileage, fuel, and optional
              extras including:
            </p>
            <ul className="space-y-3 text-mist-700 ml-4">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>Collision damage waiver</span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>Additional drivers</span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>GPS navigation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>Coupé, coupe, or replacement units</span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>Late fees, taxes, tolls, and other charges</span>
              </li>
            </ul>
          </div>
        </section>

        {/* VILLA/PROPERTY RENTAL TERMS */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-mist-900 mb-8">
            VILLA/PROPERTY RENTAL TERMS OF SERVICE
          </h2>

          {/* 10. Parties and Agreement */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              10. Parties and Agreement
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  <span className="font-semibold">Resident:</span> Individual
                  booking and using the property.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  <span className="font-semibold">Property:</span> The villa,
                  apartment, or residential unit being rented.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  <span className="font-semibold">Agreement is binding once:</span>
                  Payment is received, security deposit is provided, and booking
                  is confirmed.
                </span>
              </li>
            </ul>
          </div>

          {/* 11. Services Covered */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              11. Services Covered
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Accommodation, furnishings, utilities, administrative charges,
                  and applicable taxes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Monthly housekeeping services included (daily cleaning at extra
                  cost).
                </span>
              </li>
            </ul>
          </div>

          {/* 12. Guest Responsibilities */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              12. Guest Responsibilities
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Property management body must be notified of major issues.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Pets and guests must arrive written approval from management.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Smoking is prohibited unless designated area assigned.
                </span>
              </li>
            </ul>
          </div>

          {/* 13. Cancellation and Refunds */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              13. Cancellation and Refunds
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Cancellations are non-refundable.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Guests are encouraged to obtain travel or rental insurance.
                </span>
              </li>
            </ul>
          </div>

          {/* 14. Property Use and Conduct */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              14. Property Use and Conduct
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Residential use only.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Illegal activities are strictly prohibited.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Noise restrictions apply after designated quiet hours.
                </span>
              </li>
            </ul>
          </div>

          {/* 15. Liability and Indemnification */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              15. Liability and Indemnification
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Guests assume all risk of personal injury or property damage.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Guests agree to indemnify Vidi Vici Rental for rental business
                  claims, damages, or losses.
                </span>
              </li>
            </ul>
          </div>

          {/* 16. Security, Cleaning, and Damage */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              16. Security, Cleaning, and Damage
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Guests must maintain the property in good condition.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Excessive cleaning, stains, or damage will incur additional
                  charges.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Emergency repairs may be made without prior notice.
                </span>
              </li>
            </ul>
          </div>

          {/* 17. Dispute Resolution */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              17. Dispute Resolution
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Disputes are represented by their initial judgment.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Both parties agree to arbitration before legal proceedings.
                </span>
              </li>
            </ul>
          </div>

          {/* 18. Governing Law and Dispute Resolution */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-mist-900 mb-4">
              18. Governing Law and Dispute Resolution
            </h3>
            <ul className="space-y-3 text-mist-700">
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  California law governs this Agreement.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-mist-400 font-semibold">•</span>
                <span>
                  Disputes are resolved in Los Angeles County courts.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Acknowledgment Section */}
        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <p className="text-mist-700 leading-relaxed text-center font-semibold">
            By using Vidi Vici Rental services, you acknowledge that you have
            read, understood, and agreed to these Terms of Service in full.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mt-12 text-center text-mist-600 text-sm">
          <p className="mb-2">
            For questions about our Terms of Service or your rights, contact:
          </p>
          <p className="font-semibold text-mist-900">Vidi Vici Rental</p>
          <p>admin@vidivicitrental.com</p>
          <p>(310) 555-0991</p>
          <p>8687 Melrose Ave, Los Angeles, CA 90069, USA</p>
        </section>
      </div>
    </main>
  );
}
