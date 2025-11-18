import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileCard from "@/components/mobile/MobileCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, DollarSign, Calendar, TrendingUp, Users, ClipboardList, Package, BarChart3, Settings } from "lucide-react";
import { mockAppointments, mockInvoices, mockEstimates, mockJobs } from "@/data/mobileMockData";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const showWalkthrough = localStorage.getItem("showWalkthrough");
    
    if (!isAuthenticated) {
      navigate("/signin");
    } else if (showWalkthrough === "true") {
      navigate("/walkthrough");
    }
  }, [navigate]);

  // Calculate real stats from mock data
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = mockAppointments.filter(apt => apt.date === today);
  const openInvoices = mockInvoices.filter(inv => inv.status === "Open");
  const sentEstimates = mockEstimates.filter(est => est.status === "Paid");
  const activeJobs = mockJobs.filter(job => job.status === "In Progress" || job.status === "Scheduled");

  const stats = [
    { label: "New Estimates", value: sentEstimates.length.toString(), icon: FileText, color: "text-primary", path: "/estimates" },
    { label: "Active Jobs", value: activeJobs.length.toString(), icon: Briefcase, color: "text-accent", path: "/jobs" },
    { label: "Awaiting Payment", value: openInvoices.length.toString(), amount: `$${openInvoices.reduce((sum, inv) => sum + inv.amount, 0)}`, icon: DollarSign, color: "text-warning", path: "/invoices" },
    { label: "Today's Appointments", value: todaysAppointments.length.toString(), icon: Calendar, color: "text-success", path: "/appointments/manage" },
  ];

  const operationalModules = [
    { label: "Customers", icon: Users, path: "/customers", color: "bg-primary/10 text-primary" },
    { label: "Jobs", icon: Briefcase, path: "/jobs", color: "bg-warning/10 text-warning" },
    { label: "Appointments", icon: Calendar, path: "/appointments/manage", color: "bg-info/10 text-info" },
    { label: "Employees", icon: Users, path: "/employees", color: "bg-blue-500/10 text-blue-500" },
    { label: "Inventory", icon: Package, path: "/inventory", color: "bg-orange-500/10 text-orange-500" },
    { label: "Reports", icon: BarChart3, path: "/reports", color: "bg-indigo-500/10 text-indigo-500" },
  ];

  const quickActions = [
    { label: "New Estimate", path: "/estimates/new", icon: FileText },
    { label: "New Invoice", path: "/invoices/new", icon: DollarSign },
    { label: "Add Appointment", path: "/appointments/add?from=dashboard", icon: Calendar },
    { label: "New Agreement", path: "/agreements/new", icon: ClipboardList },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Dashboard"
        actions={
          <Button size="sm" variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Stats Grid - Compact Single Row */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPrimary = index === 0;
            return (
              <MobileCard 
                key={index} 
                className={cn(
                  "p-2.5 cursor-pointer relative overflow-hidden",
                  isPrimary && "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
                )}
                onClick={() => navigate(stat.path)}
              >
                {isPrimary && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full -mr-6 -mt-6" />
                )}
                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className={cn(
                    "p-1.5 rounded-lg flex-shrink-0",
                    isPrimary ? "bg-primary text-white" : `bg-gray-100 ${stat.color}`
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col items-center gap-0.5 w-full">
                    <p className={cn(
                      "text-lg font-bold leading-tight",
                      isPrimary && "text-primary"
                    )}>
                      {stat.value}
                    </p>
                    {stat.amount && (
                      <p className={cn(
                        "text-[10px] font-medium leading-tight",
                        isPrimary ? "text-primary/70" : "text-muted-foreground"
                      )}>
                        {stat.amount}
                      </p>
                    )}
                    <p className={cn(
                      "text-[9px] font-medium text-center leading-tight line-clamp-2 mt-0.5",
                      isPrimary ? "text-primary/80" : "text-muted-foreground"
                    )}>
                      {stat.label}
                    </p>
                  </div>
                  {index === 0 && (
                    <TrendingUp className="h-3 w-3 text-primary absolute top-1 right-1" />
                  )}
                </div>
              </MobileCard>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <MobileCard className="cursor-pointer active:scale-98 transition-transform" onClick={() => navigate("/invoices")}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-muted-foreground">$320.33 • 2 days ago</p>
                </div>
              </div>
            </MobileCard>
            <MobileCard className="cursor-pointer active:scale-98 transition-transform" onClick={() => navigate("/estimates")}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Estimate Sent</p>
                  <p className="text-sm text-muted-foreground">Sharon Mcdonald • 3 days ago</p>
                </div>
              </div>
            </MobileCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-2 py-3 px-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all touch-target min-w-0"
                  onClick={() => navigate(action.path)}
                >
                  <Icon className="h-5 w-5 text-gray-700 flex-shrink-0" />
                  <span className="text-xs text-center leading-tight text-gray-700 break-words">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Operational Modules */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">Others</h3>
          <div className="grid grid-cols-3 gap-3">
            {operationalModules.map((module, index) => {
              const Icon = module.icon;
              const isPrimary = module.path === "/customers";
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-auto flex-col gap-2 py-4 px-2 border-gray-200 transition-all",
                    isPrimary ? "hover:border-primary/50 hover:bg-primary/5" : "hover:border-gray-300 hover:bg-gray-50"
                  )}
                  onClick={() => navigate(module.path)}
                >
                  <div className={`p-3 rounded-xl ${module.color} transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-center leading-tight font-medium text-gray-700">{module.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Today's Appointments */}
        {todaysAppointments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Today's Appointments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/appointments/manage")}
              >
                View All
              </Button>
            </div>
            {todaysAppointments.slice(0, 3).map((apt, index) => (
              <MobileCard key={index} className="mb-2 cursor-pointer active:scale-98 transition-transform" onClick={() => navigate("/appointments/manage")}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {apt.customerName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{apt.customerName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{apt.service}</Badge>
                      <span className="text-xs text-muted-foreground">{apt.time}</span>
                    </div>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
