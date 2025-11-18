import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Mail, Phone, Calendar, Briefcase, Edit, UserX, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  hireDate: string;
  totalJobs: number;
  avatar?: string;
  color?: string;
  onEdit?: () => void;
  onDeactivate?: () => void;
  onColorChange?: (color: string) => void;
}

const EMPLOYEE_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Red", value: "#EF4444" },
  { name: "Teal", value: "#14B8A6" },
];

export const EmployeeCard = ({
  id,
  name,
  email,
  phone,
  role,
  status,
  hireDate,
  totalJobs,
  avatar,
  color = "#3B82F6",
  onEdit,
  onDeactivate,
  onColorChange,
}: EmployeeCardProps) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleColorSelect = (selectedColor: string) => {
    if (onColorChange) {
      onColorChange(selectedColor);
      setColorPickerOpen(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 shadow-md" style={{ borderColor: color }}>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-white font-semibold text-lg" style={{ backgroundColor: color }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div 
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background"
              style={{ backgroundColor: color }}
            />
            {onColorChange && (
              <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background border-2 shadow-sm hover:scale-110 transition-transform p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorPickerOpen(true);
                    }}
                  >
                    <Palette className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-2">
                    <p className="text-sm font-medium mb-3">Assign Color</p>
                    <div className="grid grid-cols-4 gap-2">
                      {EMPLOYEE_COLORS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          type="button"
                          onClick={() => handleColorSelect(colorOption.value)}
                          className={cn(
                            "h-10 w-10 rounded-md border-2 transition-all hover:scale-110",
                            color === colorOption.value
                              ? "border-foreground scale-110 shadow-md"
                              : "border-border hover:border-foreground/50"
                          )}
                          style={{ backgroundColor: colorOption.value }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{id}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {role}
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                {status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground truncate">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground">{phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground">
              Hired {new Date(hireDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Total Jobs
            </span>
            <span className="font-bold text-xl text-primary">{totalJobs}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onEdit} variant="outline" size="sm" className="flex-1 gap-2 min-w-0">
            <Edit className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Edit Employee</span>
          </Button>
          <Button onClick={onDeactivate} variant="outline" size="sm" className="flex-1 gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground min-w-0">
            <UserX className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Deactivate</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
