import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockEmployees, mockJobs } from "@/data/mobileMockData";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const EmployeeSchedule = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const employee = mockEmployees.find(e => e.id === selectedEmployee);
  const employeeJobs = mockJobs.filter(j => j.technicianId === selectedEmployee);
  
  // Get current week dates
  const today = new Date();
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date.toISOString().split('T')[0];
  });

  const dayJobs = employeeJobs.filter(j => j.date === selectedDate);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Employee Schedule" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Employee Selector */}
        <div className="px-4 py-4 border-b bg-muted/30">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {mockEmployees.filter(e => e.status === "Active").map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name} - {emp.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week Calendar */}
        <div className="px-4 py-4 border-b bg-muted/30">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {currentWeek.map((date) => {
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dateObj.getDate();
              const hasJobs = employeeJobs.some(j => j.date === date);
              const isSelected = date === selectedDate;
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] p-3 rounded-xl border transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent/5",
                    hasJobs && !isSelected && "border-primary/30"
                  )}
                >
                  <span className="text-xs font-medium">{dayName}</span>
                  <span className={cn(
                    "text-lg font-bold mt-1",
                    isSelected ? "text-primary-foreground" : ""
                  )}>
                    {dayNum}
                  </span>
                  {hasJobs && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1",
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Jobs */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <Badge variant="outline">{dayJobs.length} jobs</Badge>
          </div>

          {dayJobs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No jobs scheduled</p>
            </div>
          ) : (
            dayJobs.map(job => (
              <div
                key={job.id}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{job.time}</span>
                      <Badge className={cn("text-xs", statusColors[job.status])}>
                        {job.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg mb-1">{job.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-3 w-3" />
                      <span>{job.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSchedule;
