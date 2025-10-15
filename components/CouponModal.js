import React, { useCallback } from "react";
import { X, Tag, Clock, Users, Gift } from "lucide-react";
import {
  formatCouponDiscount,
  formatCouponDescription,
} from "../utils/couponUtils";

const CouponModal = ({ isOpen, onClose, onSelectCoupon, currentTotal }) => {
  const [coupons, setCoupons] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchAvailableCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/coupons?status=active`);
      const data = await response.json();

      if (data.success) {
        // Filter coupons that are applicable for current cart total
        const applicableCoupons = data.data.filter(
          (coupon) =>
            currentTotal >= coupon.minValue &&
            currentTotal <= coupon.maxValue &&
            coupon.usedCount < coupon.usageLimit
        );
        setCoupons(applicableCoupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  }, [currentTotal]);

  React.useEffect(() => {
    if (isOpen) {
      fetchAvailableCoupons();
    }
  }, [isOpen, fetchAvailableCoupons]);

  const handleSelectCoupon = (coupon) => {
    onSelectCoupon(coupon.code);
    onClose();
  };

  const calculateDiscount = (coupon) => {
    return formatCouponDiscount(coupon, currentTotal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            Available Coupons
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No applicable coupons</p>
              <p className="text-sm text-gray-500">
                Add more items to unlock coupon discounts
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => handleSelectCoupon(coupon)}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-bl-full opacity-50"></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Gift className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {coupon.code}
                          </h3>
                          <p className="text-sm text-gray-600">{coupon.name}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            {formatCouponDescription(coupon)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ₹{calculateDiscount(coupon)}
                        </p>
                        <p className="text-xs text-gray-500">You Save</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {coupon.expiryDate
                          ? `Expires ${new Date(
                              coupon.expiryDate
                            ).toLocaleDateString()}`
                          : "No expiry"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {coupon.usageLimit - coupon.usedCount} left
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Min: ₹{coupon.minValue} • Max: ₹{coupon.maxValue}
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Click to Apply
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Click on any coupon to apply it to your order
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
