import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Mail, MessageSquare, DollarSign, Banknote, MapPin, UserCog, FileText, XCircle, MoreVertical, RotateCcw, Edit, History, CalendarRange, RefreshCw } from "lucide-react";
import { mockEstimates, mockEmployees } from "@/data/mockData";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { ShareAddressModal } from "@/components/modals/ShareAddressModal";
import { PayCashModal } from "@/components/modals/PayCashModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { PreviewEstimateModal } from "@/components/modals/PreviewEstimateModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Estimates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Apply date range from navigation state
  useEffect(() => {
    if (location.state?.dateRange) {
      setDateRange(location.state.dateRange);
      // Clear the state to prevent re-applying on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [shareAddressModalOpen, setShareAddressModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [payCashModalOpen, setPayCashModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedEstimateForPayment, setSelectedEstimateForPayment] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedEstimateForPreview, setSelectedEstimateForPreview] = useState<any>(null);
  const { toast } = useToast();

  const filteredEstimates = mockEstimates.filter((estimate) => {
    const matchesActive = activeTab === "active" 
      ? estimate.isActive 
      : !estimate.isActive;
    
    const matchesSearch = 
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Don't apply status filter for deactivated tab
    const matchesStatus = activeTab === "deactivated" 
      ? true
      : (statusFilter === "all" || 
         (statusFilter === "paid" && estimate.status === "Paid") ||
         (statusFilter === "open" && estimate.status === "Open"));
    
    const estimateDate = new Date(estimate.createdDate);
    const matchesDateRange = 
      (!dateRange.from || estimateDate >= dateRange.from) &&
      (!dateRange.to || estimateDate <= dateRange.to);
    
    return matchesActive && matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSendEmail = (estimate: any) => {
    setSelectedEstimate(estimate);
    setEmailModalOpen(true);
  };

  const handleSendSMS = (estimate: any) => {
    setSelectedEstimate(estimate);
    setSmsModalOpen(true);
  };

  const handleReassign = (estimate: any) => {
    setSelectedEstimate(estimate);
    setReassignModalOpen(true);
  };

  const handleReassignSubmit = () => {
    toast({
      title: "Employee Reassigned",
      description: `Estimate ${selectedEstimate?.id} has been reassigned.`,
    });
    setReassignModalOpen(false);
    setSelectedEmployee("");
  };

  const handlePayEstimate = (estimate: any) => {
    setSelectedEstimateForPayment(estimate);
    setPaymentModalOpen(true);
  };

  const handlePayCash = (estimate: any) => {
    setSelectedEstimate(estimate);
    setPayCashModalOpen(true);
  };

  const handleShareAddress = (estimate: any) => {
    setSelectedEstimate(estimate);
    setShareAddressModalOpen(true);
  };

  const handlePreview = (estimate: any) => {
    setSelectedEstimateForPreview(estimate);
    setPreviewModalOpen(true);
  };

  const handleEditEstimate = (estimate: any) => {
    navigate(`/estimates/${estimate.id}/edit`);
  };

  const handleDeactivate = (estimate: any) => {
    if (estimate.status !== "Open") {
      toast({
        title: "Cannot Deactivate",
        description: "Only open estimates can be deactivated.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Estimate Deactivated",
      description: `${estimate.id} has been deactivated.`,
    });
  };

  const handleActivate = (estimate: any) => {
    toast({
      title: "Estimate Activated",
      description: `${estimate.id} has been reactivated.`,
    });
  };

  const handleRefund = (estimate: any) => {
    toast({
      title: "Refund Processing",
      description: `Processing refund for ${estimate.id}`,
    });
  };

  const handleDocHistory = (estimate: any) => {
    // Navigate to customer details page
    navigate(`/customers/${estimate.customerId || '1'}`);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search estimates..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Estimates</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage service estimates and proposals</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {activeTab !== "deactivated" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] touch-target">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 touch-target w-full sm:w-auto">
                  <CalendarRange className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      "Date Range"
                    )}
                  </span>
                  <span className="sm:hidden">
                    {dateRange.from ? format(dateRange.from, "MMM dd") : "Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">From Date</p>
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      className="pointer-events-auto"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">To Date</p>
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      className="pointer-events-auto"
                    />
                  </div>
                  {(dateRange.from || dateRange.to) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full touch-target"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={() => navigate("/estimates/new")} className="gap-2 touch-target w-full sm:w-auto">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              New Estimate
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEstimates.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {mockEstimates.filter((estimate) => estimate.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {mockEstimates.filter((estimate) => estimate.status === "Open").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {filteredEstimates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active estimates found</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEstimates.map((estimate) => (
                  <Card key={estimate.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Created Date</p>
                          <p className="font-medium">{estimate.createdDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Job ID</p>
                          <p className="font-medium">{estimate.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Name</p>
                          <p className="font-medium">{estimate.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Employee Name</p>
                          <p className="font-medium">{estimate.employeeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-medium text-lg">${estimate.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sync</p>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={getStatusColor(estimate.status)} variant="outline">
                            {estimate.status.toUpperCase()}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 z-50 bg-popover">
                              <DropdownMenuItem onClick={() => handlePreview(estimate)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Estimate
                              </DropdownMenuItem>
                              
                              {estimate.status === "Open" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleSendEmail(estimate)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendSMS(estimate)}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Send SMS
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditEstimate(estimate)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Estimate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handlePayEstimate(estimate)}>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Pay Estimate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handlePayCash(estimate)}>
                                    <Banknote className="mr-2 h-4 w-4" />
                                    Pay Cash
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareAddress(estimate)}>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Share Job Address
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReassign(estimate)}>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Reassign Employee
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDocHistory(estimate)}>
                                    <History className="mr-2 h-4 w-4" />
                                    Doc History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeactivate(estimate)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {estimate.status === "Paid" && (
                                <DropdownMenuItem onClick={() => handleRefund(estimate)}>
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Refund
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deactivated" className="space-y-4">
            {filteredEstimates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No deactivated estimates found</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEstimates.map((estimate) => (
                  <Card key={estimate.id} className="shadow-sm hover:shadow-md transition-shadow opacity-75">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Created Date</p>
                          <p className="font-medium">{estimate.createdDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Job ID</p>
                          <p className="font-medium">{estimate.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Name</p>
                          <p className="font-medium">{estimate.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Employee Name</p>
                          <p className="font-medium">{estimate.employeeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-medium text-lg">${estimate.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sync</p>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivate(estimate)}
                          >
                            Activate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SendEmailModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        customerEmail={selectedEstimate?.customerEmail || ""}
      />

      <SendSMSModal
        open={smsModalOpen}
        onOpenChange={setSmsModalOpen}
        customerName={selectedEstimate?.customerName || ""}
        phoneNumber={selectedEstimate?.customerPhone || ""}
      />

      <ShareAddressModal
        open={shareAddressModalOpen}
        onOpenChange={setShareAddressModalOpen}
        jobAddress={selectedEstimate?.address || "123 Main Street, City, State"}
        jobId={selectedEstimate?.id || ""}
      />

      <PayCashModal
        open={payCashModalOpen}
        onOpenChange={setPayCashModalOpen}
        orderAmount={selectedEstimate?.amount || 0}
        orderId={selectedEstimate?.id || ""}
      />


      <InvoicePaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        invoice={selectedEstimateForPayment}
      />

      <PreviewEstimateModal
        open={previewModalOpen}
        onOpenChange={(open) => {
          setPreviewModalOpen(open);
          if (!open) setSelectedEstimateForPreview(null);
        }}
        estimate={selectedEstimateForPreview}
        onEdit={(estimate) => {
          navigate(`/estimates/${estimate.id}/edit`);
        }}
        onPayNow={(estimate) => {
          setSelectedEstimateForPayment(estimate);
          setPaymentModalOpen(true);
        }}
      />

      <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select New Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {mockEmployees
                    .filter((emp) => emp.status === "Active")
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassignSubmit}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estimates;
