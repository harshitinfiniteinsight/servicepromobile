import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockCustomers, mockEmployees } from "@/data/mockData";
import { QuickAddCustomerModal } from "./QuickAddCustomerModal";
import { AddCategoryModal } from "./AddCategoryModal";
import { useToast } from "@/hooks/use-toast";

interface AddAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledData?: {
    subject?: string;
    customerId?: string;
    employeeId?: string;
  };
}

export const AddAppointmentModal = ({ 
  open, 
  onOpenChange,
  prefilledData 
}: AddAppointmentModalProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [quickAddCustomerOpen, setQuickAddCustomerOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: prefilledData?.subject || "",
    customer: prefilledData?.customerId || "",
    employee: prefilledData?.employeeId || "",
    category: "",
    email: "",
    phone: "",
    address: "",
    time: "",
    note: "",
    reminder: "30mins",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appointment Scheduled",
      description: "The follow-up appointment has been scheduled successfully.",
    });
    onOpenChange(false);
  };

  const mockCategories = [
    { id: "1", name: "HVAC Service", color: "#FF6B35" },
    { id: "2", name: "Plumbing", color: "#004E89" },
    { id: "3", name: "Electrical", color: "#F77F00" },
    { id: "4", name: "Follow Up", color: "#10B981" },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Appointment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="subject">Appointment Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Follow Up"
                  required
                />
              </div>

              {/* Employee, Customer, and Category in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employee">Select Employee *</Label>
                  <Select value={formData.employee} onValueChange={(value) => setFormData({ ...formData, employee: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.filter(e => e.status === "Active").map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customer">Select Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.customer} onValueChange={(value) => setFormData({ ...formData, customer: value })}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choose customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.filter(c => c.status === "active").map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={() => setQuickAddCustomerOpen(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={() => setAddCategoryOpen(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Appointment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time">Appointment Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="note">Appointment Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Additional notes or special instructions..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="reminder">Reminder Before</Label>
                <Select value={formData.reminder} onValueChange={(value) => setFormData({ ...formData, reminder: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10mins">10 minutes</SelectItem>
                    <SelectItem value="20mins">20 minutes</SelectItem>
                    <SelectItem value="30mins">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hrs">2 hours</SelectItem>
                    <SelectItem value="1day">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Appointment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <QuickAddCustomerModal open={quickAddCustomerOpen} onOpenChange={setQuickAddCustomerOpen} />
      <AddCategoryModal open={addCategoryOpen} onOpenChange={setAddCategoryOpen} selectedEmployee={formData.employee} />
    </>
  );
};
