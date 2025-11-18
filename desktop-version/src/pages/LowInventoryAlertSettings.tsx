import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Mail, Phone, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LowInventoryAlertSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [email, setEmail] = useState("alerts@example.com");
  const [emailEditing, setEmailEditing] = useState(false);
  
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [phoneEditing, setPhoneEditing] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Low inventory alert settings have been updated successfully.",
    });
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search inventory..." />
      
      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/inventory")}
            className="gap-2 hover:bg-muted -ml-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Inventory
          </Button>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Low Inventory Count Alert
            </h1>
            <p className="text-muted-foreground">
              Configure how you want to receive low inventory alerts
            </p>
          </div>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Email Alert Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                Email Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Enable Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when inventory is low
                  </p>
                </div>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!emailEditing}
                      className="h-12 text-base disabled:opacity-100 disabled:cursor-default"
                    />
                  </div>
                  <Button
                    variant={emailEditing ? "default" : "outline"}
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => {
                      if (emailEditing) {
                        toast({
                          title: "Email Updated",
                          description: "Email address has been saved.",
                        });
                      }
                      setEmailEditing(!emailEditing);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Alert Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                SMS Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Enable SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text messages when inventory is low
                  </p>
                </div>
                <Switch
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!phoneEditing}
                      className="h-12 text-base disabled:opacity-100 disabled:cursor-default"
                    />
                  </div>
                  <Button
                    variant={phoneEditing ? "default" : "outline"}
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => {
                      if (phoneEditing) {
                        toast({
                          title: "Phone Updated",
                          description: "Phone number has been saved.",
                        });
                      }
                      setPhoneEditing(!phoneEditing);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveSettings}
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-all px-8"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LowInventoryAlertSettings;
