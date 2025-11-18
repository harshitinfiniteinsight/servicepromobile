import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MoreVertical, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { SendSMSModal } from "./modals/SendSMSModal";
import { SendEmailModal } from "./modals/SendEmailModal";
import { CustomerNoteModal } from "./modals/CustomerNoteModal";
import { AddAppointmentModal } from "./modals/AddAppointmentModal";

interface CustomerCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string;
  gender?: "M" | "F";
  isActive?: boolean;
}

export const CustomerCard = ({ id, name, email, phone, address, avatar, gender, isActive = true }: CustomerCardProps) => {
  const navigate = useNavigate();
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="card-hover border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                {name}
                {gender && (
                  <span className="text-xs font-normal text-muted-foreground">({gender})</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">ID: {id}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-card">
              {isActive ? (
                <>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate(`/customers/${id}`)}
                  >
                    Customer Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate(`/customers/${id}`, { state: { editMode: true } })}
                  >
                    Edit Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/invoices', { state: { createNew: true, customerId: id } })}
                  >
                    Create Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/estimates', { state: { createNew: true, customerId: id } })}
                  >
                    Create Estimate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/agreements', { state: { createNew: true, customerId: id } })}
                  >
                    Create Agreement
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setIsNoteModalOpen(true)}
                  >
                    Add Note
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setIsAppointmentModalOpen(true)}
                  >
                    Set up Appointment
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    Deactivate
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="cursor-pointer text-green-600">
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground truncate">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{phone}</span>
          </div>
          {address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground line-clamp-1">{address}</span>
            </div>
          )}
        </div>

        {isActive && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsEmailModalOpen(true)}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsSMSModalOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
          </div>
        )}
      </CardContent>

      <SendSMSModal
        open={isSMSModalOpen}
        onOpenChange={setIsSMSModalOpen}
        customerName={name}
        phoneNumber={phone}
      />

      <SendEmailModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        customerEmail={email}
      />

      <CustomerNoteModal
        open={isNoteModalOpen}
        onOpenChange={setIsNoteModalOpen}
        customerId={id}
        customerName={name}
      />

      <AddAppointmentModal
        open={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
        prefilledData={{ customerId: id }}
      />
    </Card>
  );
};
