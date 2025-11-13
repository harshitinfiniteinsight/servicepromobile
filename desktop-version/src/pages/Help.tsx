import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckSquare } from "lucide-react";

const Help = () => {
  const navigate = useNavigate();

  const benefits = [
    "Works seamlessly.",
    "Assign customer appointments and dispatch employees, track employee progress.",
    "Send estimates and agreements via SMS/Email to your customer, receive payment via remotely.",
    "Create and manage your service agreements, invoices and estimates.",
    "Manage employee's work flow.",
    "Track employee."
  ];

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
        <h1 className="text-xl font-semibold">Service Pro911 - Help</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex justify-end mb-12">
          <div className="text-right">
            <h2 className="text-5xl font-bold text-muted-foreground mb-2">APP BENEFITS</h2>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <CheckSquare className="h-6 w-6 text-primary shrink-0 mt-1" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                {benefit}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16 gap-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 0 ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Help;
