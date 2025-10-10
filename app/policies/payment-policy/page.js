"use client";

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-14">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-black">Payment Policy</h1>
          <p className="text-xs text-gray-600">secure & simple • india + international</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">1. Accepted Methods</h3>
            <ul className="mt-2 list-disc pl-5 text-xs text-gray-700 space-y-1">
              <li>UPI, credit/debit cards</li>
              <li>Netbanking, wallets (where available)</li>
              <li>International cards (select gateways)</li>
            </ul>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">2. Authorization</h3>
            <p className="mt-2 text-xs text-gray-700">Your card/bank may place a temporary hold during authorization.</p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">3. Security</h3>
            <p className="mt-2 text-xs text-gray-700">Payments processed via secure, PCI DSS-compliant gateways. We don’t store card details.</p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">4. Pricing & Taxes</h3>
            <p className="mt-2 text-xs text-gray-700">Prices shown in INR unless stated. Taxes applied as per law at checkout.</p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">5. Failures & Refunds</h3>
            <p className="mt-2 text-xs text-gray-700">Failed payments aren’t charged. Refunds follow our Return Policy timelines.</p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900">6. Fraud Checks</h3>
            <p className="mt-2 text-xs text-gray-700">Orders may be reviewed/held to prevent unauthorized transactions.</p>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-700">Payment questions? email billing@sabri.com</div>
      </div>
    </div>
  );
}


