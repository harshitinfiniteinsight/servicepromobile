import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomActionBar from "@/components/layout/BottomActionBar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Image as ImageIcon } from "lucide-react";

const CheckoutSummary = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getSelectedCustomer } = useCart();
  const customer = getSelectedCustomer();

  if (!customer || items.length === 0) {
    navigate("/checkout/customer", { replace: true });
    return null;
  }

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCollectPayment = () => {
    navigate("/checkout/payment", { state: { customer, total, subtotal, tax } });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader
        title="Checkout"
        showBack={true}
      />
      
      <div 
        className="flex-1 overflow-y-auto scrollable px-3 pb-4" 
        style={{ 
          paddingTop: 'calc(3rem + env(safe-area-inset-top) + 0.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 90px)',
        }}
      >
        {/* Customer Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer</h3>
          <p className="text-base font-medium text-gray-900">{customer.name}</p>
          <p className="text-sm text-gray-600">{customer.email}</p>
          <p className="text-sm text-gray-600">{customer.phone}</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">SKU: {item.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax (8%)</span>
              <span className="text-sm font-semibold text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <BottomActionBar>
        <Button
          onClick={handleCollectPayment}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
        >
          Collect Payment
        </Button>
      </BottomActionBar>
    </div>
  );
};

export default CheckoutSummary;

