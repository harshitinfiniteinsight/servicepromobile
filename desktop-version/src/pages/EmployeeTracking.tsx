import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Users } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { Input } from "@/components/ui/input";

const EmployeeTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [dateRange, setDateRange] = useState("");

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="app-card p-4 sm:p-6 bg-gradient-to-br from-success/5 via-primary/5 to-transparent relative overflow-hidden">
          <div className="gradient-mesh absolute inset-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
                  <span className="text-gradient">Employee Tracking</span>
                </h1>
                <p className="text-sm text-muted-foreground">Track employee locations and activities in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="app-card p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Employee Selection */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Select Employee
              </Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Select Date Range
              </Label>
              <Input
                type="date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
            </div>

            {/* View Map Button */}
            <div className="flex items-end">
              <Button className="w-full gradient-primary gap-2">
                <MapPin className="h-4 w-4" />
                View Map
              </Button>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="app-card overflow-hidden">
          <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 aspect-video flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center p-8">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Map Integration Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Real-time employee location tracking will be displayed here. Connect your mapping service to enable this feature.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Active Employees</p>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-2xl font-bold text-success">8</p>
                  <p className="text-xs text-muted-foreground">On-Site Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Activity List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEmployees.slice(0, 6).map((employee) => (
            <Card key={employee.id} className="p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {employee.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{employee.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-xs text-success font-medium">Active</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Last seen: 5 mins ago</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EmployeeTracking;
