import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";

interface FollowUpAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleAppointment: () => void;
}

export const FollowUpAppointmentModal = ({ 
  open, 
  onOpenChange,
  onScheduleAppointment 
}: FollowUpAppointmentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Follow-Up Appointment?
          </DialogTitle>
          <DialogDescription>
            Would you like to schedule a follow-up appointment for this customer?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Skip
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              onScheduleAppointment();
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
