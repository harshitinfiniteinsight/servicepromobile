import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { QuickAddCustomerModal } from "./QuickAddCustomerModal";
import { AddAgreementInventoryModal } from "./AddAgreementInventoryModal";
import { FollowUpAppointmentModal } from "./FollowUpAppointmentModal";
import { AddAppointmentModal } from "./AddAppointmentModal";
import { useToast } from "@/hooks/use-toast";
import { mockCustomers, mockEmployees, mockInventory } from "@/data/mockData";
import { CalendarIcon, Plus, Search, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingAgreement?: any;
}

export function AddAgreementModal({ open, onOpenChange, existingAgreement }: AddAgreementModalProps) {
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
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Step 2 data
  const [agreementType, setAgreementType] = useState("one-time");
  const [takeSnapshot, setTakeSnapshot] = useState(false);
  const [uploadPhotoId, setUploadPhotoId] = useState(false);
  const [agreementDuration, setAgreementDuration] = useState<Date>();

  // Step 3 data
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [servicePrices, setServicePrices] = useState<Record<string, number>>({});

  // Step 4 data
  const [workDescription, setWorkDescription] = useState("");

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
      title: "Agreement Created",
      description: "The service agreement has been created successfully.",
    });
    onOpenChange(false);
    resetForm();
    setFollowUpOpen(true);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedCustomer("");
    setSelectedEmployee("");
    setAgreementType("one-time");
    setTakeSnapshot(false);
    setUploadPhotoId(false);
    setAgreementDuration(undefined);
    setSelectedServices(new Set());
    setServicePrices({});
    setWorkDescription("");
    setCustomerSearch("");
    setServiceSearch("");
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Add Agreement - Step {step} of 4
            </DialogTitle>
          </DialogHeader>

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

              <div className="flex justify-end pt-4">
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
                  Create Agreement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
}
