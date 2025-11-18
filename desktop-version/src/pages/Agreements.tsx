import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, FileText, Calendar as CalendarIcon, Eye, Mail, MessageSquare, Edit, DollarSign, Wallet, CalendarRange, Percent } from "lucide-react";
import { mockAgreements } from "@/data/mockData";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { PayCashModal } from "@/components/modals/PayCashModal";
import { LinkModulesModal } from "@/components/modals/LinkModulesModal";
import { AgreementSignModal } from "@/components/modals/AgreementSignModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { AgreementPaymentModal } from "@/components/modals/AgreementPaymentModal";
import { PreviewAgreementModal } from "@/components/modals/PreviewAgreementModal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Agreements = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [sendSMSOpen, setSendSMSOpen] = useState(false);
  const [payCashOpen, setPayCashOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [agreements, setAgreements] = useState(mockAgreements);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkTargetModule, setLinkTargetModule] = useState<"estimate" | "invoice">("estimate");
  const [selectedAgreementForLink, setSelectedAgreementForLink] = useState<any>(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedAgreementForSign, setSelectedAgreementForSign] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedAgreementForPayment, setSelectedAgreementForPayment] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAgreementForPreview, setSelectedAgreementForPreview] = useState<any>(null);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch = agreement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || agreement.status === activeTab;
    
    const agreementDate = new Date(agreement.startDate);
    const matchesDateRange = 
      (!dateRange.from || agreementDate >= dateRange.from) &&
      (!dateRange.to || agreementDate <= dateRange.to);
    
    return matchesSearch && matchesTab && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSendEmail = (agreement: any) => {
    setSelectedAgreement(agreement);
    setSendEmailOpen(true);
  };

  const handleSendSMS = (agreement: any) => {
    setSelectedAgreement(agreement);
    setSendSMSOpen(true);
  };

  const handlePayCash = (agreement: any) => {
    setSelectedAgreement(agreement);
    setPayCashOpen(true);
  };

  const handleUpdateAgreement = (agreement: any) => {
    navigate(`/agreements/${agreement.id}/edit`);
  };

  const handlePaymentComplete = () => {
    if (selectedAgreement) {
      setAgreements(prevAgreements =>
        prevAgreements.map(agreement =>
          agreement.id === selectedAgreement.id
            ? { ...agreement, status: "Paid" }
            : agreement
        ) as typeof mockAgreements
      );
    }
  };

  const handleLinkModule = (agreement: any, targetModule: "estimate" | "invoice") => {
    setSelectedAgreementForLink(agreement);
    setLinkTargetModule(targetModule);
    setLinkModalOpen(true);
  };

  const handlePayNow = (agreement: any) => {
    setSelectedAgreementForSign(agreement);
    setSelectedAgreementForPayment(agreement);
    setSignModalOpen(true);
  };

  const handleSignComplete = () => {
    setPaymentModalOpen(true);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search agreements..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agreements</h1>
            <p className="text-muted-foreground">Manage service contracts and agreements</p>
          </div>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarRange className="h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
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
                      className="w-full"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              onClick={() => navigate("/agreements/minimum-deposit")} 
              className="gap-2"
            >
              <Percent className="h-5 w-5" />
              Minimum Deposit
            </Button>
            <Button className="gap-2" onClick={() => navigate("/agreements/new")}>
              <Plus className="h-5 w-5" />
              New Agreement
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
            <TabsTrigger value="Open">Open</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">

            <div className="grid gap-4">
              {filteredAgreements.map((agreement) => (
                <Card key={agreement.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4 bg-gradient-to-r from-card to-success/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{agreement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {agreement.id} • {agreement.customerName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-border">{agreement.type}</Badge>
                        <Badge className={getStatusColor(agreement.status)} variant="outline">{agreement.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Start Date
                        </p>
                        <p className="font-medium mt-1">{new Date(agreement.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          End Date
                        </p>
                        <p className="font-medium mt-1">{new Date(agreement.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                        <p className="text-primary text-xs">Annual Value</p>
                        <p className="text-2xl font-bold text-primary">${agreement.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 bg-muted/10 -mx-6 px-6 py-3 rounded-b-lg">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notes:
                      </p>
                      <div className="bg-card p-4 rounded-lg border border-border/50 text-sm">
                        {agreement.terms}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary"
                        onClick={() => {
                          setSelectedAgreementForPreview(agreement);
                          setPreviewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Preview Agreement
                      </Button>
                      
                      {agreement.status === "Open" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleSendEmail(agreement)}
                          >
                            <Mail className="h-4 w-4" />
                            Send Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleSendSMS(agreement)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Send SMS
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleUpdateAgreement(agreement)}
                          >
                            <Edit className="h-4 w-4" />
                            Update Agreement
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleLinkModule(agreement, "estimate")}
                          >
                            <FileText className="h-4 w-4" />
                            Link Estimate
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleLinkModule(agreement, "invoice")}
                          >
                            <DollarSign className="h-4 w-4" />
                            Link Invoice
                          </Button>
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handlePayNow(agreement)}
                          >
                            <DollarSign className="h-4 w-4" />
                            Pay Now
                          </Button>
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handlePayCash(agreement)}
                          >
                            <Wallet className="h-4 w-4" />
                            Pay Cash
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <SendEmailModal
        open={sendEmailOpen}
        onOpenChange={setSendEmailOpen}
        customerEmail={selectedAgreement?.customerEmail || ""}
      />
      <SendSMSModal
        open={sendSMSOpen}
        onOpenChange={setSendSMSOpen}
        customerName={selectedAgreement?.customerName || ""}
        phoneNumber={selectedAgreement?.customerPhone || ""}
      />
      <PayCashModal
        open={payCashOpen}
        onOpenChange={setPayCashOpen}
        orderAmount={selectedAgreement?.amount || 0}
        orderId={selectedAgreement?.id || ""}
        onPaymentComplete={handlePaymentComplete}
      />
      <LinkModulesModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        sourceModule="agreement"
        sourceId={selectedAgreementForLink?.id || ""}
        sourceName={selectedAgreementForLink?.title || ""}
        targetModule={linkTargetModule}
      />
      <AgreementSignModal
        open={signModalOpen}
        onOpenChange={setSignModalOpen}
        agreementId={selectedAgreementForSign?.id || ""}
        onSignComplete={handleSignComplete}
      />
      <PreviewAgreementModal
        open={previewModalOpen}
        onOpenChange={(open) => {
          setPreviewModalOpen(open);
          if (!open) setSelectedAgreementForPreview(null);
        }}
        agreement={selectedAgreementForPreview}
        onPayNow={(agreement) => {
          setSelectedAgreementForPayment(agreement);
          setPaymentModalOpen(true);
        }}
        onUpdate={(agreement) => {
          navigate(`/agreements/${agreement.id}/edit`);
        }}
      />
      <AgreementPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        agreement={selectedAgreementForPayment}
      />
    </div>
  );
};

export default Agreements;
