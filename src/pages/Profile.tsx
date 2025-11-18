import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@servicepro.com",
    phone: "(555) 123-4567",
    businessName: "ServicePro Solutions",
    address: "123 Business St, City, State 12345",
  });

  const handleSave = () => {
    // In real app, save profile
    alert("Profile updated successfully!");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Profile" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {formData.fullName.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Tap to change photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label>Business Name</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div>
            <Label>Address</Label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full" size="lg" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
