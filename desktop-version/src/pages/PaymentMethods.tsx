import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, CreditCard, Landmark, Smartphone, Banknote } from "lucide-react";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState({
    creditDebit: true,
    bankACH: false,
    tapToPay: true,
    manualCardEntry: true,
    otherPaymentMethods: false,
  });

  const handleToggle = (key: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // Add save logic here
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." />
      
      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Payment Methods
          </h1>
        </div>

        <div className="max-w-4xl space-y-6">
          <p className="text-sm text-muted-foreground">
            Changes made here will apply to all future invoices and payments. You can still edit these values on individual invoices.
          </p>

          {/* Customer self-checkout */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Customer self-checkout</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Credit and Debit cards</h3>
                      <p className="text-sm text-muted-foreground">2.5% fee per payment</p>
                      <p className="text-xs text-muted-foreground">Available on payments between $0.50 - $1,000</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.creditDebit}
                    onCheckedChange={() => handleToggle("creditDebit")}
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Bank - ACH Transfer</h3>
                      <p className="text-sm text-muted-foreground">$1.00 fee per payment</p>
                      <p className="text-xs text-muted-foreground">Available on payments between $1 - $1,000</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.bankACH}
                    onCheckedChange={() => handleToggle("bankACH")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assisted checkout */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Assisted checkout</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Tap to Pay</h3>
                      <p className="text-sm text-muted-foreground">2.5% fee per payment</p>
                      <p className="text-xs text-muted-foreground">Available on payments between $0.50 - $1,000</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.tapToPay}
                    onCheckedChange={() => handleToggle("tapToPay")}
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Manual card entry</h3>
                      <p className="text-sm text-muted-foreground">2.9% + 20.0¢ fee per payment</p>
                      <p className="text-xs text-muted-foreground">Available on payments between $0.50 - $1,000</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.manualCardEntry}
                    onCheckedChange={() => handleToggle("manualCardEntry")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Record Payments Manually */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Record Payments Manually</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Other Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">
                      Record cash, check, or other payments received.
                    </p>
                  </div>
                  <Switch
                    checked={paymentMethods.otherPaymentMethods}
                    onCheckedChange={() => handleToggle("otherPaymentMethods")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {hasChanges && (
            <div className="sticky bottom-6 flex justify-center">
              <Button
                onClick={handleSave}
                size="lg"
                className="shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentMethods;
