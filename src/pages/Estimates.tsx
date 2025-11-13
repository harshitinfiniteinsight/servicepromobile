import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import EstimateCard from "@/components/cards/EstimateCard";
import EmptyState from "@/components/cards/EmptyState";
import PaymentModal from "@/components/modals/PaymentModal";
import PreviewEstimateModal from "@/components/modals/PreviewEstimateModal";
import SendEmailModal from "@/components/modals/SendEmailModal";
import SendSMSModal from "@/components/modals/SendSMSModal";
import ReassignEmployeeModal from "@/components/modals/ReassignEmployeeModal";
import ShareAddressModal from "@/components/modals/ShareAddressModal";
import { mockEstimates, mockCustomers } from "@/data/mobileMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Search, FileText, CheckCircle, MoreVertical, Eye, Mail, MessageSquare, Edit, MapPin, UserCog, History, X, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Estimates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("activate");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<{ id: string; amount: number } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewEstimate, setPreviewEstimate] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showShareAddressModal, setShowShareAddressModal] = useState(false);
  const [selectedEstimateForAction, setSelectedEstimateForAction] = useState<any>(null);
  const [deactivatedEstimates, setDeactivatedEstimates] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [statusFilterValue, setStatusFilterValue] = useState<string>("all");
  
  const filteredEstimates = mockEstimates.filter(est => {
    const matchesSearch = est.id.toLowerCase().includes(search.toLowerCase()) ||
                         est.customerName.toLowerCase().includes(search.toLowerCase());
    
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const estimateDate = new Date(est.date);
      estimateDate.setHours(0, 0, 0, 0); // Normalize to start of day
      
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && estimateDate >= fromDate;
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Include entire end date
        matchesDateRange = matchesDateRange && estimateDate <= toDate;
      }
    }
    
    // Filter by status (All / Paid / Unpaid)
    const matchesStatus = statusFilterValue === "all" || est.status === statusFilterValue;
    
    // Filter by tab
    // Activate: Both Paid and Unpaid estimates that are NOT deactivated
    // Deactivated: Only Unpaid estimates that ARE deactivated
    let matchesTab = true;
    const isDeactivated = deactivatedEstimates.has(est.id);
    if (statusFilter === "deactivated") {
      matchesTab = est.status === "Unpaid" && isDeactivated;
    } else {
      // Activate tab: exclude deactivated estimates
      matchesTab = !isDeactivated;
    }
    
    return matchesSearch && matchesDateRange && matchesStatus && matchesTab;
  });

  const handlePayNow = (estimateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const estimate = mockEstimates.find(est => est.id === estimateId);
    if (estimate) {
      setSelectedEstimate({ id: estimateId, amount: estimate.amount });
      setShowPaymentModal(true);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    if (selectedEstimate) {
      toast.success(`Processing ${method} payment for ${selectedEstimate.id}...`);
      // Navigate to payment processing page or handle payment
      // navigate(`/payment/${selectedEstimate.id}?method=${method}`);
    }
  };

  const handleActivate = (estimateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeactivatedEstimates(prev => {
      const newSet = new Set(prev);
      newSet.delete(estimateId);
      return newSet;
    });
    toast.success("Estimate activated successfully");
  };

  const handleMenuAction = (action: string, estimateId: string) => {
    switch (action) {
      case "preview":
        const estimate = mockEstimates.find(est => est.id === estimateId);
        if (estimate) {
          setPreviewEstimate(estimate);
          setShowPreviewModal(true);
        }
        break;
      case "send-email":
        const emailEstimate = mockEstimates.find(est => est.id === estimateId);
        if (emailEstimate) {
          const customer = mockCustomers.find(c => c.id === emailEstimate.customerId);
          setSelectedEstimateForAction({
            ...emailEstimate,
            customerEmail: customer?.email || "",
            customerPhone: customer?.phone || "",
            customerName: emailEstimate.customerName,
          });
          setShowEmailModal(true);
        }
        break;
      case "send-sms":
        const smsEstimate = mockEstimates.find(est => est.id === estimateId);
        if (smsEstimate) {
          const customer = mockCustomers.find(c => c.id === smsEstimate.customerId);
          setSelectedEstimateForAction({
            ...smsEstimate,
            customerEmail: customer?.email || "",
            customerPhone: customer?.phone || "",
            customerName: smsEstimate.customerName,
          });
          setShowSMSModal(true);
        }
        break;
      case "edit":
        navigate(`/estimates/${estimateId}/edit`);
        break;
      case "share-address":
        const shareEstimate = mockEstimates.find(est => est.id === estimateId);
        if (shareEstimate) {
          const customer = mockCustomers.find(c => c.id === shareEstimate.customerId);
          setSelectedEstimateForAction({
            ...shareEstimate,
            jobAddress: customer?.address || "No address available",
          });
          setShowShareAddressModal(true);
        }
        break;
      case "reassign":
        const reassignEstimate = mockEstimates.find(est => est.id === estimateId);
        if (reassignEstimate) {
          setSelectedEstimateForAction({
            ...reassignEstimate,
            currentEmployeeId: reassignEstimate.customerId, // Using customerId as placeholder for employeeId
          });
          setShowReassignModal(true);
        }
        break;
      case "doc-history":
        const docEstimate = mockEstimates.find(est => est.id === estimateId);
        if (docEstimate) {
          // Navigate to customer profile
          navigate(`/customers/${docEstimate.customerId}`);
        }
        break;
      case "deactivate":
        setDeactivatedEstimates(prev => new Set(prev).add(estimateId));
        toast.success("Estimate deactivated");
        // If we're on the activate tab and deactivate an estimate, it should disappear from view
        // The estimate will now appear in the deactivated tab
        break;
      case "refund":
        toast.success("Processing refund...");
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Estimates"
        showBack={true}
        actions={
          <Button size="sm" onClick={() => navigate("/estimates/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search estimates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  statusFilter === "deactivated" ? "w-full" : "flex-1",
                  "justify-start text-left font-normal h-10",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange({ from: range?.from, to: range?.to });
                }}
                numberOfMonths={1}
              />
              {(dateRange.from || dateRange.to) && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                  >
                    Clear Date Range
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Status Filter - Only show in Activate tab */}
          {statusFilter === "activate" && (
            <Select value={statusFilterValue} onValueChange={setStatusFilterValue}>
              <SelectTrigger className="flex-1 h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="activate">Activate</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4 space-y-3">
            {filteredEstimates.length > 0 ? (
              filteredEstimates.map(estimate => (
                <EstimateCard 
                  key={estimate.id}
                  estimate={estimate}
                  onClick={() => navigate(`/estimates/${estimate.id}`)}
                  payButton={
                    statusFilter === "activate" && estimate.status === "Unpaid" ? (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 w-full text-xs font-semibold touch-target whitespace-nowrap bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePayNow(estimate.id, e);
                        }}
                      >
                        Pay
                      </Button>
                    ) : undefined
                  }
                  actionButtons={
                    statusFilter === "activate" && estimate.status === "Unpaid" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 touch-target"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleMenuAction("preview", estimate.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview estimate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("send-email", estimate.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("send-sms", estimate.id)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("edit", estimate.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit estimate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("share-address", estimate.id)}>
                            <MapPin className="h-4 w-4 mr-2" />
                            Share job address
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("reassign", estimate.id)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Reassign employee
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("doc-history", estimate.id)}>
                            <History className="h-4 w-4 mr-2" />
                            Doc history
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleMenuAction("deactivate", estimate.id)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : statusFilter === "activate" && estimate.status === "Paid" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 touch-target"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleMenuAction("preview", estimate.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("refund", estimate.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Refund
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : statusFilter === "deactivated" && estimate.status === "Unpaid" ? (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-3 text-xs touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(estimate.id, e);
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    ) : undefined
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10 text-muted-foreground" />}
                title="No estimates found"
                description="Try adjusting your search or filters"
                actionLabel="Create Estimate"
                onAction={() => navigate("/estimates/new")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
      {selectedEstimate && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedEstimate(null);
          }}
          amount={selectedEstimate.amount}
          onPaymentMethodSelect={handlePaymentMethodSelect}
        />
      )}

      {/* Preview Estimate Modal */}
      {previewEstimate && (
        <PreviewEstimateModal
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewEstimate(null);
          }}
          estimate={previewEstimate}
          onAction={(action) => {
            if (action === "pay-now") {
              setShowPreviewModal(false);
              setSelectedEstimate({ id: previewEstimate.id, amount: previewEstimate.amount });
              setShowPaymentModal(true);
            } else if (action === "edit") {
              navigate(`/estimates/${previewEstimate.id}/edit`);
              setShowPreviewModal(false);
            } else {
              handleMenuAction(action, previewEstimate.id);
            }
          }}
        />
      )}

      {/* Send Email Modal */}
      {selectedEstimateForAction && (
        <SendEmailModal
          isOpen={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedEstimateForAction(null);
          }}
          customerEmail={selectedEstimateForAction.customerEmail}
          customerName={selectedEstimateForAction.customerName}
        />
      )}

      {/* Send SMS Modal */}
      {selectedEstimateForAction && (
        <SendSMSModal
          isOpen={showSMSModal}
          onClose={() => {
            setShowSMSModal(false);
            setSelectedEstimateForAction(null);
          }}
          phoneNumber={selectedEstimateForAction.customerPhone}
          customerName={selectedEstimateForAction.customerName}
        />
      )}

      {/* Reassign Employee Modal */}
      {selectedEstimateForAction && (
        <ReassignEmployeeModal
          isOpen={showReassignModal}
          onClose={() => {
            setShowReassignModal(false);
            setSelectedEstimateForAction(null);
          }}
          currentEmployeeId={selectedEstimateForAction.currentEmployeeId}
          estimateId={selectedEstimateForAction.id}
        />
      )}

      {/* Share Address Modal */}
      {selectedEstimateForAction && (
        <ShareAddressModal
          isOpen={showShareAddressModal}
          onClose={() => {
            setShowShareAddressModal(false);
            setSelectedEstimateForAction(null);
          }}
          jobAddress={selectedEstimateForAction.jobAddress}
          estimateId={selectedEstimateForAction.id}
        />
      )}
    </div>
  );
};

export default Estimates;
