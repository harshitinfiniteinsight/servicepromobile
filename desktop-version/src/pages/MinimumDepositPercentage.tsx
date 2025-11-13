import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Percent } from "lucide-react";
import { toast } from "sonner";

const MinimumDepositPercentage = () => {
  const navigate = useNavigate();
  const [depositPercentage, setDepositPercentage] = useState("10");

  const handleSave = () => {
    if (!depositPercentage || parseFloat(depositPercentage) <= 0 || parseFloat(depositPercentage) > 100) {
      toast.error("Please enter a valid percentage between 1 and 100");
      return;
    }
    toast.success("Minimum deposit percentage saved successfully");
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." onSearchChange={() => {}} />
      
      <main className="px-6 py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/agreements")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Minimum Deposit Percentage</h1>
              <p className="text-muted-foreground">Set the minimum required deposit for agreements</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Label className="text-lg font-semibold text-foreground">
                    Set minimum deposit amount to accept Agreement
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Customers must pay at least this percentage upfront
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="relative flex-1 max-w-sm">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground pointer-events-none">
                      %
                    </div>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={depositPercentage}
                      onChange={(e) => setDepositPercentage(e.target.value)}
                      className="h-16 text-2xl font-semibold text-center pl-12 pr-6 border-2"
                      placeholder="10"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSave}
                    size="lg"
                    className="h-16 px-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    SAVE
                  </Button>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mt-6">
                  <div className="flex items-center gap-2 justify-center">
                    <Percent className="h-5 w-5 text-primary" />
                    <p className="text-center text-muted-foreground">
                      Current minimum deposit:{" "}
                      <span className="font-bold text-foreground text-lg">{depositPercentage}%</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MinimumDepositPercentage;
