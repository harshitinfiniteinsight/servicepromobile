import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

const TermsConditions = () => {
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
        <h1 className="text-xl font-semibold">Terms & Conditions</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto animate-fade-in">
        <Card className="border-2 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Terms & Conditions</h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to Service Pro911. By accessing or using our application, you agree to be bound by these Terms and Conditions.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h3>
              <p>
                By using this application, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">2. Use of Service</h3>
              <p>
                You agree to use the Service Pro911 application only for lawful purposes and in accordance with these Terms.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">3. User Accounts</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">4. Privacy</h3>
              <p>
                Your use of the application is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground pt-4">5. Modifications</h3>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of modified terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TermsConditions;
