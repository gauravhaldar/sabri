"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">Privacy Policy</h1>

        <p className="text-gray-700 mb-6">
          Sabri respects your privacy. This Privacy Policy describes how we collect, use, disclose,
          and safeguard your information when you visit our website or make a purchase.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Contact details: name, email, phone, shipping/billing address</li>
            <li>Order details: items purchased, payment method (tokenized)</li>
            <li>Technical data: IP address, device, browser, analytics cookies</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Process and deliver your orders</li>
            <li>Provide customer support and order updates</li>
            <li>Improve site performance, content, and user experience</li>
            <li>Marketing communications with your consent</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Cookies & Tracking</h2>
          <p className="text-gray-700">
            We use cookies and similar technologies for essential functionality, analytics, and
            personalization. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Sharing Your Information</h2>
          <p className="text-gray-700">
            We may share information with service providers (payments, logistics, analytics) under
            strict data processing terms. We do not sell your personal data.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Data Security & Retention</h2>
          <p className="text-gray-700">
            We implement reasonable safeguards to protect your data. We retain personal information
            only as long as necessary for the purposes outlined in this Policy or as required by law.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <p className="text-gray-700">
            Subject to applicable law, you may request access, correction, deletion, or restriction
            of your personal data, and opt out of marketing at any time.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">7. Children's Privacy</h2>
          <p className="text-gray-700">
            Our services are not intended for children under the age of 13, and we do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">8. International Transfers</h2>
          <p className="text-gray-700">
            Your data may be processed outside your country of residence, subject to appropriate
            safeguards consistent with applicable laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-gray-700">
            For privacy requests, email privacy@sabri.com
          </p>
        </section>
      </div>
    </div>
  );
}


