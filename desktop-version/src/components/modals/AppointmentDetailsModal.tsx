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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, StickyNote, Link2, FileText, Receipt, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppointmentDetailsModalProps {
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
  onToggleStatus: (appointmentId: string) => void;
  onEdit: (appointment: any) => void;
  onAddNote: (appointment: any) => void;
}

export const AppointmentDetailsModal = ({
  open,
  onOpenChange,
  appointment,
  onToggleStatus,
  onEdit,
  onAddNote,
}: AppointmentDetailsModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [shareVia, setShareVia] = useState<"email-sms" | "email" | "sms">("email-sms");
  const [shareWith, setShareWith] = useState<"customer" | "employee" | "both">("customer");

  if (!appointment) return null;

  const handleShare = () => {
    toast({
      title: "Appointment Shared",
      description: `Shared via ${shareVia} with ${shareWith}`,
    });
  };

  const handleCreateEstimate = () => {
    navigate("/estimates", { state: { customer: appointment.customerName, employee: appointment.employee } });
    onOpenChange(false);
    toast({
      title: "Create Estimate",
      description: "Opening estimate form with pre-selected customer and employee",
    });
  };

  const handleCreateInvoice = () => {
    navigate("/invoices", { state: { customer: appointment.customerName, employee: appointment.employee } });
    onOpenChange(false);
    toast({
      title: "Create Invoice",
      description: "Opening invoice form with pre-selected customer and employee",
    });
  };

  const handleViewCustomer = () => {
    navigate(`/customers/${appointment.customerName}`);
    onOpenChange(false);
    toast({
      title: "View Customer",
      description: `Opening details for ${appointment.customerName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Appointment Details</DialogTitle>
            <div className="flex items-center gap-3">
              <Badge 
                variant={appointment.status === "Active" ? "default" : "secondary"}
                className="text-sm"
              >
                {appointment.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onEdit(appointment)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onAddNote(appointment)}
              >
                <StickyNote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Subject</Label>
              <Input
                value={appointment.subject}
                readOnly
                className="bg-muted/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Appointment Date Time</Label>
              <Input
                value={`${appointment.date} ${appointment.startTime} TO ${appointment.endTime}`}
                readOnly
                className="bg-muted/30 border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Customer Name</Label>
              <Input
                value={appointment.customerName}
                readOnly
                className="bg-muted/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Employee Name</Label>
              <Input
                value={appointment.employee}
                readOnly
                className="bg-muted/30 border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Appointment Note</Label>
              <Textarea
                placeholder="No notes added"
                readOnly
                className="bg-muted/30 border-border min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Repeated</Label>
              <Input
                value="Not Repeated"
                readOnly
                className="bg-muted/30 border-border"
              />
            </div>
          </div>

          {appointment.status === "Active" && (
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <Label className="text-base font-bold">Share Appointments</Label>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={shareVia === "email-sms" ? "default" : "outline"}
                    onClick={() => setShareVia("email-sms")}
                    className="flex-1 sm:flex-initial"
                  >
                    Email & SMS
                  </Button>
                  <Button
                    variant={shareVia === "email" ? "default" : "outline"}
                    onClick={() => setShareVia("email")}
                    className="flex-1 sm:flex-initial"
                  >
                    Email
                  </Button>
                  <Button
                    variant={shareVia === "sms" ? "default" : "outline"}
                    onClick={() => setShareVia("sms")}
                    className="flex-1 sm:flex-initial"
                  >
                    SMS
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={shareWith === "customer" ? "default" : "outline"}
                    onClick={() => setShareWith("customer")}
                    className="flex-1 sm:flex-initial"
                  >
                    Customer
                  </Button>
                  <Button
                    variant={shareWith === "employee" ? "default" : "outline"}
                    onClick={() => setShareWith("employee")}
                    className="flex-1 sm:flex-initial"
                  >
                    Employee
                  </Button>
                  <Button
                    variant={shareWith === "both" ? "default" : "outline"}
                    onClick={() => setShareWith("both")}
                    className="flex-1 sm:flex-initial"
                  >
                    Both
                  </Button>
                </div>

                <Button onClick={handleShare} className="w-full">
                  Share
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-initial"
              onClick={handleCreateEstimate}
            >
              <FileText className="h-4 w-4" />
              Create Estimate
            </Button>
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-initial"
              onClick={handleCreateInvoice}
            >
              <Receipt className="h-4 w-4" />
              Create Invoice
            </Button>
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-initial"
              onClick={handleViewCustomer}
            >
              <Users className="h-4 w-4" />
              View Customer
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              variant={appointment.status === "Active" ? "destructive" : "default"}
              onClick={() => {
                onToggleStatus(appointment.id);
                onOpenChange(false);
              }}
            >
              {appointment.status === "Active" ? "Deactivate" : "Activate"} Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
