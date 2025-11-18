import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

const ReturnPolicy = () => {
  const navigate = useNavigate();

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
        <h1 className="text-xl font-semibold">Cancellation & Return Policy</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto animate-fade-in">
        <Card className="border-2 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Cancellation & Return Policy</h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                At Service Pro911, we strive to provide the best service management experience. Please review our cancellation and return policy below.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">1. Service Cancellations</h3>
              <p>
                Customers may cancel scheduled appointments up to 24 hours before the scheduled time without penalty. Cancellations made less than 24 hours in advance may be subject to a cancellation fee.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">2. Refund Policy</h3>
              <p>
                Refunds for services are evaluated on a case-by-case basis. If you are not satisfied with the service provided, please contact us within 7 days of service completion.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">3. Subscription Cancellations</h3>
              <p>
                Subscription services may be cancelled at any time. Cancellations will be effective at the end of the current billing period. No partial refunds are provided for unused subscription time.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">4. Return of Equipment</h3>
              <p>
                Any equipment provided as part of service agreements must be returned within 14 days of service cancellation in its original condition.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">5. Contact Us</h3>
              <p>
                For questions about cancellations or returns, please contact our customer service team through the Help section.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReturnPolicy;
