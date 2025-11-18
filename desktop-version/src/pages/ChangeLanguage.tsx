import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ChangeLanguage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    toast({
      title: "Language Changed",
      description: `App language has been changed to ${value === "english" ? "English" : "Spanish"}.`,
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
        <h1 className="text-xl font-semibold">Change App Language</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-12">
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            The app language will be set by default to your Clover POS set language.
            <br />
            You may choose to change the language using the options below.
          </p>
        </div>

        <Card className="border-2 shadow-xl bg-primary/5 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
              <div className="flex items-center justify-between p-6 border-b border-primary/20">
                <Label htmlFor="english" className="text-2xl font-semibold text-primary cursor-pointer flex-1">
                  English
                </Label>
                <RadioGroupItem
                  value="english"
                  id="english"
                  className="h-8 w-8 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>

              <div className="flex items-center justify-between p-6">
                <Label htmlFor="spanish" className="text-2xl font-semibold text-primary cursor-pointer flex-1">
                  Spanish
                </Label>
                <RadioGroupItem
                  value="spanish"
                  id="spanish"
                  className="h-8 w-8 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChangeLanguage;
