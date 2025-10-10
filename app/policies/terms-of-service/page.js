"use client";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">Terms of Service</h1>

        <p className="text-gray-700 mb-6">
          Welcome to Sabri. By accessing or using our website, you agree to these Terms of
          Service. Please read them carefully.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Eligibility & Account</h2>
          <p className="text-gray-700">
            You must be of legal age to place an order. You are responsible for keeping your
            account credentials secure and for all activity under your account.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Orders & Acceptance</h2>
          <p className="text-gray-700">
            All orders are offers to purchase and are subject to acceptance and availability. We
            may cancel or refuse an order if we suspect fraud, pricing errors, or stock issues.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Pricing & Payments</h2>
          <p className="text-gray-700">
            Prices are displayed in INR and inclusive/exclusive of taxes as indicated at checkout.
            Accepted payment methods are shown at checkout. In case of payment failure, the order
            will not be processed.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Shipping, Delivery & Risk</h2>
          <p className="text-gray-700">
            Shipping timelines are estimates. Risk of loss transfers to you upon delivery to the
            shipping address provided. Refer to our Shipping & Delivery Policy for details.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Returns & Exchanges</h2>
          <p className="text-gray-700">
            Eligible items may be returned or exchanged as per our Return & Exchange Policy. Items
            must be unused, in original packaging, and accompanied by proof of purchase.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, trademarks, and designs on this site are owned by or licensed to Sabri and
            protected by applicable laws. You may not reproduce or exploit any content without
            permission.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">7. Prohibited Conduct</h2>
          <p className="text-gray-700">
            You agree not to misuse the site, engage in fraudulent transactions, or interfere with
            security features. We may suspend access for violations.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, Sabri is not liable for indirect, incidental, or
            consequential damages arising from use of the site or products.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">9. Privacy</h2>
          <p className="text-gray-700">
            Your use of our services is also governed by our Privacy Policy, which explains how we
            collect, use, and protect your information.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms from time to time. Continued use of the site following changes
            constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-gray-700">
            Questions about these Terms? Email us at support@sabri.com
          </p>
        </section>
      </div>
    </div>
  );
}


