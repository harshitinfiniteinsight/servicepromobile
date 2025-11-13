import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAppointments } from "@/data/mobileMockData";
import {
  Plus,
  Calendar,
  Clock,
  User,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Share2,
  Ban,
  Circle,
  Send,
  BookmarkCheck,
  Trash2,
  UserPlus,
  Download,
  MoreVertical,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShareAppointmentModal from "@/components/modals/ShareAppointmentModal";
import AppointmentDetailsModal from "@/components/modals/AppointmentDetailsModal";
import AddNoteModal from "@/components/modals/AddNoteModal";

const ManageAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [focusedMonth, setFocusedMonth] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  
  // Get view from URL params or default to calendar
  const viewFromUrl = searchParams.get("view") as "calendar" | "list" | null;
  const [viewMode, setViewMode] = useState<"calendar" | "list">(viewFromUrl || "calendar");

  // Initialize URL param if not present
  useEffect(() => {
    if (!viewFromUrl) {
      setSearchParams({ view: viewMode }, { replace: true });
    }
  }, [viewFromUrl, viewMode, setSearchParams]);

  // Sync view mode with URL params
  useEffect(() => {
    if (viewFromUrl && viewFromUrl !== viewMode) {
      setViewMode(viewFromUrl);
    }
  }, [viewFromUrl, viewMode]);

  // Update URL when view mode changes
  const handleViewModeChange = (value: "calendar" | "list") => {
    setViewMode(value);
    setSearchParams({ view: value });
  };
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [singleAppointmentToShare, setSingleAppointmentToShare] = useState<typeof mockAppointments[0] | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState<string | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState<Record<string, Array<{ id: string; text: string; createdBy: string; createdAt: string }>>>({});
  
  // Get appointments for selected date
  const dayAppointments = mockAppointments.filter(apt => apt.date === selectedDate);
  
  const appointmentsByDate = useMemo(() => {
    return mockAppointments.reduce<Record<string, typeof mockAppointments>>((acc, appointment) => {
      acc[appointment.date] = acc[appointment.date] ? [...acc[appointment.date], appointment] : [appointment];
      return acc;
    }, {});
  }, []);

  const activeAppointmentIds = useMemo(
    () => mockAppointments.filter(apt => apt.status.toLowerCase() === "confirmed").map(apt => apt.id),
    []
  );

  const calendarDays = useMemo(() => {
    return generateCalendarDays(focusedMonth, todayISO);
  }, [focusedMonth, todayISO]);

  const sortedAppointments = [...mockAppointments].sort((a, b) => {
    if (a.date === b.date) {
      return new Date(`1970-01-01T${convertTo24Hour(a.time)}`).getTime() - new Date(`1970-01-01T${convertTo24Hour(b.time)}`).getTime();
    }
    return a.date.localeCompare(b.date);
  });

  function getTimeRange(startTime: string, duration?: string) {
    if (!duration) {
      return startTime;
    }

    const startDate = parseTime(startTime);
    if (!startDate) {
      return startTime;
    }

    const minutesToAdd = parseDurationToMinutes(duration);
    if (minutesToAdd === 0) {
      return startTime;
    }

    const endDate = new Date(startDate.getTime() + minutesToAdd * 60000);
    return `${startTime} - ${formatTo12Hour(endDate)}`;
  }

  function convertTo24Hour(time: string) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  function parseTime(time: string) {
    try {
      const normalized = convertTo24Hour(time);
      return new Date(`1970-01-01T${normalized}:00`);
    } catch (error) {
      return null;
    }
  }

  function parseDurationToMinutes(duration: string) {
    const match = duration.toLowerCase().match(/(\d+(\.\d+)?)\s*(hour|hr|hrs|minute|min|day)/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[3];

    if (unit.startsWith("hour") || unit.startsWith("hr")) {
      return Math.round(value * 60);
    }

    if (unit.startsWith("min")) {
      return Math.round(value);
    }

    if (unit.startsWith("day")) {
      return Math.round(value * 24 * 60);
    }

    return 0;
  }

  function formatTo12Hour(date: Date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }

  function handleSelectDate(dateISO: string) {
    setSelectedDate(dateISO);
    const newFocus = new Date(dateISO);
    newFocus.setDate(1);
    setFocusedMonth(newFocus);
  }

  function handleMonthChange(direction: "prev" | "next") {
    const newMonth = new Date(focusedMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
    setFocusedMonth(newMonth);
    handleSelectDate(toISODate(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1)));
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Appointments"
        showBack={true}
        actions={
          <Button size="sm" onClick={() => navigate(`/appointments/new?fromView=${viewMode}`)}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as "calendar" | "list")} className="flex flex-col h-full">
          <div className="px-4 pt-4 pb-2">
            <TabsList className="grid grid-cols-2 w-full bg-muted/40">
              <TabsTrigger value="calendar" className="text-sm">Calendar View</TabsTrigger>
              <TabsTrigger value="list" className="text-sm">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="flex-1 outline-none data-[state=inactive]:hidden">
            <div className="px-4">
              <div className="flex items-center justify-between py-3">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleMonthChange("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <p className="text-base font-semibold">
                    {focusedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap a date to view details
                  </p>
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleMonthChange("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground py-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 pb-4">
                {calendarDays.map(({ date, iso, isCurrentMonth, isToday }) => {
                  const isSelected = iso === selectedDate;
                  const appointments = appointmentsByDate[iso] ?? [];
                  const hasAppointments = appointments.length > 0;
                  const firstAppointment = appointments[0];
                  const remainingCount = appointments.length - 1;

                  return (
                    <button
                      key={iso}
                      onClick={() => handleSelectDate(iso)}
                      className={cn(
                        "flex flex-col items-center justify-center text-center border rounded-xl p-1 h-16 w-full transition-all overflow-hidden",
                        hasAppointments && "border-primary/25 shadow-sm",
                        isSelected && "border-primary ring-2 ring-primary/20 bg-primary/5",
                        !isCurrentMonth && "bg-muted/30 text-muted-foreground border-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium leading-tight",
                          isSelected ? "text-primary" : "text-gray-900",
                          !isCurrentMonth && "text-muted-foreground"
                        )}
                      >
                        {date.getDate()}
                      </span>
                      {hasAppointments && firstAppointment && (
                        <span
                          className="text-[10px] text-gray-600 truncate w-full px-0.5 leading-tight mt-0.5 cursor-pointer hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(firstAppointment);
                            setDetailsModalOpen(true);
                          }}
                        >
                          {firstAppointment.service}
                        </span>
                      )}
                      {remainingCount > 0 && (
                        <span className="text-[9px] font-semibold text-primary mt-0.5">
                          +{remainingCount} more
                        </span>
                      )}
                      {isToday && !hasAppointments && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-1 py-0.5 text-[8px] font-semibold uppercase text-primary mt-0.5">
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Appointments */}
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <Badge variant="outline">{dayAppointments.length} appointments</Badge>
              </div>

              {dayAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No appointments scheduled</p>
                  <Button onClick={() => navigate("/appointments/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                dayAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-xl border bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{appointment.time}</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-1">{appointment.service}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="h-3 w-3" />
                          <span>{appointment.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-accent">
                          {appointment.technicianName.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{appointment.technicianName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="flex-1 outline-none data-[state=inactive]:hidden">
            <div className="px-4 py-4 space-y-5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    const allActiveSelected = activeAppointmentIds.every(id => selectedAppointments.includes(id));
                    setSelectedAppointments(allActiveSelected ? [] : activeAppointmentIds);
                  }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-md border",
                      activeAppointmentIds.every(id => selectedAppointments.includes(id))
                        ? "border-primary bg-primary text-white"
                        : "border-primary bg-white text-transparent"
                    )}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span className="text-xs font-semibold text-primary tracking-wide uppercase">Select All Active</span>
                </button>
                {selectedAppointments.length > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-white shadow-sm hover:bg-primary/90"
                    onClick={() => setShareModalOpen(true)}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share Appointments ({selectedAppointments.length})
                  </Button>
                )}
              </div>

              {sortedAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.date);
                const timeRange = getTimeRange(appointment.time, appointment.duration);
                const isActive = appointment.status.toLowerCase() === "confirmed";
                const isSelected = selectedAppointments.includes(appointment.id);
                return (
                  <div
                    key={appointment.id}
                    className="rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm space-y-2.5"
                  >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppointments(prev =>
                                prev.includes(appointment.id)
                                  ? prev.filter(id => id !== appointment.id)
                                  : [...prev, appointment.id]
                              );
                            }}
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-md border transition-colors",
                              isSelected ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-transparent"
                            )}
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </button>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-semibold text-gray-900">{appointment.service}</h3>
                              <Badge className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                              )}>
                                {isActive ? "Activated" : "Deactivated"}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>Customer: <span className="text-gray-900 font-medium">{appointment.customerName}</span></p>
                              <p>Employee: <span className="text-gray-900 font-medium">{appointment.technicianName}</span></p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-purple-700">
                                  {appointmentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-orange-600">
                                  {timeRange}
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 rounded-2xl p-2 space-y-1">
                                  <DropdownMenuItem
                                    className="gap-2 rounded-xl px-3 py-2 text-[11px] font-medium"
                                    onSelect={(event) => {
                                      event.preventDefault();
                                      navigate(`/appointments/${appointment.id}/edit?fromView=${viewMode}`);
                                    }}
                                  >
                                    <Edit3 className="h-3.5 w-3.5 text-primary" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="gap-2 rounded-xl px-3 py-2 text-[11px] font-medium"
                                    onSelect={(event) => {
                                      event.preventDefault();
                                      setSelectedAppointmentForNote(appointment.id);
                                      setAddNoteModalOpen(true);
                                    }}
                                  >
                                    <FileText className="h-3.5 w-3.5 text-primary" />
                                    Add Note
                                  </DropdownMenuItem>
                                  {isActive ? (
                                    <>
                                      <DropdownMenuItem
                                        className="gap-2 rounded-xl px-3 py-2 text-[11px] font-medium"
                                        onSelect={(event) => {
                                          event.preventDefault();
                                          setSingleAppointmentToShare(appointment);
                                          setShareModalOpen(true);
                                        }}
                                      >
                                        <Share2 className="h-3.5 w-3.5 text-primary" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2 rounded-xl px-3 py-2 text-[11px] font-medium text-red-600 focus:text-red-600">
                                        <Ban className="h-3.5 w-3.5" />
                                        Deactivate
                                      </DropdownMenuItem>
                                    </>
                                  ) : (
                                    <DropdownMenuItem className="gap-2 rounded-xl px-3 py-2 text-[11px] font-medium text-primary">
                                      <BookmarkCheck className="h-3.5 w-3.5" />
                                      Activate
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ShareAppointmentModal
        open={shareModalOpen}
        selectedCount={singleAppointmentToShare ? 1 : selectedAppointments.length}
        appointmentName={singleAppointmentToShare?.service}
        onClose={() => {
          setShareModalOpen(false);
          setSingleAppointmentToShare(null);
        }}
        onShare={({ via, audience }) => {
          const appointmentsToShare = singleAppointmentToShare 
            ? [singleAppointmentToShare.id] 
            : selectedAppointments;
          
          console.info("Sharing appointments", {
            appointments: appointmentsToShare,
            via,
            audience,
          });
          
          setSingleAppointmentToShare(null);
        }}
      />

      <AppointmentDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onSave={(updatedAppointment) => {
          console.info("Saving appointment", updatedAppointment);
          // Handle save logic here
        }}
        onEdit={(appointmentId) => {
          navigate(`/appointments/${appointmentId}/edit?fromView=${viewMode}`);
        }}
        onCreateEstimate={() => {
          console.info("Create estimate for appointment", selectedAppointment?.id);
          navigate(`/estimates/new?appointmentId=${selectedAppointment?.id}`);
        }}
        onCreateInvoice={() => {
          console.info("Create invoice for appointment", selectedAppointment?.id);
          navigate(`/invoices/new?appointmentId=${selectedAppointment?.id}`);
        }}
        onViewCustomer={() => {
          console.info("View customer", selectedAppointment?.customerId);
          navigate(`/customers/${selectedAppointment?.customerId}`);
        }}
      />

      <AddNoteModal
        open={addNoteModalOpen}
        onClose={() => {
          setAddNoteModalOpen(false);
          setSelectedAppointmentForNote(null);
        }}
        appointmentId={selectedAppointmentForNote}
        existingNotes={selectedAppointmentForNote ? (appointmentNotes[selectedAppointmentForNote] || []) : []}
        onAddNote={(appointmentId, noteText) => {
          const now = new Date();
          const formattedDate = now.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          });
          const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          const newNote = {
            id: Date.now().toString(),
            text: noteText,
            createdBy: "Current User", // Replace with actual user from auth context
            createdAt: `${formattedDate} ${formattedTime}`,
          };
          
          setAppointmentNotes(prev => ({
            ...prev,
            [appointmentId]: [...(prev[appointmentId] || []), newNote],
          }));
          
          console.info("Note added to appointment", appointmentId, noteText);
        }}
      />
    </div>
  );
};

export default ManageAppointments;

function toISODate(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString();
  return localISOTime.split("T")[0];
}

function generateCalendarDays(monthDate: Date, todayISO: string) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    const iso = toISODate(date);

    return {
      date,
      iso,
      isCurrentMonth: date.getMonth() === month,
      isToday: iso === todayISO,
    };
  });
}

