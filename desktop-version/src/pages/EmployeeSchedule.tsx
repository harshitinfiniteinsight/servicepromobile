import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Clock, Calendar, SquarePen, Trash2, MoreVertical, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mockEmployees } from "@/data/mockData";
import { toast } from "sonner";
import { UpdateScheduleModal } from "@/components/modals/UpdateScheduleModal";
import { ViewScheduleModal } from "@/components/modals/ViewScheduleModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Schedule {
  id: string;
  employeeName: string;
  scheduledDate: string;
  scheduledDateEnd?: string;
  timezone: string;
  startTime: string;
  endTime: string;
  timeInterval: string;
  weekDays: string[];
}

const mockSchedules: Schedule[] = [
  {
    id: "1",
    employeeName: "Harry Potter",
    scheduledDate: "2025-10-23",
    scheduledDateEnd: "2025-10-31",
    timezone: "Asia/Kolkata",
    startTime: "10:00",
    endTime: "19:30",
    timeInterval: "15 min",
    weekDays: ["M", "T", "W", "T", "F"]
  },
  {
    id: "2",
    employeeName: "bruce wayne",
    scheduledDate: "2025-10-24",
    scheduledDateEnd: "2025-10-31",
    timezone: "Asia/Kolkata",
    startTime: "10:00",
    endTime: "18:00",
    timeInterval: "20 min",
    weekDays: ["M", "W", "F"]
  },
  {
    id: "3",
    employeeName: "v developer",
    scheduledDate: "2025-09-16",
    scheduledDateEnd: "2025-09-30",
    timezone: "Asia/Kolkata",
    startTime: "01:00",
    endTime: "23:00",
    timeInterval: "30 min",
    weekDays: ["S", "S"]
  }
];

const EmployeeSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [allDaysSelected, setAllDaysSelected] = useState(false);
  const [timeSlot, setTimeSlot] = useState("5");
  const [timezone, setTimezone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const handleViewSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setViewModalOpen(true);
  };

  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
    );
    setEditModalOpen(false);
    setSelectedSchedule(null);
    toast.success("Schedule updated successfully!");
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSchedule) {
      setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));
      toast.success("Schedule deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedSchedule(null);
    }
  };

  const handleAddSchedule = () => {
    if (!selectedEmployee || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Schedule added successfully");
    setModalOpen(false);
  };

  const toggleAllDays = () => {
    if (allDaysSelected) {
      setWeekDays([]);
      setAllDaysSelected(false);
    } else {
      setWeekDays(["S", "M", "T", "W", "T", "F", "S"]);
      setAllDaysSelected(true);
    }
  };

  const toggleWeekDay = (day: string) => {
    const newDays = weekDays.includes(day) ? weekDays.filter(d => d !== day) : [...weekDays, day];
    setWeekDays(newDays);
    setAllDaysSelected(newDays.length === 7);
  };

  const weekDaysLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search schedules..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="app-card p-4 sm:p-6 bg-gradient-to-br from-info/5 via-primary/5 to-transparent relative overflow-hidden">
          <div className="gradient-mesh absolute inset-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
                  <span className="text-gradient">Employee Schedule</span>
                </h1>
                <p className="text-sm text-muted-foreground">Manage employee work schedules and availability</p>
              </div>
              <Button onClick={() => setModalOpen(true)} className="gradient-primary gap-2">
                <Plus className="h-4 w-4" />
                Add Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="app-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-muted/50 to-muted/30">
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Time Interval</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <span className="font-medium text-primary underline cursor-pointer hover:text-primary/80">
                        {schedule.employeeName}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {schedule.scheduledDateEnd 
                        ? `${schedule.scheduledDate} - ${schedule.scheduledDateEnd}`
                        : schedule.scheduledDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{schedule.timezone}</TableCell>
                    <TableCell className="text-muted-foreground">{schedule.startTime}</TableCell>
                    <TableCell className="text-muted-foreground">{schedule.endTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                        {schedule.timeInterval}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 touch-target">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <SquarePen className="h-4 w-4" />
                            Edit schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleViewSchedule(schedule)}
                          >
                            <Eye className="h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(schedule)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete schedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSchedules.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">No schedules found</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first schedule to get started</p>
            </div>
          )}
        </div>

        {/* Add Schedule Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Add New Schedule</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Employee Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Date */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Schedule Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Week Days */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Weeks Days</Label>
                  <div className="flex gap-2 mb-3">
                    {weekDaysLabels.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeekDay(day)}
                        className={`h-12 w-12 rounded-full font-semibold transition-all ${
                          weekDays.includes(day)
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {/* All Days Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allDaysAdd"
                      checked={allDaysSelected}
                      onChange={toggleAllDays}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="allDaysAdd" className="text-sm cursor-pointer">
                      All Days
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time Slot */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="20">20 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                      placeholder="Start Time"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10"
                      placeholder="End Time"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddSchedule}
                className="w-full gradient-primary text-lg py-6"
              >
                CONTINUE
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Schedule Modal */}
        <UpdateScheduleModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          schedule={selectedSchedule}
          onUpdate={handleUpdateSchedule}
        />

        {/* View Schedule Modal */}
        <ViewScheduleModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          schedule={selectedSchedule}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this schedule? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default EmployeeSchedule;
