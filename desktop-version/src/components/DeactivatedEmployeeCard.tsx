import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeactivatedEmployeeCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  onActivate?: () => void;
}

export const DeactivatedEmployeeCard = ({
  id,
  name,
  email,
  phone,
  role,
  avatar,
  onActivate,
}: DeactivatedEmployeeCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-0 shadow-md opacity-75">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-muted flex-shrink-0">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">ID: {id}</p>
            <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{role}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
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
          Activate Employee
        </Button>
      </CardContent>
    </Card>
  );
};
