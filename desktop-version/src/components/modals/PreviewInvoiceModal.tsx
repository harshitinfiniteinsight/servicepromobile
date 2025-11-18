import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer, X, Mail, MessageSquare, UserCog, Edit } from "lucide-react";
import { SendEmailModal } from "./SendEmailModal";
import { SendSMSModal } from "./SendSMSModal";
import { mockEmployees, mockCustomers } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface PreviewInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onEdit?: (invoice: any) => void;
  onPayNow?: (invoice: any) => void;
}

export const PreviewInvoiceModal = ({ open, onOpenChange, invoice, onEdit, onPayNow }: PreviewInvoiceModalProps) => {
  const { toast } = useToast();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(invoice?.employeeId || "");

  if (!invoice) return null;

  // Find customer details
  const customer = mockCustomers.find(c => c.id === invoice.customerId);
  
  // Calculate invoice totals
  const items = invoice.items || [];
  const itemTotal = items.reduce((sum: number, item: any) => {
    const itemSubtotal = (item.rate || 0) * (item.quantity || 0);
    const discountAmount = item.discount ? (itemSubtotal * (item.discount / 100)) : 0;
    return sum + (itemSubtotal - discountAmount);
  }, 0);

  const discountTotal = items.reduce((sum: number, item: any) => {
    const itemSubtotal = (item.rate || 0) * (item.quantity || 0);
    return sum + (itemSubtotal * ((item.discount || 0) / 100));
  }, 0);

  const subtotalAfterDiscount = itemTotal;
  const taxTotal = items.reduce((sum: number, item: any) => {
    const itemSubtotal = (item.rate || 0) * (item.quantity || 0);
    const discountAmount = item.discount ? (itemSubtotal * (item.discount / 100)) : 0;
    const afterDiscount = itemSubtotal - discountAmount;
    return sum + ((item.tax || 0) / 100) * afterDiscount;
  }, 0);

  const invoiceTotal = subtotalAfterDiscount + taxTotal;
  const invoiceBalanceDue = invoiceTotal;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Format terms
  const formatTerms = (terms: string) => {
    if (!terms) return "due on receipt";
    return terms.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setShowEmailModal(true);
  };

  const handleSendSMS = () => {
    setShowSMSModal(true);
  };

  const handleReassignEmployee = () => {
    setShowReassignModal(true);
  };

  const handleReassignSubmit = () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Employee Reassigned",
      description: `Invoice ${invoice.id} has been reassigned to the selected employee.`,
    });
    setShowReassignModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-3xl font-bold text-white">Preview Invoice</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  className="bg-orange-500 hover:bg-orange-600 text-white border-none"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Printer
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-blue-600/80 h-10 w-10 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Invoice Details Section - Blue Background */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Invoice No.</p>
                  <p className="font-semibold text-gray-900">{invoice.id || "Generated After Save"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terms</p>
                  <p className="font-semibold text-gray-900">{formatTerms(invoice.terms || "due on receipt")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Due Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To Section - Blue Background */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Bill To</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name -</span> <span className="font-medium text-gray-900">{customer?.name || invoice.customerName || "N/A"}</span></p>
                    <p><span className="text-gray-600">Email -</span> <span className="font-medium text-gray-900">{customer?.email || "N/A"}</span></p>
                    <p><span className="text-gray-600">Address -</span> <span className="font-medium text-gray-900">{customer?.address || "N/A"}</span></p>
                    <p><span className="text-gray-600">Company -</span> <span className="font-medium text-gray-900">{invoice.company || "null"}</span></p>
                    <p><span className="text-gray-600">Phone -</span> <span className="font-medium text-gray-900">{customer?.phone || "N/A"}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ship To</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name -</span> <span className="font-medium text-gray-900">{invoice.shipToName || "null null"}</span></p>
                    <p><span className="text-gray-600">Email -</span> <span className="font-medium text-gray-900">{customer?.email || invoice.shipToEmail || "N/A"}</span></p>
                    <p><span className="text-gray-600">Address -</span> <span className="font-medium text-gray-900">{invoice.shipToAddress || "null"}</span></p>
                    <p><span className="text-gray-600">Company -</span> <span className="font-medium text-gray-900">{invoice.shipToCompany || "null"}</span></p>
                    <p><span className="text-gray-600">Phone -</span> <span className="font-medium text-gray-900">{customer?.phone || "N/A"}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Service Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Product/Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">QTY</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Discount</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Sub Total</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Tax</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item: any, index: number) => {
                    const itemSubtotal = (item.rate || 0) * (item.quantity || 0);
                    const discountAmount = item.discount ? (itemSubtotal * (item.discount / 100)) : 0;
                    const afterDiscount = itemSubtotal - discountAmount;
                    const taxAmount = ((item.tax || 0) / 100) * afterDiscount;
                    
                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.serviceDate || invoice.issueDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.description || item.product || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.sku || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{item.fullDescription || item.description || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity || 0}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">${(item.rate || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{item.discount ? `${item.discount}%` : "0.00%"}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${afterDiscount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">${taxAmount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Terms & Conditions Section */}
              <div className="col-span-2 space-y-4">
                <div>
                  <h3 className="text-blue-600 font-semibold mb-1">Message on Statement</h3>
                  <p className="text-sm text-gray-600">{invoice.messageOnStatement || "-"}</p>
                </div>
                <div>
                  <h3 className="text-blue-600 font-semibold mb-1">Message on Invoice</h3>
                  <p className="text-sm text-gray-600">{invoice.messageOnInvoice || "-"}</p>
                </div>
                <div>
                  <h3 className="text-blue-600 font-semibold mb-1">Terms & Conditions</h3>
                  <p className="text-sm text-gray-600">{invoice.termsConditions || "from global settings"}</p>
                </div>
                <div>
                  <h3 className="text-blue-600 font-semibold mb-1">Cancellation & Refund Policy</h3>
                  <p className="text-sm text-gray-600">{invoice.cancellationPolicy || "-"}</p>
                </div>
                <div>
                  <h3 className="text-blue-600 font-semibold mb-2">Thank You For Your Business!</h3>
                  <p className="text-sm text-gray-600">
                    If below 'Pay Now' button didn't work, just copy and paste this URL into your web browser's address bar to complete payment:
                  </p>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Item Total:</span>
                    <span className="font-medium text-gray-900">${itemTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total after Discount:</span>
                    <span className="font-medium text-gray-900">${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes:</span>
                    <span className="font-medium text-gray-900">${taxTotal.toFixed(2)}</span>
                  </div>
                  {items.map((item: any, index: number) => {
                    if (item.tax && item.tax > 0) {
                      const itemSubtotal = (item.rate || 0) * (item.quantity || 0);
                      const discountAmount = item.discount ? (itemSubtotal * (item.discount / 100)) : 0;
                      const afterDiscount = itemSubtotal - discountAmount;
                      const taxAmount = (item.tax / 100) * afterDiscount;
                      return (
                        <div key={index} className="flex justify-between text-xs text-gray-500">
                          <span>default : {item.tax}% of ${afterDiscount.toFixed(2)} = ${taxAmount.toFixed(2)}</span>
                          <span>${taxAmount.toFixed(2)}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Invoice Total:</span>
                    <span className="font-bold text-lg text-gray-900">${invoiceTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Invoice Balance due:</span>
                    <span className="font-medium text-gray-900">${invoiceBalanceDue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Balance due:</span>
                    <span className="font-medium text-gray-900">${invoiceBalanceDue.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    {invoice.status !== "Paid" && (
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          if (onPayNow) {
                            onPayNow(invoice);
                            onOpenChange(false);
                          }
                        }}
                      >
                        Pay Now
                      </Button>
                    )}
                    <div className="flex items-center justify-center py-4">
                      <div 
                        className={`
                          inline-block px-8 py-3 border-4 rounded-lg font-bold text-xl
                          transform rotate-[-3deg] shadow-lg
                          ${invoice.status === "Paid" 
                            ? "border-green-500 text-green-600 bg-green-50" 
                            : "border-red-500 text-red-600 bg-red-50"
                          }
                        `}
                        style={{
                          fontFamily: 'serif',
                          letterSpacing: '2px'
                        }}
                      >
                        {invoice.status === "Paid" ? "Paid" : "Unpaid"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {invoice.status !== "Paid" && onEdit && (
                  <Button
                    onClick={() => {
                      if (onEdit) {
                        onEdit(invoice);
                        onOpenChange(false);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                )}
                <Button
                  onClick={handleSendEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  onClick={handleSendSMS}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send via SMS
                </Button>
                <Button
                  onClick={handleReassignEmployee}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Reassign Employee
                </Button>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Modal */}
      <SendEmailModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        customerEmail={customer?.email || ""}
      />

      {/* Send SMS Modal */}
      <SendSMSModal
        open={showSMSModal}
        onOpenChange={setShowSMSModal}
        customerName={customer?.name || invoice.customerName || ""}
        phoneNumber={customer?.phone || ""}
      />

      {/* Reassign Employee Modal */}
      <Dialog open={showReassignModal} onOpenChange={setShowReassignModal}>
        <DialogContent className="sm:max-w-[500px]">
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowReassignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassignSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Reassign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

