"use client";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Terms & Conditions</h1>
        <p className="text-gray-500 mb-10">Last Updated: 16/05/2025</p>

        <p className="text-gray-700 mb-6">
          Welcome to Sabri, your destination for authentic silver jewellery. By accessing or using our website{" "}
          <a href="https://mysabri.in" target="_blank" className="text-blue-600 underline">https://mysabri.in</a>, 
          you agree to be bound by the following Terms and Conditions.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Product Authenticity</h2>
          <p className="text-gray-700">
            All products sold on Sabri are made from genuine 92.5% sterling silver, unless explicitly stated otherwise. 
            Product images are for representation purposes only; minor variations in color, design, or finish may occur.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. Order & Delivery</h2>
          <p className="text-gray-700">
            Orders once confirmed cannot be canceled after 12 hours. Delivery is available across India within 
            7–10 business days. Tracking details will be shared once the order is dispatched. 
            Delays due to force majeure, courier issues, or strikes will be communicated promptly.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Pricing & Payment</h2>
          <p className="text-gray-700">
            All prices are in INR and inclusive of applicable taxes unless specified. Payment options include UPI, 
            debit/credit cards, net banking, and Cash on Delivery (subject to order verification). 
            Sabri reserves the right to change pricing without prior notice.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Returns & Replacements</h2>
          <p className="text-gray-700">
            We do not accept returns. Only replacements are allowed in cases of product damage during transit 
            or if the wrong item or size is delivered. Customers must raise a replacement request within 
            2 days of delivery by emailing{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a> 
            with photo proof. Earrings, toe rings, and hygiene-sensitive items are non-replaceable unless damaged. 
            Replacements are subject to stock availability.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Customer Responsibilities</h2>
          <p className="text-gray-700">
            It is your responsibility to provide accurate shipping address and contact details while placing an order. 
            Customers should inspect the delivery upon receipt and ensure the correct ring or chain sizing based on our size guide.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p className="text-gray-700">
            All designs, content, images, and logos on this website are the exclusive property of Sabri and may not be 
            copied, reused, or distributed without written permission.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">7. Legal Jurisdiction</h2>
          <p className="text-gray-700">
            Any dispute arising from the use of this website shall be subject to the jurisdiction of the courts 
            located in Bhubaneswar, India.
          </p>
        </section>

        <section className="space-y-4 border-t pt-6 mt-10">
          <h2 className="text-2xl font-semibold">Ownership</h2>
          <p className="text-gray-700">
            This website is owned and operated by <strong>HALDAR AI AND IT PRIVATE LIMITED</strong>.
          </p>
        </section>

        <section className="space-y-4 mt-10">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-gray-700">
            For questions or concerns regarding these Terms & Conditions, email us at{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
