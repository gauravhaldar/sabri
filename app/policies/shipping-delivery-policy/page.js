"use client";

export default function ShippingDeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">Shipping & Delivery Policy</h1>

        <p className="text-gray-700 mb-6">
          We aim to dispatch your order quickly and safely. Timelines below are estimates and may
          vary during peak periods or due to courier constraints.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Processing Time</h2>
          <p className="text-gray-700">Orders are typically processed within 24–48 business hours.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Estimated Delivery</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Metro cities: 2–4 business days</li>
            <li>Other locations in India: 3–7 business days</li>
            <li>International: 7–14 business days</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Shipping Fees</h2>
          <p className="text-gray-700">
            Shipping charges, if applicable, are calculated at checkout based on destination and
            order value. Duties/taxes for international shipments are payable by the recipient.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Order Tracking</h2>
          <p className="text-gray-700">
            You will receive tracking details via email/SMS once your order is shipped. Please allow
            24 hours for the tracking link to become active.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Failed Delivery & Address Issues</h2>
          <p className="text-gray-700">
            Ensure your address and contact details are accurate. Failed deliveries due to incorrect
            information may incur reshipment fees.
          </p>
        </section>
      </div>
    </div>
  );
}


