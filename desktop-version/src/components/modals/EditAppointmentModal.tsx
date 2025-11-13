import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: string;
    subject: string;
    customerName: string;
    employee: string;
    date: string;
    startTime: string;
    endTime: string;
    status: "Active" | "Deactivated";
  } | null;
  onSave: (appointmentId: string, data: any) => void;
}

export const EditAppointmentModal = ({
  open,
  onOpenChange,
  appointment,
  onSave,
}: EditAppointmentModalProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState(appointment?.subject || "");
  const [appointmentDate, setAppointmentDate] = useState(appointment?.date || "");
  const [timeRange, setTimeRange] = useState(
    appointment ? `${appointment.startTime} - ${appointment.endTime}` : ""
  );
  const [repeated, setRepeated] = useState("Not Repeated");
  const [reminderBefore, setReminderBefore] = useState("10 Minutes");
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (!appointment) return;

    const updatedData = {
      subject,
      date: appointmentDate,
      startTime: timeRange.split(" - ")[0] || appointment.startTime,
      endTime: timeRange.split(" - ")[1] || appointment.endTime,
      note,
    };

    onSave(appointment.id, updatedData);
    toast({
      title: "Appointment Updated",
      description: "The appointment has been updated successfully.",
    });
    onOpenChange(false);
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter appointment subject"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">
                Appointment Date
              </Label>
              <Input
                id="date"
                type="text"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold">
                Appointment Time
              </Label>
              <Input
                id="time"
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="HH:MM - HH:MM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repeated" className="text-sm font-semibold">
                Repeated
              </Label>
              <Select value={repeated} onValueChange={setRepeated}>
                <SelectTrigger id="repeated">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Repeated">Not Repeated</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder" className="text-sm font-semibold">
                Reminder Before
              </Label>
              <Select value={reminderBefore} onValueChange={setReminderBefore}>
                <SelectTrigger id="reminder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5 Minutes">5 Minutes</SelectItem>
                  <SelectItem value="10 Minutes">10 Minutes</SelectItem>
                  <SelectItem value="15 Minutes">15 Minutes</SelectItem>
                  <SelectItem value="30 Minutes">30 Minutes</SelectItem>
                  <SelectItem value="1 Hour">1 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-semibold">
              Appointment Note
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter any notes for this appointment"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} size="lg" className="px-8">
              SAVE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
