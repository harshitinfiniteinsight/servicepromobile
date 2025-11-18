import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Globe, Timer, User } from "lucide-react";

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

interface ViewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
}

const weekDaysMap: { [key: string]: string } = {
  "S": "Sunday",
  "M": "Monday",
  "T": "Tuesday",
  "W": "Wednesday",
  "F": "Friday",
};

export function ViewScheduleModal({ open, onOpenChange, schedule }: ViewScheduleModalProps) {
  if (!schedule) return null;

  const getWeekDaysDisplay = (days: string[]) => {
    // Map single letters to full day names
    const dayMapping: { [key: string]: string } = {
      "S": "Sun",
      "M": "Mon",
      "T": "Tue",
      "W": "Wed",
      "F": "Fri",
    };
    
    return days.map(day => dayMapping[day] || day).join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Schedule Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Employee Info */}
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee Name</p>
                <p className="text-lg font-semibold">{schedule.employeeName}</p>
              </div>
            </div>
          </div>

          {/* Schedule Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule Date */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Schedule Date</p>
              </div>
              <p className="text-base font-semibold">
                {schedule.scheduledDate}
                {schedule.scheduledDateEnd && (
                  <>
                    <span className="text-muted-foreground mx-2">to</span>
                    {schedule.scheduledDateEnd}
                  </>
                )}
              </p>
            </div>

            {/* Timezone */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Timezone</p>
              </div>
              <p className="text-base font-semibold">{schedule.timezone}</p>
            </div>

            {/* Start Time */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Start Time</p>
              </div>
              <p className="text-base font-semibold">{schedule.startTime}</p>
            </div>

            {/* End Time */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">End Time</p>
              </div>
              <p className="text-base font-semibold">{schedule.endTime}</p>
            </div>

            {/* Time Interval */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Time Interval</p>
              </div>
              <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-sm">
                {schedule.timeInterval}
              </Badge>
            </div>

            {/* Week Days */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Working Days</p>
              </div>
              <p className="text-base font-semibold">{getWeekDaysDisplay(schedule.weekDays)}</p>
            </div>
          </div>

          {/* Week Days Visual Display */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Weekly Schedule</p>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
                const isSelected = schedule.weekDays.includes(day);
                return (
                  <div
                    key={`${day}-${index}`}
                    className={`h-12 w-12 rounded-full font-semibold flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[120px]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

