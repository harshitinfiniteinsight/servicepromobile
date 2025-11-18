import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, List, Edit, StickyNote, Share2 } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AddNoteModal } from "@/components/modals/AddNoteModal";
import { ShareAppointmentModal } from "@/components/modals/ShareAppointmentModal";
import { AppointmentDetailsModal } from "@/components/modals/AppointmentDetailsModal";
import { EditAppointmentModal } from "@/components/modals/EditAppointmentModal";
import { useToast } from "@/hooks/use-toast";

const ManageAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");

  // Apply filters from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.calendarView) {
        setCalendarView(location.state.calendarView);
      }
      if (location.state.selectedDate) {
        // Set the current date based on selectedDate
        // The calendar will filter appointments for this date
      }
      // Clear the state to prevent re-applying on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [shareAppointmentOpen, setShareAppointmentOpen] = useState(false);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [editAppointmentOpen, setEditAppointmentOpen] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [editAppointmentData, setEditAppointmentData] = useState<any>(null);

  const initialAppointments = [
    {
      id: "APT-001",
      customerName: "Sarah Johnson",
      subject: "HVAC Maintenance Check",
      date: "2025-10-27",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      employee: "John Doe",
      status: "Active" as const,
    },
    {
      id: "APT-002",
      customerName: "Mike Williams",
      subject: "Plumbing Consultation",
      date: "2025-10-27",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      employee: "Jane Smith",
      status: "Active" as const,
    },
    {
      id: "APT-003",
      customerName: "Emily Davis",
      subject: "Electrical Inspection",
      date: "2025-10-27",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      employee: "John Doe",
      status: "Deactivated" as const,
    },
    {
      id: "APT-004",
      customerName: "Robert Brown",
      subject: "AC Unit Installation",
      date: "2025-10-27",
      startTime: "04:00 PM",
      endTime: "05:30 PM",
      employee: "Mike Johnson",
      status: "Active" as const,
    },
    {
      id: "APT-005",
      customerName: "Jessica Wilson",
      subject: "Water Heater Repair",
      date: "2025-10-28",
      startTime: "08:00 AM",
      endTime: "09:00 AM",
      employee: "Jane Smith",
      status: "Active" as const,
    },
    {
      id: "APT-006",
      customerName: "David Martinez",
      subject: "Furnace Maintenance",
      date: "2025-10-28",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      employee: "John Doe",
      status: "Active" as const,
    },
    {
      id: "APT-007",
      customerName: "Lisa Anderson",
      subject: "Circuit Breaker Replacement",
      date: "2025-10-28",
      startTime: "01:00 PM",
      endTime: "02:30 PM",
      employee: "Mike Johnson",
      status: "Deactivated" as const,
    },
    {
      id: "APT-008",
      customerName: "James Taylor",
      subject: "Duct Cleaning Service",
      date: "2025-10-28",
      startTime: "03:30 PM",
      endTime: "05:00 PM",
      employee: "John Doe",
      status: "Active" as const,
    },
  ];

  const [appointments, setAppointments] = useState(initialAppointments);

  const handleToggleAppointmentStatus = (appointmentId: string) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === appointmentId) {
        const newStatus = apt.status === "Active" ? "Deactivated" : "Active";
        toast({
          title: `Appointment ${newStatus}`,
          description: `The appointment has been ${newStatus.toLowerCase()} successfully.`,
        });
        return { ...apt, status: newStatus as "Active" | "Deactivated" };
      }
      return apt;
    }));
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailsOpen(true);
  };

  const handleEditAppointment = (appointmentId: string, data: any) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, ...data };
      }
      return apt;
    }));
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search appointments..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Appointments</h1>
            <p className="text-sm sm:text-base text-muted-foreground">View and manage all appointments</p>
          </div>
          <Button 
            onClick={() => navigate("/appointments/add")} 
            className="gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Appointment</span>
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted">
            <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Calendar View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <List className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Appointment List</span>
            </TabsTrigger>
          </TabsList>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={calendarView === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("month")}
                  className="flex-1 sm:flex-initial"
                >
                  Month
                </Button>
                <Button
                  variant={calendarView === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("week")}
                  className="flex-1 sm:flex-initial"
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("day")}
                  className="flex-1 sm:flex-initial"
                >
                  Day
                </Button>
              </div>
            </div>

            {/* Calendar Views */}
            {calendarView === "month" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const currentDate = new Date(2025, 9, 27); // Oct 27, 2025 (month is 0-indexed)
                      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                      const startDate = new Date(firstDayOfMonth);
                      startDate.setDate(startDate.getDate() - startDate.getDay());
                      
                      const cellDate = new Date(startDate);
                      cellDate.setDate(cellDate.getDate() + i);
                      
                      const dateStr = cellDate.toISOString().split('T')[0];
                      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
                      const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
                      const isToday = dateStr === currentDate.toISOString().split('T')[0];
                      
                      return (
                        <div
                          key={i}
                          className={cn(
                            "min-h-24 p-2 rounded-lg border transition-all cursor-pointer",
                            isCurrentMonth ? "bg-card border-border hover:shadow-md" : "bg-muted/30 border-muted",
                            isToday && "ring-2 ring-primary"
                          )}
                        >
                          <div className={cn(
                            "text-xs font-semibold mb-1",
                            isToday ? "text-primary" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {cellDate.getDate()}
                          </div>
                          {dayAppointments.slice(0, 3).map((apt) => (
                            <div 
                              key={apt.id} 
                              className="text-xs p-1 mb-1 bg-primary/10 rounded border border-primary/20 truncate hover:bg-primary/20 cursor-pointer transition-colors"
                              onClick={() => handleAppointmentClick(apt)}
                            >
                              <div className="font-medium">{apt.startTime}</div>
                              <div className="truncate text-muted-foreground">{apt.subject}</div>
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs font-medium text-primary">+{dayAppointments.length - 3} more</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {calendarView === "week" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const weekStart = new Date(2025, 9, 27); // Oct 27, 2025
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + dayIndex);
                      
                      const dateStr = weekStart.toISOString().split('T')[0];
                      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
                      const isToday = dateStr === new Date(2025, 9, 27).toISOString().split('T')[0];
                      
                      return (
                        <div key={dayIndex} className={cn(
                          "border rounded-lg p-3 min-h-[400px]",
                          isToday ? "border-primary bg-primary/5" : "border-border"
                        )}>
                          <h3 className={cn(
                            "font-bold text-sm mb-3 pb-2 border-b",
                            isToday ? "text-primary border-primary/20" : "text-foreground border-border"
                          )}>
                            {weekStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </h3>
                          <div className="space-y-2">
                            {dayAppointments.length > 0 ? (
                              dayAppointments.map((apt) => (
                                <div 
                                  key={apt.id} 
                                  className="p-2 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                                  onClick={() => handleAppointmentClick(apt)}
                                >
                                  <div className="text-xs font-bold text-primary mb-1">{apt.startTime}</div>
                                  <div className="text-xs font-semibold text-foreground truncate">{apt.subject}</div>
                                  <div className="text-xs text-muted-foreground truncate">{apt.customerName}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{apt.employee}</div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground italic text-center mt-8">No appointments</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {calendarView === "day" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="mb-4 pb-3 border-b">
                    <h2 className="text-xl font-bold text-foreground">
                      {new Date(2025, 9, 27).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                  </div>
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const today = new Date(2025, 9, 27).toISOString().split('T')[0];
                      const hourAppointments = appointments.filter(apt => {
                        const aptHour = parseInt(apt.startTime.split(':')[0]);
                        return apt.date === today && aptHour === hour;
                      });
                      
                      const isBusinessHour = hour >= 8 && hour <= 17;
                      
                      return (
                        <div key={hour} className={cn(
                          "flex gap-3 p-3 rounded-lg border transition-all",
                          hourAppointments.length > 0 ? "bg-primary/5 border-primary/20 hover:shadow-md" : "bg-muted/10 border-border",
                          !isBusinessHour && "opacity-50"
                        )}>
                          <div className="w-24 text-base font-bold text-foreground">
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          <div className="flex-1 space-y-2">
                            {hourAppointments.length > 0 ? (
                              hourAppointments.map((apt) => (
                                <div 
                                  key={apt.id} 
                                  className="p-3 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer"
                                  onClick={() => handleAppointmentClick(apt)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-bold text-foreground">{apt.subject}</p>
                                      <p className="text-sm text-muted-foreground mt-1">Customer: {apt.customerName}</p>
                                      <p className="text-sm text-muted-foreground">Employee: {apt.employee}</p>
                                    </div>
                                    <div className="text-xs font-semibold text-primary px-2 py-1 bg-primary/20 rounded">
                                      {apt.startTime}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="h-8 flex items-center">
                                <span className="text-sm text-muted-foreground italic">Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointment List Tab */}
          <TabsContent value="list" className="space-y-4 mt-6">
            {selectedAppointments.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium">
                  {selectedAppointments.length} appointment(s) selected
                </p>
                <Button
                  onClick={() => setShareAppointmentOpen(true)}
                  className="gap-2"
                  size="sm"
                >
                  <Share2 className="h-4 w-4" />
                  Share Appointment
                </Button>
              </div>
            )}

            <Card className="border border-border bg-card shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                  <Checkbox
                    checked={selectedAppointments.length === appointments.filter(apt => apt.status === "Active").length && appointments.filter(apt => apt.status === "Active").length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAppointments(appointments.filter(apt => apt.status === "Active").map((apt) => apt.id));
                      } else {
                        setSelectedAppointments([]);
                      }
                    }}
                  />
                  <span className="text-sm font-semibold">Select All Active</span>
                </div>

                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-start gap-3 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border hover:shadow-md transition-all">
                      {apt.status === "Active" && (
                        <Checkbox
                          checked={selectedAppointments.includes(apt.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAppointments([...selectedAppointments, apt.id]);
                            } else {
                              setSelectedAppointments(
                                selectedAppointments.filter((id) => id !== apt.id)
                              );
                            }
                          }}
                          className="mt-1"
                        />
                      )}
                      {apt.status === "Deactivated" && (
                        <div className="w-4 h-4 mt-1" />
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="font-bold text-foreground">{apt.subject}</h3>
                            <p className="text-sm text-muted-foreground">Customer: {apt.customerName}</p>
                            <p className="text-sm text-muted-foreground">Employee: {apt.employee}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md border border-accent/20">
                                {apt.date}
                              </span>
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                                {apt.startTime} - {apt.endTime}
                              </span>
                            </div>
                          </div>

                          <Badge
                            variant={apt.status === "Active" ? "default" : "secondary"}
                            className="w-fit"
                          >
                            {apt.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setEditAppointmentData(apt);
                              setEditAppointmentOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setCurrentAppointmentId(apt.id);
                              setAddNoteOpen(true);
                            }}
                          >
                            <StickyNote className="h-4 w-4" />
                            Add Note
                          </Button>
                          {apt.status === "Active" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                  setSelectedAppointments([apt.id]);
                                  setShareAppointmentOpen(true);
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                                Share
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleToggleAppointmentStatus(apt.id)}
                              >
                                Deactivate
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleToggleAppointmentStatus(apt.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AddNoteModal
        open={addNoteOpen}
        onOpenChange={setAddNoteOpen}
        appointmentId={currentAppointmentId}
      />
      
      <ShareAppointmentModal
        open={shareAppointmentOpen}
        onOpenChange={setShareAppointmentOpen}
        selectedAppointments={selectedAppointments}
      />

      <AppointmentDetailsModal
        open={appointmentDetailsOpen}
        onOpenChange={setAppointmentDetailsOpen}
        appointment={selectedAppointment}
        onToggleStatus={handleToggleAppointmentStatus}
        onEdit={(apt) => {
          setEditAppointmentData(apt);
          setEditAppointmentOpen(true);
          setAppointmentDetailsOpen(false);
        }}
        onAddNote={(apt) => {
          setCurrentAppointmentId(apt.id);
          setAddNoteOpen(true);
          setAppointmentDetailsOpen(false);
        }}
      />

      <EditAppointmentModal
        open={editAppointmentOpen}
        onOpenChange={setEditAppointmentOpen}
        appointment={editAppointmentData}
        onSave={handleEditAppointment}
      />
    </div>
  );
};

export default ManageAppointments;
