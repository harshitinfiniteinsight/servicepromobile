import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Badge } from "@/components/ui/badge";
import { mockEmployees, mockJobs } from "@/data/mobileMockData";
import { MapPin, Clock, User, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const EmployeeTracking = () => {
  // Mock location data
  const employeeLocations = mockEmployees
    .filter(e => e.status === "Active" && e.role.includes("Technician"))
    .map(emp => {
      const activeJob = mockJobs.find(j => j.technicianId === emp.id && j.status === "In Progress");
      return {
        ...emp,
        currentLocation: activeJob ? activeJob.location : "Office",
        currentJob: activeJob,
        eta: activeJob ? "15 min" : "Available",
      };
    });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Employee Tracking" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Map Placeholder */}
        <div className="h-48 bg-muted/30 border-b flex items-center justify-center">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Map View</p>
            <p className="text-xs text-muted-foreground">(Map integration placeholder)</p>
          </div>
        </div>

        {/* Employee List */}
        <div className="px-4 py-4 space-y-3">
          <h3 className="font-semibold text-lg mb-2">Active Employees</h3>
          
          {employeeLocations.map(employee => {
            const initials = employee.name.split(" ").map(n => n[0]).join("");
            const isOnJob = !!employee.currentJob;
            
            return (
              <div
                key={employee.id}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                    isOnJob ? "bg-primary/20" : "bg-success/20"
                  )}>
                    <span className={cn(
                      "text-lg font-bold",
                      isOnJob ? "text-primary" : "text-success"
                    )}>
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold">{employee.name}</h4>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        isOnJob ? statusColors["In Progress"] : statusColors["Completed"]
                      )}>
                        {isOnJob ? "On Job" : "Available"}
                      </Badge>
                    </div>
                    
                    {employee.currentJob && (
                      <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3 text-primary" />
                          <span className="text-sm font-medium">{employee.currentJob.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{employee.currentJob.location}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{employee.currentLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>ETA: {employee.eta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTracking;
