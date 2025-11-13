import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

const BusinessPolicies = () => {
  const [policies, setPolicies] = useState({
    cancellation: "Cancellations must be made at least 24 hours in advance. Same-day cancellations may incur a 50% charge.",
    payment: "Payment is due upon completion of service unless otherwise agreed. Late payments may incur a 5% monthly fee.",
    guarantee: "We guarantee all work for 90 days. If issues arise due to our workmanship, we will return to fix at no charge.",
  });

  const handleSave = () => {
    // In real app, save policies
    alert("Business policies updated successfully!");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Business Policies" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Info */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Business Policies</h3>
              <p className="text-sm text-muted-foreground">
                Define your business policies that will be shown to customers.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Forms */}
        <div className="space-y-4">
          <div>
            <Label>Cancellation Policy</Label>
            <Textarea
              className="min-h-[120px] mt-2"
              value={policies.cancellation}
              onChange={(e) => setPolicies({ ...policies, cancellation: e.target.value })}
              placeholder="Enter cancellation policy..."
            />
          </div>

          <div>
            <Label>Payment Terms</Label>
            <Textarea
              className="min-h-[120px] mt-2"
              value={policies.payment}
              onChange={(e) => setPolicies({ ...policies, payment: e.target.value })}
              placeholder="Enter payment terms..."
            />
          </div>

          <div>
            <Label>Service Guarantee</Label>
            <Textarea
              className="min-h-[120px] mt-2"
              value={policies.guarantee}
              onChange={(e) => setPolicies({ ...policies, guarantee: e.target.value })}
              placeholder="Enter service guarantee..."
            />
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full" size="lg" onClick={handleSave}>
          Save Policies
        </Button>
      </div>
    </div>
  );
};

export default BusinessPolicies;
