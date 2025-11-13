import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Phone, Mail, DollarSign, MoreVertical } from "lucide-react";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastVisit: string;
    totalSpent: number;
    address?: string;
    notes?: string;
    photo?: string;
  };
  variant?: "default" | "deactivated";
  onActivate?: () => void;
  onQuickAction?: (action: string) => void;
}

const formatCustomerId = (id: string) => {
  const numeric = id.replace(/\D/g, "");
  if (numeric.length === 0) return `ID: C-${id}`;
  return `ID: C-${numeric.padStart(3, "0")}`;
};

const CustomerCard = ({ customer, variant = "default", onActivate, onQuickAction }: CustomerCardProps) => {
  const navigate = useNavigate();
  const initials = customer.name.split(" ").map(n => n[0]).join("");
  const isDeactivated =
    variant === "deactivated" ||
    customer.status === "Deactivated" ||
    customer.status === "Inactive";

  if (isDeactivated) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col space-y-2 border border-gray-200 opacity-75">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3 flex-1">
            {customer.photo ? (
              <img
                src={customer.photo}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0 opacity-60"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-gray-200 flex-shrink-0">
                <span className="font-semibold text-gray-500 text-sm">{initials}</span>
              </div>
            )}
            <div className="flex flex-col leading-tight min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{customer.name}</h3>
              <p className="text-xs text-gray-500">{formatCustomerId(customer.id)}</p>
            </div>
          </div>
          {onActivate && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 h-8 px-3 rounded-lg border-green-500 text-green-600 hover:bg-green-50 text-xs"
              onClick={onActivate}
            >
              Activate
            </Button>
          )}
        </div>
        <div className="pl-12 space-y-1">
          <p className="flex items-center text-xs text-gray-600">
            <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </p>
          <p className="flex items-center text-xs text-gray-600">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{customer.email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col space-y-2 border border-gray-200">
      <div className="flex justify-between items-start">
        <div 
          className="flex items-center space-x-3 flex-1 cursor-pointer"
          onClick={() => navigate(`/customers/${customer.id}`)}
        >
          {customer.photo ? (
            <img
              src={customer.photo}
              alt={customer.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-gray-200 flex-shrink-0">
              <span className="font-semibold text-primary text-sm">{initials}</span>
            </div>
          )}
          <div className="flex flex-col leading-tight min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{customer.name}</h3>
            <p className="text-xs text-gray-500">{formatCustomerId(customer.id)}</p>
          </div>
        </div>
        {onQuickAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-52">
              {[
                { label: "Edit Customer", action: "edit" },
                { label: "Send SMS", action: "sms" },
                { label: "Memo", action: "memo" },
                { label: "Setup Appointment", action: "appointment" },
                { label: "Create Invoice", action: "create-invoice" },
                { label: "Create Estimate", action: "create-estimate" },
                { label: "Create Agreement", action: "create-agreement" },
                { label: "Customer Details", action: "details" },
              ].map(item => (
                <DropdownMenuItem
                  key={item.action}
                  onSelect={() => onQuickAction(item.action)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onSelect={() => onQuickAction("deactivate")}
                className="text-red-600 font-medium focus:bg-red-50 focus:text-red-600"
              >
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="pl-12 space-y-1">
        <p className="flex items-center text-xs text-gray-600">
          <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{customer.phone}</span>
        </p>
        <p className="flex items-center text-xs text-gray-600">
          <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{customer.email}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerCard;


