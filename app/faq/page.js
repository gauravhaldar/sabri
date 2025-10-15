"use client";

export default function FAQPage() {
  const faqs = [
    {
      q: "Are your pieces hypoallergenic?",
      a: "yes. our jewellery is nickel-free and skin-friendly.",
    },
    {
      q: "How do I find my size?",
      a: "use our sizing tips or contact support for quick help.",
    },
    {
      q: "Can I return earrings?",
      a: "for hygiene reasons, only if sealed/unopened as permitted by law.",
    },
    {
      q: "How long does shipping take?",
      a: "metro 2–4 days, rest of india 3–7, international 7–14.",
    },
    {
      q: "Do you ship internationally?",
      a: "yes, with tracking. duties/taxes may apply to the recipient.",
    },
    {
      q: "How do I care for my jewellery?",
      a: "store dry, avoid harsh chemicals, wipe with soft cloth.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-40 pb-14">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-black">
            FAQ&apos;s
          </h1>
          <p className="text-xs text-gray-600">
            Quick answers • less scrolling
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {faqs.map((item, i) => (
            <div key={i} className="border rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900">{item.q}</h3>
              <p className="mt-2 text-xs text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-gray-700">
          Need more help? email support@sabri.com
        </div>
      </div>
    </div>
  );
}
