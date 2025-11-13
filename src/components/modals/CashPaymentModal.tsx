import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  amount: number;
  onPaymentComplete?: () => void;
}

const CashPaymentModal = ({ 
  isOpen, 
  onClose, 
  onBack, 
  amount,
  onPaymentComplete 
}: CashPaymentModalProps) => {
  const [amountReceived, setAmountReceived] = useState("");
  const [changeDue, setChangeDue] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmountReceived(numericValue);
    setError("");
    
    // Calculate change automatically as user types
    const received = parseFloat(numericValue);
    if (!isNaN(received) && received > 0) {
      if (received >= amount) {
        setChangeDue(received - amount);
      } else {
        setChangeDue(null);
      }
    } else {
      setChangeDue(null);
    }
  };

  const handlePayCash = () => {
    const received = parseFloat(amountReceived);
    
    if (!amountReceived || isNaN(received)) {
      setError("Please enter amount received");
      toast.error("Please enter amount received");
      return;
    }

    if (received < amount) {
      setError("Amount received cannot be less than order amount");
      toast.error("Amount received cannot be less than order amount");
      return;
    }

    const change = received - amount;

    if (change === 0) {
      toast.success(`Exact payment of $${amount.toFixed(2)} received`);
    } else {
      toast.success(`Payment received. Change due: $${change.toFixed(2)}`);
    }

    handleClose();
    onPaymentComplete?.();
  };

  const handleClose = () => {
    // Reset form when closing
    setAmountReceived("");
    setChangeDue(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 rounded-2xl max-h-[85vh] overflow-hidden [&>div]:p-0">
        <DialogDescription className="sr-only">
          Cash payment for amount ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </DialogDescription>
        
        {/* Header */}
        <div className="flex justify-between items-center bg-orange-500 text-white rounded-t-2xl px-4 py-2">
          <button
            onClick={onBack}
            className="text-white p-1.5 -ml-1.5 rounded-full hover:bg-orange-600 transition-colors touch-target"
            aria-label="Back to Payment Options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-semibold">Cash Payment</h2>
          <button
            onClick={handleClose}
            className="text-white p-1.5 -mr-1.5 rounded-full hover:bg-orange-600 transition-colors touch-target"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white px-4 pt-3 pb-6 overflow-y-auto safe-bottom">
          {/* Order Amount Display */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 mb-1">Order Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pb-4">
            <div>
              <Label htmlFor="amountReceived" className="block text-xs font-medium text-gray-600 mb-0.5 ml-2">
                Amount Received
              </Label>
              <div className="relative w-[92%] mx-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <Input
                  id="amountReceived"
                  type="text"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg pl-7 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${error ? "border-red-500" : ""}`}
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-1 ml-2 w-[92%] mx-auto">{error}</p>
              )}
            </div>

            {changeDue !== null && changeDue >= 0 && (
              <div className="w-[92%] mx-auto bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs font-medium text-green-700 mb-1">Change Due</p>
                <p className="text-2xl font-bold text-green-700">
                  ${changeDue.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Pay Cash Button */}
          <div className="w-[92%] mx-auto mt-3 mb-2">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
              onClick={handlePayCash}
              disabled={!amountReceived || parseFloat(amountReceived) < amount}
            >
              Pay Cash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashPaymentModal;


