import Banner from "@/components/ui/Banner";

export default function PrivacyPage() {
  return (
    <div>
            {/* Banner */}
                  <Banner
                    heading="Privacy Policy"
                    description=""
                    searchBar={false}
                    image="/banner5.png"
                    height="h-96"
                  />
    
    <div className="w-full bg-white">
      </div>

      {/* Content Section */}
      <div className="sm:px-16 lg:px-20 px-10 py-16">
        <Section title="Introduction">
          <p>
            Vidi Vici Rental operates this website and store, including all related information, content, features, tools, products, and
            services, to provide you with a curated luxury rental experience (the "Services"). This Privacy Policy explains how we collect, use,
            and disclose your personal information when you visit, use, or make a purchase through our Services, or otherwise
            communicate with us.
          </p>
          <p>
            By using our Services, you acknowledge that you have read and understand how we collect, use, and disclose your information.
          </p>
        </Section>

        <Section title="Personal Information We Collect">
          <p>
            When we refer to "personal information," we mean information that identifies or can reasonably be linked to you.
            Personal information does not include data collected anonymously or de-identified. Depending on how you interact with
            our Services, we may collect:
          </p>
          <ul className="flex flex-col gap-3 mt-4">
            <BoldItem label="Contact details:" text="Name, address, billing address, shipping address, phone number, and email address." />
            <BoldItem label="Financial information:" text="Credit/debit card details, PayPal account information, transaction details, and payment confirmations." />
            <BoldItem label="Account information:" text="Username, password, preferences, and settings." />
            <BoldItem label="Transaction information:" text="Items you view, add to cart, wishlist, purchase, return, exchange, or cancel, and your past transactions." />
            <BoldItem label="Communications:" text="Information you provide in customer support inquiries or other communications." />
            <BoldItem label="Device information:" text="Device type, browser, IP address, and other unique identifiers." />
            <BoldItem label="Usage information:" text="How you interact with and navigate the Services." />
          </ul>
        </Section>

        <Section title="Sources of Personal Information">
          <p className="font-semibold text-mist-900 text-sm mb-4">We may collect personal information from the following sources:</p>
          <ul className="flex flex-col gap-3">
            <BoldItem label="Directly from you:" text="When you create an account, make a booking, communicate with us, or otherwise provide your information." />
            <BoldItem label="Automatically through our Services:" text="Via cookies, tracking technologies, and device data." />
            <BoldItem label="From service providers:" text="When we use third-party tools or plugins to process your personal information on our behalf." />
            <BoldItem label="From partners or third parties:" text="As necessary for booking verification, fraud prevention, or customer support." />
          </ul>
        </Section>

        <Section title="How We Use Your Personal Information">
          <p className="font-semibold text-mist-900 text-sm mb-6">We use personal information for the following purposes:</p>

          <div className="flex flex-col gap-6">
            <NumberedGroup number={1} title="Provide, Tailor, and Improve Services:">
              <Bullet text="Process bookings, payments, and deposits." />
              <Bullet text="Remember your preferences and interests." />
              <Bullet text="Facilitate communication regarding your bookings." />
              <Bullet text="Customize your experience, including suggestions and recommendations." />
            </NumberedGroup>

            <NumberedGroup number={2} title="Marketing and Promotions:">
              <Bullet text="Send promotional communications via email, text, or postal mail." />
              <Bullet text="Show targeted advertising based on previous interactions with our Services." />
            </NumberedGroup>

            <NumberedGroup number={3} title="Security and Fraud Prevention:">
              <Bullet text="Authenticate accounts, secure payments, detect fraudulent activity, and protect public safety." />
            </NumberedGroup>

            <NumberedGroup number={4} title="Customer Communication:">
              <Bullet text="Respond to inquiries and provide effective support." />
              <Bullet text="Maintain a relationship with you as a customer." />
            </NumberedGroup>

            <NumberedGroup number={5} title="Legal Compliance:">
              <Bullet text="Comply with applicable laws, respond to legal requests, enforce terms, and protect our rights and services." />
            </NumberedGroup>
          </div>
        </Section>

        <Section title="How We Share Your Personal Information">
          <p>
            We may share your personal information with the following circumstances where we have legitimate business reasons:
          </p>
          <ul className="flex flex-col gap-3 mt-4">
            <BoldItem label="Service providers:" text="Companies that help us operate our platform, process payments, or deliver communications." />
            <BoldItem label="Business transfers:" text="In connection with a merger, acquisition, or sale of assets." />
            <BoldItem label="Legal obligations:" text="When required by law or to protect the rights, property, or safety of Vidi Vici, our clients, or others." />
          </ul>
        </Section>

        <Section title="Third-Party Websites and Links">
          <p>
            Our Services may include links to third-party websites. We are not responsible for their privacy policies or content. Any
            personal information you provide on third-party platforms is subject to their privacy policies, and we recommend reviewing
            them carefully.
          </p>
        </Section>

        <Section title="Cookies and Tracking Technologies">
          <p>
            We use cookies, pixels, and similar tracking technologies to enhance your experience, analyze site traffic,
            and deliver personalized content and advertisements. You can control cookie settings through your browser preferences.
            Disabling cookies may affect the functionality of certain features.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy,
            comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer needed,
            we securely delete or anonymize it.
          </p>
        </Section>

        <Section title="Security & Retention">
          <p>
            We implement reasonable technical and organizational measures to protect personal information. However, no system is
            entirely secure. We retain personal information only as long as necessary to provide Services, comply with legal obligations, resolve disputes,
            or enforce contracts and policies.
          </p>
        </Section>

        <Section title="Children&apos;s Privacy">
          <p>
            Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information
            from minors. If you believe a minor has provided us with personal information, please contact us immediately and
            we will take steps to delete such information.
          </p>
        </Section>

        <Section title="Your Rights and Choices">
          <p className="font-semibold text-mist-900 text-sm mb-4">Depending on your location, you may have the following rights:</p>
          <ul className="flex flex-col gap-3">
            <Bullet text="Access: Request access to your personal information." />
            <Bullet text="Correct: Request correction of inaccurate information." />
            <Bullet text="Erasure: Request deletion of your personal data." />
            <Bullet text="Portability: Request a copy of your information to transfer to another provider." />
            <Bullet text="Opt-Out of Marketing: Opt out of targeted advertising and marketing communications." />
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at{" "}
            <a href="mailto:admin@vidivicitrental.com" className="text-mist-900 font-semibold underline underline-offset-2 hover:no-underline">
              admin@vidivicitrental.com
            </a>.
          </p>
        </Section>

        <Section title="International Transfers">
          <p>
            We may transfer, store, and process personal information outside your country. We use recognized data transfer mechanisms,
            such as Standard Contractual Clauses, with adequate data protection where applicable.
          </p>
        </Section>

        <Section title="Complaints">
          <p>
            If you have concerns about our processing of your personal information, contact us at{" "}
            <a href="mailto:admin@vidivicitrental.com" className="text-mist-900 font-semibold underline underline-offset-2 hover:no-underline">
              admin@vidivicitrental.com
            </a>{" "}
            or your local data protection authority.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational,
            or regulatory reasons. We will notify you of significant changes by posting the updated policy on this page with
            a revised "Last updated" date.
          </p>
        </Section>

        <Section title="Contact Us">
          <p className="font-semibold text-mist-900 text-sm mb-4">If you have any questions or concerns about this Privacy Policy, please contact:</p>
          <ul className="flex flex-col gap-3">
            <BoldItem label="Email:" text="admin@vidivicitrental.com" />
            <BoldItem label="Phone:" text="(310) 555-0991" />
            <BoldItem label="Address:" text="8687 Melrose Ave, Los Angeles CA 90069, United States" />
          </ul>
        </Section>
      </div>
    </div> 
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-mist-900 mb-4 pb-3 border-b border-gray-200">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-base text-mist-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function BoldItem({ label, text }: { label: string; text: string }) {
  return (
    <li className="list-none text-base text-mist-700 leading-relaxed">
      <span className="font-semibold text-mist-900">{label}</span> {text}
    </li>
  );
}

function NumberedGroup({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="">
      <p className="text-sm font-semibold text-mist-900 mb-3">{number}. {title}</p>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-mist-700 leading-relaxed list-none">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
      {text}
    </li>
  );
}
