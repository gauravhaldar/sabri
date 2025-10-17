// Example: How to integrate PayU payment in your cart page

// ==========================================
// STEP 1: Import the PayUPayment component
// ==========================================
import PayUPayment from "@/components/PayUPayment";
import { useState } from "react";

// ==========================================
// STEP 2: Add state for payment flow
// ==========================================
export default function CartPage() {
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // ==========================================
  // STEP 3: Modify handlePlaceOrder function
  // ==========================================
  const handlePlaceOrder = async () => {
    // ... your existing validation code ...

    try {
      // Create order in database
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: selectedAddress,
          paymentMethod,
          orderSummary: {
            subtotal,
            tax,
            shippingCharge,
            total,
          },
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);

        // Check payment method
        if (paymentMethod === "online") {
          // Show PayU payment modal/component
          setShowPaymentModal(true);
        } else {
          // Cash on delivery - show success
          toast.success("Order placed successfully!");
          router.push(`/orders/${data.data.orderId}`);
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    }
  };

  // ==========================================
  // STEP 4: Update payment method selection UI
  // ==========================================
  return (
    <div>
      {/* ... your existing cart code ... */}

      {/* Payment Method Selection */}
      <div className="payment-methods">
        <h3>💳 Payment Method</h3>

        {/* Cash on Delivery */}
        <label
          className={paymentMethod === "cash_on_delivery" ? "selected" : ""}
        >
          <input
            type="radio"
            name="payment"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>Cash on Delivery</span>
        </label>

        {/* Online Payment */}
        <label className={paymentMethod === "online" ? "selected" : ""}>
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>Online Payment (Cards, UPI, Net Banking)</span>
          <div className="payment-icons">
            <img src="/icons/visa.png" alt="Visa" />
            <img src="/icons/mastercard.png" alt="Mastercard" />
            <img src="/icons/upi.png" alt="UPI" />
            <img src="/icons/netbanking.png" alt="Net Banking" />
          </div>
        </label>
      </div>

      {/* Place Order Button */}
      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>

      {/* ==========================================
          STEP 5: Add PayU Payment Modal/Component
          ========================================== */}
      {showPaymentModal && orderData && (
        <div className="payment-modal">
          <div className="modal-content">
            <h2>Complete Payment</h2>
            <p>Order ID: {orderData.orderId}</p>
            <p>Amount: ₹{orderData.orderSummary.total}</p>

            <PayUPayment
              orderId={orderData.orderId}
              amount={orderData.orderSummary.total}
              customerInfo={{
                firstname:
                  user.firstName || user.name?.split(" ")[0] || "Customer",
                lastname:
                  user.lastName ||
                  user.name?.split(" ").slice(1).join(" ") ||
                  "",
                email: user.email,
                phone: selectedAddress.phone,
              }}
              productInfo={`Order ${orderData.orderId}`}
            />

            <button onClick={() => setShowPaymentModal(false)}>
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ALTERNATIVE: Direct Payment (without modal)
// ==========================================
/*
const handlePlaceOrder = async () => {
  try {
    // Create order
    const orderResponse = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const order = await orderResponse.json();

    if (order.success && paymentMethod === "online") {
      // Directly initiate PayU payment
      const paymentResponse = await fetch("/api/payment/payu/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.data.orderId,
          amount: order.data.orderSummary.total,
          customerInfo: {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            phone: selectedAddress.phone,
          },
          productInfo: `Order ${order.data.orderId}`,
        }),
      });

      const payment = await paymentResponse.json();

      if (payment.success) {
        // Create form and submit to PayU
        const form = document.createElement("form");
        form.method = "POST";
        form.action = payment.data.paymentUrl;

        Object.keys(payment.data.payUParams).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payment.data.payUParams[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
*/

// ==========================================
// CSS EXAMPLE (add to your styles)
// ==========================================
/*
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.payment-methods label {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-methods label:hover {
  border-color: #3b82f6;
}

.payment-methods label.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.payment-icons img {
  height: 24px;
}
*/
