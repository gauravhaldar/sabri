"use client";

export default function ShippingDeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
          Shipping & Delivery Policy
        </h1>

        <p className="text-gray-700 mb-6">
          At Sabri, we strive to deliver your jewellery promptly and securely.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Shipping Coverage</h2>
          <p className="text-gray-700">
            We currently ship across all major locations in India.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Processing Time</h2>
          <p className="text-gray-700">
            Orders are processed within 1–2 business days. Once dispatched, delivery usually takes 7–10 business days depending on the delivery location.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Shipping Charges</h2>
          <p className="text-gray-700">
            Shipping charges, if applicable, will be clearly mentioned during checkout. Some items may qualify for free shipping.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Order Tracking</h2>
          <p className="text-gray-700">
            Once your order is dispatched, you will receive a tracking link via email or SMS to monitor your shipment in real time.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Delivery Delays</h2>
          <p className="text-gray-700">
            While we aim to meet estimated delivery timelines, delays may occur due to unforeseen issues such as weather conditions, courier delays, or government restrictions. Any such delays will be communicated promptly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Packaging</h2>
          <p className="text-gray-700">
            All items are securely packed to prevent damage during transit. If you receive a damaged package, please contact us immediately at{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a> with photo proof.
          </p>
        </section>
      </div>
    </div>
  );
}
