"use client";

export default function ReturnExchangePolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
          Return & Refund Policy
        </h1>

        <p className="text-gray-700 mb-6">
          Your satisfaction is important to us. While we do not accept returns, we offer replacements in specific cases.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Return Policy</h2>
          <p className="text-gray-700">
            We do not offer returns for any products. Please review your order carefully before completing the purchase.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Replacement Policy</h2>
          <p className="text-gray-700">
            Replacements are only offered for the following issues:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Item damaged during transit</li>
            <li>Incorrect item or size delivered</li>
          </ul>
          <p className="text-gray-700">
            Customers must initiate a replacement request within <strong>2 days</strong> of delivery by contacting us at{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a> with clear photo evidence of the issue.
          </p>
          <p className="text-gray-700">
            Replacement orders will be delivered within <strong>4–7 working days</strong>.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Non-Replacement Items</h2>
          <p className="text-gray-700">
            Due to hygiene reasons, items such as <strong>earrings</strong> and <strong>toe rings</strong> are not eligible for replacement unless they arrive damaged.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Refunds</h2>
          <p className="text-gray-700">
            As we do not accept returns, refunds are not applicable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Contact</h2>
          <p className="text-gray-700">
            For any concerns related to replacements, please reach out to us at{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
