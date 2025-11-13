import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const BusinessPolicies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentTerms, setPaymentTerms] = useState("due_on_receipt");
  const [termsConditions, setTermsConditions] = useState("");
  const [cancellationReturn, setCancellationReturn] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Business Policies Updated",
      description: "Your business policies have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="hover:bg-primary-foreground/20 text-primary-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Business Policies</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto animate-fade-in">
        <Card className="border-2 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="payment-terms" className="text-base font-semibold text-foreground">
                  Payment Terms:
                </Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger id="payment-terms" className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due_on_receipt">due on receipt</SelectItem>
                    <SelectItem value="net_15">Net 15</SelectItem>
                    <SelectItem value="net_30">Net 30</SelectItem>
                    <SelectItem value="net_60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="terms-conditions" className="text-base font-semibold text-foreground">
                  Terms & Conditions:
                </Label>
                <Textarea
                  id="terms-conditions"
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Enter your terms and conditions..."
                  className="min-h-[300px] border-2 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="cancellation-return" className="text-base font-semibold text-foreground">
                  Cancellation & Return:
                </Label>
                <Textarea
                  id="cancellation-return"
                  value={cancellationReturn}
                  onChange={(e) => setCancellationReturn(e.target.value)}
                  placeholder="Enter your cancellation and return policy..."
                  className="min-h-[300px] border-2 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold"
              >
                SUBMIT
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BusinessPolicies;
