import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Clock, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: any;
  mode: "create" | "edit";
}

const WEEK_DAYS = [
  { label: "S", value: "Sunday", fullLabel: "Sunday" },
  { label: "M", value: "Monday", fullLabel: "Monday" },
  { label: "T", value: "Tuesday", fullLabel: "Tuesday" },
  { label: "W", value: "Wednesday", fullLabel: "Wednesday" },
  { label: "T", value: "Thursday", fullLabel: "Thursday" },
  { label: "F", value: "Friday", fullLabel: "Friday" },
  { label: "S", value: "Saturday", fullLabel: "Saturday" },
];

const TIMEZONES = [
  "America/Los_Angeles",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export const EmployeeFormModal = ({ open, onOpenChange, employee, mode }: EmployeeFormModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [role, setRole] = useState("Employee");
  const [allowLoginOutsideHours, setAllowLoginOutsideHours] = useState(false);
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayTimes, setDayTimes] = useState<Record<string, { start: string; end: string }>>({});

  useEffect(() => {
    if (employee && open) {
      // Split name into first and last name
      const nameParts = (employee.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(employee.email || "");
      setPhoneNumber(employee.phone || "");
      setBirthdate(employee.birthdate || "");
      setRole(employee.role || "Employee");
      setAllowLoginOutsideHours(employee.allowLoginOutsideHours || false);
      setTimezone(employee.timezone || "America/Los_Angeles");
      setSelectedDays(employee.workingDays || []);
      setDayTimes(employee.dayTimes || {});
    } else if (!employee && open) {
      // Reset form for new employee
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setBirthdate("");
      setRole("Employee");
      setAllowLoginOutsideHours(false);
      setTimezone("America/Los_Angeles");
      setSelectedDays([]);
      setDayTimes({});
    }
  }, [employee, open]);

  const toggleDay = (dayValue: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayValue)) {
        const newDays = prev.filter((d) => d !== dayValue);
        const newDayTimes = { ...dayTimes };
        delete newDayTimes[dayValue];
        setDayTimes(newDayTimes);
        return newDays;
      } else {
        return [...prev, dayValue];
      }
    });
  };

  const toggleAllDays = () => {
    if (selectedDays.length === WEEK_DAYS.length) {
      // Deselect all
      setSelectedDays([]);
      setDayTimes({});
    } else {
      // Select all
      const allDayValues = WEEK_DAYS.map((day) => day.value);
      setSelectedDays(allDayValues);
    }
  };

  const allDaysSelected = selectedDays.length === WEEK_DAYS.length;

  const updateDayTime = (dayValue: string, field: "start" | "end", value: string) => {
    setDayTimes((prev) => ({
      ...prev,
      [dayValue]: {
        ...prev[dayValue],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      role,
      allowLoginOutsideHours,
      timezone,
      selectedDays,
      dayTimes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header with orange gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-white">
                {mode === "create" ? "Add New Employee" : "Edit Employee"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/90 text-sm ml-11">
            {mode === "create" ? "Add a new team member to your organization." : "Update employee information."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Employee Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Harry"
                  required
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Potter"
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="harry@yopmail.com"
                  required
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="11247528655"
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate : MM/DD/YYYY</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Working Hours Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-2">Working Hours</h3>
              <p className="text-sm text-muted-foreground">
                Set up the time slots during which the employee may log into the system. Share the scheduled times with the employee. 
                If you do not set up employee specific times the employee will be able to log in at any time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowLoginOutsideHours"
                  checked={allowLoginOutsideHours}
                  onCheckedChange={(checked) => setAllowLoginOutsideHours(checked as boolean)}
                />
                <Label htmlFor="allowLoginOutsideHours" className="text-sm font-medium cursor-pointer">
                  Allow employee to login outside working hours
                </Label>
              </div>

              {/* Timezone and Days in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Select Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Choose timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Days</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="selectAllDays"
                        checked={allDaysSelected}
                        onCheckedChange={toggleAllDays}
                      />
                      <Label htmlFor="selectAllDays" className="text-sm font-medium cursor-pointer">
                        Select All
                      </Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {WEEK_DAYS.map((day) => {
                      const isSelected = selectedDays.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={cn(
                            "h-10 w-10 rounded-full border-2 font-semibold text-sm transition-all flex-shrink-0",
                            isSelected
                              ? "bg-orange-500 text-white border-orange-500 shadow-md"
                              : "bg-background text-muted-foreground border-border hover:border-orange-300 hover:text-orange-600"
                          )}
                          title={day.fullLabel}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time inputs for selected days */}
              {selectedDays.length > 0 && (
                <div className="space-y-3 pt-2">
                  <Label>Working Hours for Selected Days</Label>
                  <div className="space-y-3">
                    {selectedDays.map((dayValue) => {
                      const day = WEEK_DAYS.find((d) => d.value === dayValue);
                      const times = dayTimes[dayValue] || { start: "", end: "" };
                      return (
                        <div key={dayValue} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-foreground">{day?.fullLabel}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Start Time</Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  value={times.start}
                                  onChange={(e) => updateDayTime(dayValue, "start", e.target.value)}
                                  className="pl-10 h-10"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">End Time</Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  value={times.end}
                                  onChange={(e) => updateDayTime(dayValue, "end", e.target.value)}
                                  className="pl-10 h-10"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              {mode === "create" ? "Add Employee" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
