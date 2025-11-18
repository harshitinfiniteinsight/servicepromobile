import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Badge } from "@/components/ui/badge";
import { mockAgreements, mockCustomers } from "@/data/mobileMockData";
import { Calendar, DollarSign, User, FileText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const AgreementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agreement = mockAgreements.find(a => a.id === id);
  
  if (!agreement) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Agreement not found</p>
      </div>
    );
  }

  const customer = mockCustomers.find(c => c.id === agreement.customerId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Agreement Details" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{agreement.type}</h2>
              <Badge className={cn("text-sm", statusColors[agreement.status])}>
                {agreement.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Monthly</p>
              <p className="text-2xl font-bold text-primary">${agreement.monthlyAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 space-y-4 pb-6">
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer
            </h3>
            <p className="font-medium">{agreement.customerName}</p>
            {customer && (
              <p className="text-sm text-muted-foreground mt-1">{customer.email}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Agreement Period
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Start:</span> {new Date(agreement.startDate).toLocaleDateString()}</p>
              <p><span className="text-muted-foreground">End:</span> {new Date(agreement.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Renewal
            </h3>
            <Badge variant="outline">{agreement.renewalStatus}</Badge>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Amount:</span>
                <span className="font-semibold">${agreement.monthlyAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total Value:</span>
                <span className="font-bold">${(agreement.monthlyAmount * 12).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementDetails;

