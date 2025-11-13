import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    customerName: string;
    technicianName: string;
    date: string;
    time: string;
    status: string;
    location: string;
  };
  onClick?: () => void;
}

const JobCard = ({ job, onClick }: JobCardProps) => {
  const techInitials = job.technicianName.split(" ").map(n => n[0]).join("");

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.customerName}</p>
        </div>
        <Badge className={cn("text-xs whitespace-nowrap", statusColors[job.status])}>
          {job.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(job.date).toLocaleDateString()}</span>
          <Clock className="h-3 w-3 ml-2" />
          <span>{job.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{job.location}</span>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-xs font-bold text-primary">{techInitials}</span>
          </div>
          <span className="text-sm text-muted-foreground">{job.technicianName}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;


