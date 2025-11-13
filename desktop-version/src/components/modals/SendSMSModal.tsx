import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendSMSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  phoneNumber: string;
}

export const SendSMSModal = ({
  open,
  onOpenChange,
  customerName,
  phoneNumber,
}: SendSMSModalProps) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState(phoneNumber);

  useEffect(() => {
    if (open) {
      setPhone(phoneNumber);
    }
  }, [phoneNumber, open]);

  const handleSend = () => {
    // SMS sending logic here
    console.log("Sending SMS to:", `${countryCode}${phone}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white">
        {/* Header with teal background */}
        <DialogHeader className="bg-teal-600 text-white p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Send SMS</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-teal-700 h-10 w-auto px-4 rounded-md"
            >
              <span className="text-lg font-semibold">Close</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">Mobile Number :</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 border border-gray-300 rounded-md"
                placeholder="+1"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="flex-1 border border-gray-300 rounded-md text-teal-600 font-medium"
              />
            </div>
          </div>

          <Button 
            onClick={handleSend} 
            className="w-full border-2 border-teal-600 text-teal-600 bg-white hover:bg-teal-50 font-semibold py-2"
          >
            SEND
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
