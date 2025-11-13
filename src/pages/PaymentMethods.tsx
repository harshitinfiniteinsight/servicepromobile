import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PaymentMethods = () => {
  const [methods, setMethods] = useState({
    cash: true,
    creditCard: true,
    ach: true,
    check: true,
  });

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: DollarSign, enabled: methods.cash },
    { id: "creditCard", label: "Credit Card", icon: CreditCard, enabled: methods.creditCard },
    { id: "ach", label: "ACH Transfer", icon: Building2, enabled: methods.ach },
    { id: "check", label: "Check", icon: Check, enabled: methods.check },
  ];

  const toggleMethod = (methodId: keyof typeof methods) => {
    setMethods(prev => ({
      ...prev,
      [methodId]: !prev[methodId],
    }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Payment Methods" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Info */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable payment methods available to customers.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-2">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between",
                  method.enabled ? "bg-card" : "bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    method.enabled ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      method.enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.label}
                  </Label>
                </div>
                <Switch
                  id={method.id}
                  checked={method.enabled}
                  onCheckedChange={() => toggleMethod(method.id as keyof typeof methods)}
                />
              </div>
            );
          })}
        </div>

        {/* Add Custom Method */}
        <Button variant="outline" className="w-full">
          Add Custom Payment Method
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
