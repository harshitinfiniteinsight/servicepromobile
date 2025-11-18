import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockCustomers, mockEmployees } from "@/data/mobileMockData";
import { Calendar, Clock, MapPin, User, Phone, Mail, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  const customer = mockCustomers.find(c => c.id === job.customerId);
  const technician = mockEmployees.find(e => e.id === job.technicianId);
  const techInitials = job.technicianName.split(" ").map(n => n[0]).join("");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Job Details"
        showBack={true}
        actions={
          <Button size="sm" variant="outline">
            <Navigation className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
              <Badge className={cn("text-sm", statusColors[job.status])}>
                {job.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `tel:${customer?.phone}`}>
            <Phone className="h-4 w-4" />
            Call Customer
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `tel:${technician?.phone}`}>
            <Phone className="h-4 w-4" />
            Call Tech
          </Button>
        </div>

        {/* Details */}
        <div className="px-4 space-y-4 pb-6">
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(job.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{job.time}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{job.customerName}</p>
              {customer && (
                <>
                  <p className="text-muted-foreground">{customer.email}</p>
                  <p className="text-muted-foreground">{customer.phone}</p>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </h3>
            <p className="text-sm">{job.location}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              <Navigation className="h-4 w-4 mr-2" />
              Open in Maps
            </Button>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Assigned Technician
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{techInitials}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{job.technicianName}</p>
                {technician && (
                  <>
                    <p className="text-sm text-muted-foreground">{technician.role}</p>
                    <p className="text-sm text-muted-foreground">{technician.phone}</p>
                  </>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Actions */}
          {job.status === "Scheduled" && (
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                Start Job
              </Button>
              <Button variant="outline" className="w-full">
                Reschedule
              </Button>
            </div>
          )}

          {job.status === "In Progress" && (
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                Complete Job
              </Button>
              <Button variant="outline" className="w-full">
                Add Notes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

