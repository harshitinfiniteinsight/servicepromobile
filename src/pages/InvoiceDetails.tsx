import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockInvoices, mockCustomers } from "@/data/mobileMockData";
import { Calendar, DollarSign, CreditCard, User, FileText, Download, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = mockInvoices.find(i => i.id === id);
  
  if (!invoice) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Invoice not found</p>
      </div>
    );
  }

  const customer = mockCustomers.find(c => c.id === invoice.customerId);

  // Mock invoice items
  const invoiceItems = [
    { name: "HVAC Installation", quantity: 1, price: 300, total: 300 },
    { name: "Labor", quantity: 3, price: 50, total: 150 },
  ];

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Invoice Details"
        showBack={true}
        actions={
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{invoice.id}</h2>
              <Badge className={cn("text-sm", statusColors[invoice.status])}>
                {invoice.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold">${invoice.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `mailto:${customer?.email}`}>
            <Mail className="h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `tel:${customer?.phone}`}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="px-4">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pb-6">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {invoice.customerName}</p>
                {customer && (
                  <>
                    <p><span className="text-muted-foreground">Email:</span> {customer.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {customer.phone}</p>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Dates
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Method:</span> {invoice.paymentMethod}</p>
                <p><span className="text-muted-foreground">Status:</span> {invoice.status}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 pb-6">
            <div className="space-y-3">
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold">${item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Tax (8%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvoiceDetails;

