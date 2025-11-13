import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeactivatedCustomerCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: "M" | "F";
  onActivate?: () => void;
}

export const DeactivatedCustomerCard = ({ 
  id, 
  name, 
  email, 
  phone, 
  avatar, 
  gender,
  onActivate 
}: DeactivatedCustomerCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-0 shadow-md opacity-75">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-muted">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">ID: {id}</p>
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                {name}
                {gender && (
                  <span className="text-xs font-normal text-muted-foreground">({gender})</span>
                )}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{phone}</span>
              </div>
            </div>

            <Button 
              onClick={onActivate}
              variant="outline" 
              size="sm" 
              className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              Activate Customer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
