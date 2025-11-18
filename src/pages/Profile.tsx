import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/utils/toast";

const Profile = () => {
  const [formData, setFormData] = useState({
    businessName: "ServicePro Solutions",
    ownerFirstName: "John",
    ownerLastName: "Doe",
    merchantEmployeeId: "6817175129155",
    birthdate: "",
    phone: "8000260025",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setFormData({ ...formData, phone: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Handle DD/MM/YYYY format
    if (value.includes("/")) {
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        // Store as YYYY-MM-DD internally
        setFormData({
          ...formData,
          birthdate: `${year}-${month}-${day}`,
        });
        return;
      }
    }
    setFormData({ ...formData, birthdate: value });
  };

  const getDateInputValue = () => {
    if (!formData.birthdate) return "";
    // Convert YYYY-MM-DD to DD/MM/YYYY for input
    const parts = formData.birthdate.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return formData.birthdate;
  };

  const validateFields = () => {
    // Basic validation
    if (!formData.businessName.trim()) {
      return false;
    }
    if (!formData.ownerFirstName.trim()) {
      return false;
    }
    if (!formData.ownerLastName.trim()) {
      return false;
    }
    if (!formData.phone.trim()) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // Validate fields
    if (!validateFields()) {
      // You could show an error toast here if needed
      return;
    }

    // Save the profile data (in a real app, this would be an API call)
    // For now, we'll just simulate saving
    
    // Exit edit mode
    setIsEditing(false);
    
    // Show success toast
    showSuccessToast("Profile updated successfully.");
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#FDF4EF" }}>
      <MobileHeader 
        title="Profile" 
        showBack={true}
        actions={
          isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="h-7 px-3 rounded-full text-xs font-medium transition-colors bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditToggle}
              className="h-7 px-3 rounded-full text-xs font-medium transition-colors border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          )
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-12 pb-4">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-2 mx-4">
          {/* Two-Column Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Business Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Business name
                </Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  disabled={!isEditing}
                  className={cn(
                    "rounded-lg border-gray-300 h-10",
                    isEditing ? "bg-white" : "bg-gray-50"
                  )}
                />
              </div>

              {/* Owner Last Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Owner last name
                </Label>
                <Input
                  value={formData.ownerLastName}
                  onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                  disabled={!isEditing}
                  className={cn(
                    "rounded-lg border-gray-300 h-10",
                    isEditing ? "bg-white" : "bg-gray-50"
                  )}
                />
              </div>

              {/* Birthdate */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Birthdate
                </Label>
                <Input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={getDateInputValue()}
                  onChange={handleDateChange}
                  disabled={!isEditing}
                  className={cn(
                    "rounded-lg border-gray-300 h-10",
                    isEditing ? "bg-white" : "bg-gray-50"
                  )}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Owner First Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Owner first name
                </Label>
                <Input
                  value={formData.ownerFirstName}
                  onChange={(e) => setFormData({ ...formData, ownerFirstName: e.target.value })}
                  disabled={!isEditing}
                  className={cn(
                    "rounded-lg border-gray-300 h-10",
                    isEditing ? "bg-white" : "bg-gray-50"
                  )}
                />
              </div>

              {/* Merchant/Employee ID */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Merchant/Employee ID
                </Label>
                <Input
                  value={formData.merchantEmployeeId}
                  disabled
                  className="rounded-lg border-gray-300 bg-gray-50 h-10"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold" style={{ color: "#F97316" }}>
                  Phone
                </Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={!isEditing}
                  className={cn(
                    "rounded-lg border-gray-300 h-10",
                    isEditing ? "bg-white" : "bg-gray-50"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
