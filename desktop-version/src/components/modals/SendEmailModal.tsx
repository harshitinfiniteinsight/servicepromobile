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

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerEmail: string;
}

export const SendEmailModal = ({
  open,
  onOpenChange,
  customerEmail,
}: SendEmailModalProps) => {
  const [email, setEmail] = useState(customerEmail);

  useEffect(() => {
    if (open) {
      setEmail(customerEmail);
    }
  }, [customerEmail, open]);

  const handleSend = () => {
    // Email sending logic here
    console.log("Sending email to:", email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white">
        {/* Header with teal background */}
        <DialogHeader className="bg-teal-600 text-white p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Send email</DialogTitle>
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
            <Label className="text-gray-600">Email send to :</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="border-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-teal-600 text-teal-600 font-medium"
            />
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
