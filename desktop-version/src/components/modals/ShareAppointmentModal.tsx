import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface ShareAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAppointments: string[];
}

export const ShareAppointmentModal = ({
  open,
  onOpenChange,
  selectedAppointments,
}: ShareAppointmentModalProps) => {
  const { toast } = useToast();
  const [shareVia, setShareVia] = useState("email");
  const [shareWith, setShareWith] = useState("customer");

  const handleShare = () => {
    toast({
      title: "Appointments Shared",
      description: `Shared ${selectedAppointments.length} appointment(s) via ${shareVia} to ${shareWith}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Share via</Label>
            <RadioGroup value={shareVia} onValueChange={setShareVia}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="cursor-pointer">
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer">
                  Email & SMS
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Share with</Label>
            <RadioGroup value={shareWith} onValueChange={setShareWith}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="cursor-pointer">
                  Customer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee" className="cursor-pointer">
                  Employee
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both-recipients" id="both-recipients" />
                <Label htmlFor="both-recipients" className="cursor-pointer">
                  Both
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              {selectedAppointments.length} appointment(s) selected
            </p>
            <Button onClick={handleShare} className="w-full">
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
