import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ChangeLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
    { code: "de", name: "German", native: "Deutsch" },
    { code: "it", name: "Italian", native: "Italiano" },
    { code: "pt", name: "Portuguese", native: "Português" },
  ];

  const handleSave = () => {
    // In real app, save language preference
    alert(`Language changed to ${languages.find(l => l.code === selectedLanguage)?.name}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Change Language" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Info */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Select Language</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language for the app interface.
              </p>
            </div>
          </div>
        </div>

        {/* Language List */}
        <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <div className="space-y-2">
            {languages.map(lang => (
              <div
                key={lang.code}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-colors",
                  selectedLanguage === lang.code
                    ? "bg-primary/10 border-primary"
                    : "bg-card hover:bg-accent/5"
                )}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={lang.code} id={lang.code} />
                    <Label htmlFor={lang.code} className="cursor-pointer">
                      <div>
                        <p className="font-semibold">{lang.name}</p>
                        <p className="text-sm text-muted-foreground">{lang.native}</p>
                      </div>
                    </Label>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Save Button */}
        <Button className="w-full" size="lg" onClick={handleSave}>
          Save Language
        </Button>
      </div>
    </div>
  );
};

export default ChangeLanguage;
