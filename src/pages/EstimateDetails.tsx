import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockEstimates, mockCustomers } from "@/data/mobileMockData";
import { Calendar, DollarSign, User, TrendingUp, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const EstimateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const estimate = mockEstimates.find(e => e.id === id);
  
  if (!estimate) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Estimate not found</p>
      </div>
    );
  }

  const customer = mockCustomers.find(c => c.id === estimate.customerId);

  // Mock estimate items
  const estimateItems = [
    { name: "HVAC Installation", quantity: 1, price: 800, total: 800 },
    { name: "Materials", quantity: 1, price: 200, total: 200 },
    { name: "Labor", quantity: 4, price: 50, total: 200 },
  ];

  const subtotal = estimateItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;

  const handleConvertToInvoice = () => {
    navigate(`/invoices/new?estimate=${estimate.id}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Estimate Details"
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
              <h2 className="text-2xl font-bold mb-2">{estimate.id}</h2>
              <Badge className={cn("text-sm", statusColors[estimate.status])}>
                {estimate.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-3xl font-bold text-primary">${estimate.amount.toLocaleString()}</p>
            </div>
          </div>

          {estimate.probability && estimate.status === "Sent" && (
            <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">
                  {estimate.probability}% conversion probability
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {estimate.status === "Approved" && (
          <div className="px-4 py-4">
            <Button className="w-full" size="lg" onClick={handleConvertToInvoice}>
              Convert to Invoice
            </Button>
          </div>
        )}

        {/* Details */}
        <div className="px-4 space-y-4 pb-6">
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {estimate.customerName}</p>
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
              Estimate Date
            </h3>
            <p className="text-sm">{new Date(estimate.date).toLocaleDateString()}</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Items
            </h3>
            <div className="space-y-3">
              {estimateItems.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateDetails;

