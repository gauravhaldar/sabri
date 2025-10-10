"use client";

export default function ReturnExchangePolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">Return & Exchange Policy</h1>

        <p className="text-gray-700 mb-6">
          We want you to love your jewellery. If something isn’t right, eligible items can be returned
          or exchanged within the window below.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Return Window</h2>
          <p className="text-gray-700">Returns/exchanges accepted within 7 days of delivery.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Unused, unworn items only</li>
            <li>Original packaging with tags intact</li>
            <li>Order confirmation/invoice required</li>
          </ul>
          <p className="text-gray-700">
            For hygiene reasons, certain categories (e.g., earrings) may be non-returnable unless
            sealed and unopened, as permitted by law.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Process</h2>
          <p className="text-gray-700">
            Initiate a request via Contact Us with your order ID and reason. Once approved, we’ll
            share pickup or drop-off details. Please ensure secure packaging.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Refunds</h2>
          <p className="text-gray-700">
            Refunds are issued to the original payment method within 5–7 business days after quality
            inspection. Shipping fees are non-refundable unless the item is defective or incorrect.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Exchanges</h2>
          <p className="text-gray-700">
            Exchanges are subject to stock availability. If unavailable, we will process a refund or
            issue store credit as applicable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Damaged/Incorrect Items</h2>
          <p className="text-gray-700">
            Please report damaged or incorrect items within 48 hours of delivery with photos, and we
            will prioritize a replacement or refund.
          </p>
        </section>
      </div>
    </div>
  );
}


