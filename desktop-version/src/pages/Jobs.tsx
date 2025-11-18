import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  SlidersHorizontal, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  FileText,
  DollarSign,
  User,
  TrendingUp
} from "lucide-react";
import { mockAgreements, mockEstimates, mockInvoices, mockEmployees, mockCustomers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PreviewAgreementModal } from "@/components/modals/PreviewAgreementModal";
import { PreviewEstimateModal } from "@/components/modals/PreviewEstimateModal";
import { PreviewInvoiceModal } from "@/components/modals/PreviewInvoiceModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { AgreementPaymentModal } from "@/components/modals/AgreementPaymentModal";

type ViewMode = "list" | "calendar";
type TimeFilter = "day" | "week" | "month";
type JobType = "agreement" | "estimate" | "invoice";

interface JobItem {
  id: string;
  orderId: string;
  type: JobType;
  date: string;
  employeeName: string;
  customerName: string;
  amount: number;
}

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterUnpaid, setFilterUnpaid] = useState(false);
  const [previewAgreementModalOpen, setPreviewAgreementModalOpen] = useState(false);
  const [previewEstimateModalOpen, setPreviewEstimateModalOpen] = useState(false);
  const [previewInvoiceModalOpen, setPreviewInvoiceModalOpen] = useState(false);
  const [selectedAgreementForPreview, setSelectedAgreementForPreview] = useState<any>(null);
  const [selectedEstimateForPreview, setSelectedEstimateForPreview] = useState<any>(null);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedItemForPayment, setSelectedItemForPayment] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<"invoice" | "agreement" | null>(null);

  // Apply filters from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.dateFrom) {
        setDateFrom(location.state.dateFrom);
      }
      if (location.state.dateTo) {
        setDateTo(location.state.dateTo);
      }
      if (location.state.timeFilter) {
        setTimeFilter(location.state.timeFilter);
      }
      if (location.state.filterUnpaid) {
        setFilterUnpaid(location.state.filterUnpaid);
      }
      // Clear the state to prevent re-applying on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Transform data into unified format
  const allJobs: JobItem[] = [
    ...mockAgreements.map((agreement) => ({
      id: agreement.id,
      orderId: agreement.id.replace("AGR-", "G"),
      type: "agreement" as JobType,
      date: agreement.startDate,
      employeeName: "N/A",
      customerName: agreement.customerName,
      amount: agreement.amount,
    })),
    ...mockEstimates.map((estimate) => ({
      id: estimate.id,
      orderId: estimate.id.replace("EST-", ""),
      type: "estimate" as JobType,
      date: estimate.createdDate,
      employeeName: estimate.employeeName,
      customerName: estimate.customerName,
      amount: estimate.amount,
    })),
    ...mockInvoices.map((invoice) => ({
      id: invoice.id,
      orderId: invoice.orderId,
      type: "invoice" as JobType,
      date: invoice.issueDate,
      employeeName: invoice.employeeName,
      customerName: invoice.customerName,
      amount: invoice.amount,
    })),
  ];

  // Filter and sort jobs
  const filteredJobs = allJobs
    .filter((job) => {
      const matchesSearch =
        job.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter unpaid jobs if filterUnpaid is true
      if (filterUnpaid) {
        const jobInvoice = mockInvoices.find(inv => inv.id === job.id);
        const jobEstimate = mockEstimates.find(est => est.id === job.id);
        const jobAgreement = mockAgreements.find(agr => agr.id === job.id);
        
        // Check if job is unpaid
        const isUnpaid = 
          (jobInvoice && jobInvoice.status !== "Paid") ||
          (jobEstimate && jobEstimate.status === "Open") ||
          (jobAgreement && jobAgreement.status !== "Paid");
        
        if (!isUnpaid) return false;
      }
      
      const matchesEmployee = selectedEmployee === "all" || job.employeeName === selectedEmployee;
      const matchesJobType = selectedJobType === "all" || job.type === selectedJobType;
      const matchesCustomer = selectedCustomer === "all" || job.customerName === selectedCustomer;
      
      const jobDate = new Date(job.date);
      const matchesDateFrom = !dateFrom || jobDate >= dateFrom;
      const matchesDateTo = !dateTo || jobDate <= dateTo;
      
      return matchesSearch && matchesEmployee && matchesJobType && matchesCustomer && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group jobs by date
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const date = new Date(job.date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(job);
    return acc;
  }, {} as Record<string, JobItem[]>);

  const getJobConfig = (type: JobType) => {
    switch (type) {
      case "agreement":
        return {
          gradient: "from-info/10 to-info/5",
          border: "border-info/20",
          badge: "bg-info/10 text-info border-info/20",
          icon: Briefcase,
          iconBg: "bg-info/10",
          iconColor: "text-info",
          label: "Agreement",
          amountColor: "text-info"
        };
      case "invoice":
        return {
          gradient: "from-warning/10 to-warning/5",
          border: "border-warning/20",
          badge: "bg-warning/10 text-warning border-warning/20",
          icon: DollarSign,
          iconBg: "bg-warning/10",
          iconColor: "text-warning",
          label: "Invoice",
          amountColor: "text-warning"
        };
      case "estimate":
        return {
          gradient: "from-success/10 to-success/5",
          border: "border-success/20",
          badge: "bg-success/10 text-success border-success/20",
          icon: FileText,
          iconBg: "bg-success/10",
          iconColor: "text-success",
          label: "Estimate",
          amountColor: "text-success"
        };
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfMonth = monthStart.getDay();
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(daysInMonth);
  
  const getJobsForDate = (date: Date) => {
    return filteredJobs.filter((job) => isSameDay(new Date(job.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Handle preview based on job type
  const handlePreview = (job: JobItem) => {
    if (job.type === "agreement") {
      const agreement = mockAgreements.find(agr => agr.id === job.id);
      if (agreement) {
        setSelectedAgreementForPreview(agreement);
        setPreviewAgreementModalOpen(true);
      }
    } else if (job.type === "estimate") {
      const estimate = mockEstimates.find(est => est.id === job.id);
      if (estimate) {
        setSelectedEstimateForPreview(estimate);
        setPreviewEstimateModalOpen(true);
      }
    } else if (job.type === "invoice") {
      const invoice = mockInvoices.find(inv => inv.id === job.id);
      if (invoice) {
        setSelectedInvoiceForPreview(invoice);
        setPreviewInvoiceModalOpen(true);
      }
    }
  };

  // Calculate stats
  const totalJobs = filteredJobs.length;
  const totalRevenue = filteredJobs.reduce((sum, job) => sum + job.amount, 0);
  const jobsByType = {
    agreement: filteredJobs.filter(j => j.type === "agreement").length,
    invoice: filteredJobs.filter(j => j.type === "invoice").length,
    estimate: filteredJobs.filter(j => j.type === "estimate").length,
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search jobs..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="app-card p-4 sm:p-6 bg-gradient-to-br from-accent/5 via-primary/5 to-transparent relative overflow-hidden">
          <div className="gradient-mesh absolute inset-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
                  <span className="text-gradient">Job Board</span>
                </h1>
                <p className="text-sm text-muted-foreground">Manage all agreements, estimates, and invoices</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  size="sm"
                  className={cn(
                    "touch-target",
                    viewMode === "list" && "gradient-primary"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  onClick={() => setViewMode("calendar")}
                  size="sm"
                  className={cn(
                    "touch-target",
                    viewMode === "calendar" && "gradient-primary"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success animate-float" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Jobs</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{totalJobs}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-success/10 to-success/5 shadow-sm">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">${totalRevenue.toLocaleString()}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-info/10 to-info/5 shadow-sm">
                <FileText className="h-4 w-4 text-info" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Agreements</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{jobsByType.agreement}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 shadow-sm">
                <FileText className="h-4 w-4 text-warning" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoices</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{jobsByType.invoice}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="app-card p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start touch-target">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">{dateFrom ? format(dateFrom, "PPP") : "Select date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start touch-target">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">{dateTo ? format(dateTo, "PPP") : "Select date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Job Type</Label>
              <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                <SelectTrigger className="touch-target">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="estimate">Estimates</SelectItem>
                  <SelectItem value="agreement">Agreements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="touch-target">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="touch-target">
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
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant={timeFilter === "day" ? "default" : "outline"}
              onClick={() => setTimeFilter("day")}
              size="sm"
              className={`touch-target ${timeFilter === "day" ? "gradient-primary" : ""}`}
            >
              Day
            </Button>
            <Button
              variant={timeFilter === "week" ? "default" : "outline"}
              onClick={() => setTimeFilter("week")}
              size="sm"
              className={`touch-target ${timeFilter === "week" ? "gradient-primary" : ""}`}
            >
              Week
            </Button>
            <Button
              variant={timeFilter === "month" ? "default" : "outline"}
              onClick={() => setTimeFilter("month")}
              size="sm"
              className={`touch-target ${timeFilter === "month" ? "gradient-primary" : ""}`}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        {viewMode === "list" && (
          <div className="space-y-6">
            {Object.entries(groupedJobs).map(([date, jobs]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{date}</span>
                </div>

                {/* Jobs for this date */}
                <div className="grid gap-3">
                  {jobs.map((job) => {
                    const config = getJobConfig(job.type);
                    const JobIcon = config.icon;
                    
                    return (
                      <div
                        key={job.id}
                        className="app-card p-4 sm:p-6 hover:scale-[1.01] transition-all duration-300 cursor-pointer border"
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {/* Left side - Icon and Type */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className={cn("p-3 rounded-xl shadow-sm", config.iconBg)}>
                              <JobIcon className={cn("h-5 w-5", config.iconColor)} />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn("border", config.badge)}>
                                  {config.label}
                                </Badge>
                                <span className="font-mono font-bold text-lg">{job.orderId}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 hover:bg-transparent"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlePreview(job);
                                  }}
                                >
                                  <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">Employee</p>
                                    <p className="font-medium truncate">{job.employeeName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">Customer</p>
                                    <p className="font-medium truncate underline cursor-pointer hover:text-primary">
                                      {job.customerName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right side - Amount */}
                          <div className="flex flex-col items-end justify-center gap-1 min-w-fit">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                            <p className={cn("text-3xl sm:text-4xl font-bold font-display", config.amountColor)}>
                              ${job.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(groupedJobs).length === 0 && (
              <div className="app-card p-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No jobs found matching your filters</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or date range</p>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="app-card p-4 sm:p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient">
                {format(currentMonth, "MMMM, yyyy")}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-bold text-sm text-muted-foreground py-3">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayJobs = getJobsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square border-2 rounded-xl p-2 relative transition-all hover:scale-105 cursor-pointer",
                      isCurrentMonth ? "bg-card border-border hover:border-primary/30" : "bg-muted/20 border-transparent",
                      isToday && "bg-gradient-to-br from-primary to-accent text-white font-bold border-primary shadow-lg"
                    )}
                  >
                    <div className={cn("text-sm sm:text-base text-center mb-1 font-semibold", isToday && "text-white")}>
                      {format(day, "d")}
                    </div>
                    {dayJobs.length > 0 && (
                      <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center flex-wrap">
                        {dayJobs.slice(0, 3).map((job) => {
                          const config = getJobConfig(job.type);
                          return (
                            <div
                              key={job.id}
                              className={cn("w-2 h-2 rounded-full", config.iconColor.replace('text-', 'bg-'))}
                            />
                          );
                        })}
                        {dayJobs.length > 3 && (
                          <span className="text-[10px] font-bold">+{dayJobs.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modals */}
      <PreviewAgreementModal
        open={previewAgreementModalOpen}
        onOpenChange={(open) => {
          setPreviewAgreementModalOpen(open);
          if (!open) setSelectedAgreementForPreview(null);
        }}
        agreement={selectedAgreementForPreview}
        onPayNow={(agreement) => {
          setSelectedItemForPayment(agreement);
          setPaymentType("agreement");
          setPaymentModalOpen(true);
        }}
        onUpdate={(agreement) => {
          navigate(`/agreements/${agreement.id}/edit`);
        }}
      />

      <PreviewEstimateModal
        open={previewEstimateModalOpen}
        onOpenChange={(open) => {
          setPreviewEstimateModalOpen(open);
          if (!open) setSelectedEstimateForPreview(null);
        }}
        estimate={selectedEstimateForPreview}
        onEdit={(estimate) => {
          navigate(`/estimates/${estimate.id}/edit`);
        }}
        onPayNow={(estimate) => {
          setSelectedItemForPayment(estimate);
          setPaymentType("invoice");
          setPaymentModalOpen(true);
        }}
      />

      <PreviewInvoiceModal
        open={previewInvoiceModalOpen}
        onOpenChange={(open) => {
          setPreviewInvoiceModalOpen(open);
          if (!open) setSelectedInvoiceForPreview(null);
        }}
        invoice={selectedInvoiceForPreview}
        onEdit={(invoice) => {
          navigate(`/invoices/${invoice.id}/edit`);
        }}
        onPayNow={(invoice) => {
          setSelectedItemForPayment(invoice);
          setPaymentType("invoice");
          setPaymentModalOpen(true);
        }}
      />

      {/* Payment Modals */}
      {paymentType === "invoice" && (
        <InvoicePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoice={selectedItemForPayment}
        />
      )}
      {paymentType === "agreement" && (
        <AgreementPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          agreement={selectedItemForPayment}
        />
      )}
    </div>
  );
};

export default Jobs;
