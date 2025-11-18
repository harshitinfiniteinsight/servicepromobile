import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { QuickAddCustomerModal } from "@/components/modals/QuickAddCustomerModal";
import { AddAgreementInventoryModal } from "@/components/modals/AddAgreementInventoryModal";
import { FollowUpAppointmentModal } from "@/components/modals/FollowUpAppointmentModal";
import { AddAppointmentModal } from "@/components/modals/AddAppointmentModal";
import { useToast } from "@/hooks/use-toast";
import { mockCustomers, mockEmployees, mockInventory, mockAgreements } from "@/data/mockData";
import { CalendarIcon, Plus, Search, Check, ArrowLeft, RefreshCw, List, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const AddAgreement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = id ? "edit" : "create";
  const agreement = id ? mockAgreements.find(ag => ag.id === id) : null;

  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [quickAddCustomerOpen, setQuickAddCustomerOpen] = useState(false);
  const [agreementInventoryOpen, setAgreementInventoryOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Step 1 data
  const [selectedCustomer, setSelectedCustomer] = useState(agreement?.customerId || "");
  const [selectedEmployee, setSelectedEmployee] = useState((agreement as any)?.employeeId || "");

  // Step 2 data
  const [agreementType, setAgreementType] = useState(agreement?.type || "one-time");
  const [takeSnapshot, setTakeSnapshot] = useState(false);
  const [uploadPhotoId, setUploadPhotoId] = useState(false);
  const [agreementDuration, setAgreementDuration] = useState<Date | undefined>(
    agreement?.endDate ? new Date(agreement.endDate) : undefined
  );

  // Step 3 data
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set((agreement as any)?.services?.map((s: any) => s.id) || [])
  );
  const [servicePrices, setServicePrices] = useState<Record<string, number>>(
    (agreement as any)?.services?.reduce((acc: Record<string, number>, s: any) => {
      acc[s.id] = s.price;
      return acc;
    }, {}) || {}
  );

  // Step 4 data
  const [workDescription, setWorkDescription] = useState((agreement as any)?.description || "");

  useEffect(() => {
    if (agreement) {
      const agreementData = agreement as any;
      // Pre-fill form data when editing
      setSelectedCustomer(agreementData.customerId || "");
      setSelectedEmployee(agreementData.employeeId || "");
      setAgreementType(agreementData.type || "one-time");
      setAgreementDuration(agreementData.endDate ? new Date(agreementData.endDate) : undefined);
      setWorkDescription(agreementData.description || "");
      if (agreementData.services) {
        setSelectedServices(new Set(agreementData.services.map((s: any) => s.id)));
        const prices: Record<string, number> = {};
        agreementData.services.forEach((s: any) => {
          prices[s.id] = s.price;
        });
        setServicePrices(prices);
      }
    }
  }, [agreement]);

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.status === "active" &&
      (customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  const services = mockInventory.filter(
    (item) =>
      item.category === "Service" || item.type === "Fixed" || item.type === "Variable"
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1 && (!selectedCustomer || !selectedEmployee)) {
      toast({
        title: "Missing Information",
        description: "Please select both customer and employee",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !agreementDuration) {
      toast({
        title: "Missing Information",
        description: "Please select agreement duration",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && selectedServices.size === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleCreateAgreement = () => {
    if (!workDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter work description",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: mode === "create" ? "Agreement Created" : "Agreement Updated",
      description: mode === "create" ? "The service agreement has been created successfully." : "The service agreement has been updated successfully.",
    });
    navigate("/agreements");
    if (mode === "create") {
      setFollowUpOpen(true);
    }
  };

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
      const newPrices = { ...servicePrices };
      delete newPrices[serviceId];
      setServicePrices(newPrices);
    } else {
      newSelected.add(serviceId);
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setServicePrices({ ...servicePrices, [serviceId]: service.price });
      }
    }
    setSelectedServices(newSelected);
  };

  const updateServicePrice = (serviceId: string, price: number) => {
    setServicePrices({ ...servicePrices, [serviceId]: price });
  };

  return (
    <>
      <div className="flex-1">
        <AppHeader searchPlaceholder="Search..." onSearchChange={() => {}} />
        
        <main className="px-4 sm:px-6 py-4 sm:py-6 animate-fade-in">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-lg mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/agreements")}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">
                    Service Pro911 - {mode === "create" ? "New Agreement" : "Edit Agreement"}
                  </h1>
                </div>
              </div>
              <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-none">
                Step {step} of 4
              </Badge>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/agreements")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Agreement List
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Success",
                  description: "Inventory items synced successfully",
                });
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Item
            </Button>
          </div>

          {/* Stepper */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNumber, index) => (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all",
                        stepNumber < step
                          ? "bg-primary text-primary-foreground border-primary"
                          : stepNumber === step
                          ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20"
                          : "bg-background text-muted-foreground border-muted-foreground/30"
                      )}
                    >
                      {stepNumber < step ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-xs font-medium text-center",
                        stepNumber <= step ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {stepNumber === 1 && "Customer & Employee"}
                      {stepNumber === 2 && "Agreement Type"}
                      {stepNumber === 3 && "Select Services"}
                      {stepNumber === 4 && "Work Description"}
                    </div>
                  </div>
                  {index < 3 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-all",
                        stepNumber < step ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-card rounded-xl border shadow-lg p-6">
            {/* Step 1: Customer and Employee Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Customer *</Label>
                  <div className="space-y-2">
                    <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={customerSearchOpen}
                          className="w-full justify-between"
                        >
                          {selectedCustomer
                            ? mockCustomers.find((c) => c.id === selectedCustomer)?.name
                            : "Choose a customer"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                        <Command>
                          <CommandInput placeholder="Search customers..." />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {filteredCustomers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.id}
                                  onSelect={() => {
                                    setSelectedCustomer(customer.id);
                                    setCustomerSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCustomer === customer.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {customer.name} - {customer.email}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickAddCustomerOpen(true)}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Customer
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Employee *</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an employee" />
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

                <div className="flex justify-end pt-4 gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/agreements")}>
                    Cancel
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}

            {/* Step 2: Agreement Type and Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Type of Agreement *</Label>
                  <RadioGroup value={agreementType} onValueChange={setAgreementType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="font-normal cursor-pointer">
                        One Time Agreement
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="service" id="service" />
                      <Label htmlFor="service" className="font-normal cursor-pointer">
                        Service Agreement
                      </Label>
                    </div>
                  </RadioGroup>

                  {agreementType === "service" && (
                    <div className="space-y-3 pl-6 border-l-2 border-primary/20 animate-fade-in">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="snapshot"
                          checked={takeSnapshot}
                          onCheckedChange={(checked) => setTakeSnapshot(checked as boolean)}
                        />
                        <Label htmlFor="snapshot" className="font-normal cursor-pointer">
                          Take a snapshot
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="photoId"
                          checked={uploadPhotoId}
                          onCheckedChange={(checked) => setUploadPhotoId(checked as boolean)}
                        />
                        <Label htmlFor="photoId" className="font-normal cursor-pointer">
                          Upload or capture a picture of Photo ID
                        </Label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Agreement Duration *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !agreementDuration && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {agreementDuration ? format(agreementDuration, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={agreementDuration}
                        onSelect={setAgreementDuration}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Select Services */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setAgreementInventoryOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-32">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedServices.has(service.id)}
                              onCheckedChange={() => toggleService(service.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={servicePrices[service.id] || service.price}
                              onChange={(e) =>
                                updateServicePrice(service.id, parseFloat(e.target.value) || 0)
                              }
                              disabled={!selectedServices.has(service.id)}
                              className="w-24"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Work Description */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workDescription">Work Description *</Label>
                  <Textarea
                    id="workDescription"
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Enter detailed work description..."
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                    Previous
                  </Button>
                  <Button onClick={handleCreateAgreement} className="flex-1">
                    {mode === "create" ? "Create Agreement" : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <QuickAddCustomerModal
        open={quickAddCustomerOpen}
        onOpenChange={setQuickAddCustomerOpen}
      />
      
      <AddAgreementInventoryModal
        open={agreementInventoryOpen}
        onOpenChange={setAgreementInventoryOpen}
      />

      <FollowUpAppointmentModal
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        onScheduleAppointment={() => setAppointmentOpen(true)}
      />

      <AddAppointmentModal
        open={appointmentOpen}
        onOpenChange={setAppointmentOpen}
        prefilledData={{
          subject: "Follow Up",
          customerId: selectedCustomer,
          employeeId: selectedEmployee,
        }}
      />
    </>
  );
};

export default AddAgreement;

