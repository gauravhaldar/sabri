"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-6">
          At Sabri, we respect your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Name, phone number, email address</li>
            <li>Shipping and billing address</li>
            <li>
              Payment information (collected securely via payment gateway – we do not store card details)
            </li>
            <li>
              Analytics data including browsing behavior, IP address, and device type via cookies
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To fulfill orders and process payments</li>
            <li>To send updates and respond to your queries</li>
            <li>To communicate promotions or support</li>
            <li>To improve your site experience via analytics</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">3. Data Protection</h2>
          <p className="text-gray-700">
            We use SSL encryption and trusted third-party payment processors to ensure secure transactions. Your data is never sold or shared without your explicit consent.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">4. Marketing Communication</h2>
          <p className="text-gray-700">
            By signing up or placing an order, you agree to receive updates via SMS or email. You can opt out at any time using the unsubscribe link or by contacting us.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">5. Cookies</h2>
          <p className="text-gray-700">
            We use cookies to personalize content, analyze site traffic, and offer better user experiences. You can manage your cookie preferences through your browser settings.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
          <p className="text-gray-700">
            Our platform may contain links to third-party services such as payment gateways or social media. We are not responsible for their privacy practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions or concerns regarding this Privacy Policy, please contact us at{" "}
            <a href="mailto:info@mysabri.in" className="text-blue-600 underline">info@mysabri.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
