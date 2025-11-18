import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [businessName, setBusinessName] = useState("Developer vv");
  const [businessEditing, setBusinessEditing] = useState(false);
  
  const [firstName, setFirstName] = useState("Mybmrr");
  const [firstNameEditing, setFirstNameEditing] = useState(false);
  
  const [lastName, setLastName] = useState("testt");
  const [lastNameEditing, setLastNameEditing] = useState(false);
  
  const [employeeId] = useState("6817175129155");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("8000260025");

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
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
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <Card className="border-2 shadow-xl bg-primary/5">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Business name</Label>
                <div className="flex gap-2 items-start">
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    disabled={!businessEditing}
                    className="text-base bg-background disabled:opacity-100 disabled:cursor-default border-primary/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBusinessEditing(!businessEditing)}
                    className="shrink-0"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Owner First Name */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Owner first name</Label>
                <div className="flex gap-2 items-start">
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!firstNameEditing}
                    className="text-base bg-background disabled:opacity-100 disabled:cursor-default border-primary/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFirstNameEditing(!firstNameEditing)}
                    className="shrink-0"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Owner Last Name */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Owner last name</Label>
                <div className="flex gap-2 items-start">
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!lastNameEditing}
                    className="text-base bg-background disabled:opacity-100 disabled:cursor-default border-primary/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLastNameEditing(!lastNameEditing)}
                    className="shrink-0"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Merchant/Employee ID */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Merchant/Employee ID</Label>
                <Input
                  value={employeeId}
                  disabled
                  className="text-base bg-background disabled:opacity-100 disabled:cursor-default border-primary/30"
                />
              </div>

              {/* Birthdate */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Birthdate</Label>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="text-base bg-background border-primary/30"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-lg text-primary font-semibold">Phone</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-base bg-background border-primary/30"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSave}
                className="px-12 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                SAVE
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
