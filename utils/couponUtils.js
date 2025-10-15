// Utility functions for coupon system

export const formatCouponDiscount = (coupon, orderAmount) => {
  if (coupon.type === "flat") {
    return coupon.amount;
  } else if (coupon.type === "percentage") {
    return Math.floor((orderAmount * coupon.amount) / 100);
  }
  return 0;
};

export const formatCouponDescription = (coupon) => {
  if (coupon.type === "flat") {
    return `Get ₹${coupon.amount} off`;
  } else if (coupon.type === "percentage") {
    return `Get ${coupon.amount}% off`;
  }
  return "";
};

export const getCouponValidity = (coupon) => {
  const now = new Date();

  if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
    return { valid: false, reason: "Coupon has expired" };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "Coupon usage limit reached" };
  }

  if (!coupon.isActive) {
    return { valid: false, reason: "Coupon is not active" };
  }

  return { valid: true };
};

export const isOrderEligibleForCoupon = (coupon, orderAmount) => {
  if (orderAmount < coupon.minValue) {
    return {
      eligible: false,
      reason: `Minimum order value: ₹${coupon.minValue}`,
    };
  }

  if (orderAmount > coupon.maxValue) {
    return {
      eligible: false,
      reason: `Maximum order value: ₹${coupon.maxValue}`,
    };
  }

  return { eligible: true };
};
