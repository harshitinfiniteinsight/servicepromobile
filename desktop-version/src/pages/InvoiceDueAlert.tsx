import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell } from "lucide-react";
import { toast } from "sonner";

const InvoiceDueAlert = () => {
  const navigate = useNavigate();
  const [reminderDays, setReminderDays] = useState("1");
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(true);
  const [smsAlertEnabled, setSmsAlertEnabled] = useState(true);

  const handleSave = () => {
    toast.success("Invoice Due Alert settings saved successfully");
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
            onClick={() => navigate("/invoices")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invoice Due Alert</h1>
              <p className="text-muted-foreground">Configure automatic payment reminders</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Days Selection Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <Label className="text-lg font-semibold text-foreground">
                    Select days to send Invoice Due Alert to customer
                  </Label>
                  <div className="flex justify-center">
                    <Select value={reminderDays} onValueChange={setReminderDays}>
                      <SelectTrigger className="w-[200px] h-12 text-lg font-medium border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-center text-muted-foreground">
                    Invoice due reminder will be repeatedly sent to your customer every{" "}
                    <span className="font-semibold text-foreground">{reminderDays}</span>{" "}
                    {reminderDays === "1" ? "day" : "days"} until paid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Alert Card */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all hover-scale">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="text-center pb-4 border-b-2 border-primary/20">
                    <h3 className="text-xl font-bold text-foreground">Email Alert</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {emailAlertEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-4">
                    <Label htmlFor="email-alert" className="text-lg font-medium cursor-pointer">
                      Email Alert
                    </Label>
                    <Switch
                      id="email-alert"
                      checked={emailAlertEnabled}
                      onCheckedChange={setEmailAlertEnabled}
                      className="scale-125"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SMS Alert Card */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all hover-scale">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="text-center pb-4 border-b-2 border-primary/20">
                    <h3 className="text-xl font-bold text-foreground">SMS Alert</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {smsAlertEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-4">
                    <Label htmlFor="sms-alert" className="text-lg font-medium cursor-pointer">
                      SMS Alert
                    </Label>
                    <Switch
                      id="sms-alert"
                      checked={smsAlertEnabled}
                      onCheckedChange={setSmsAlertEnabled}
                      className="scale-125"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSave}
              size="lg"
              className="w-full md:w-auto px-12 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceDueAlert;
