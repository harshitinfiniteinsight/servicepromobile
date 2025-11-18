import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockCustomers, mockEmployees } from "@/data/mockData";
import { QuickAddCustomerModal } from "@/components/modals/QuickAddCustomerModal";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { useToast } from "@/hooks/use-toast";

const AddAppointment = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [quickAddCustomerOpen, setQuickAddCustomerOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    customer: "",
    employee: "",
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
      title: "Appointment Added",
      description: "The appointment has been scheduled successfully.",
    });
  };

  const mockCategories = [
    { id: "1", name: "HVAC Service", color: "#FF6B35" },
    { id: "2", name: "Plumbing", color: "#004E89" },
    { id: "3", name: "Electrical", color: "#F77F00" },
  ];

  const mockAppointmentHistory = [
    {
      id: "APT-001",
      employeeId: "E-001",
      customerName: "Sarah Johnson",
      subject: "HVAC Maintenance",
      date: "2025-10-20",
      time: "10:00 AM",
    },
    {
      id: "APT-002",
      employeeId: "E-001",
      customerName: "Mike Williams",
      subject: "Plumbing Check",
      date: "2025-10-22",
      time: "2:00 PM",
    },
    {
      id: "APT-003",
      employeeId: "E-002",
      customerName: "Emma Davis",
      subject: "Electrical Repair",
      date: "2025-10-21",
      time: "11:00 AM",
    },
    {
      id: "APT-004",
      employeeId: "E-002",
      customerName: "James Wilson",
      subject: "Appliance Installation",
      date: "2025-10-23",
      time: "3:00 PM",
    },
  ];

  // Filter appointments by selected employee
  const filteredAppointmentHistory = formData.employee
    ? mockAppointmentHistory.filter((apt) => apt.employeeId === formData.employee)
    : [];

  // Get selected employee name
  const selectedEmployee = mockEmployees.find((emp) => emp.id === formData.employee);

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add Appointment</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Schedule a new appointment</p>
          </div>
          {formData.employee && (
            <Button 
              variant="outline"
              onClick={() => document.getElementById('appointment-history')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto"
            >
              Appointment History
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border border-border bg-card shadow-md">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <Label htmlFor="subject">Appointment Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., HVAC Maintenance Check"
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
                      {mockEmployees.map((employee) => (
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
                        {mockCustomers.map((customer) => (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 sm:flex-initial">
                  Add Appointment
                </Button>
                <Button type="button" variant="outline" className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Appointment History Section */}
        {formData.employee && (
          <div id="appointment-history">
            <Card className="border border-border bg-card shadow-md">
              <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle className="text-lg font-bold">
                  Appointment History of {selectedEmployee?.name || ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {filteredAppointmentHistory.length > 0 ? (
                    filteredAppointmentHistory.map((apt) => (
                      <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h4 className="font-semibold text-foreground">{apt.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{apt.subject}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">{apt.date}</span>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{apt.time}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No appointment history found for this employee.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <QuickAddCustomerModal open={quickAddCustomerOpen} onOpenChange={setQuickAddCustomerOpen} />
      <AddCategoryModal open={addCategoryOpen} onOpenChange={setAddCategoryOpen} selectedEmployee={formData.employee} />
    </div>
  );
};

export default AddAppointment;
