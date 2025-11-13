import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees } from "@/data/mockData";

interface EquipmentAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
}

export function EquipmentAssignModal({ open, onOpenChange, equipment }: EquipmentAssignModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employeeId: equipment?.assignedToId || "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);
    toast({
      title: "Equipment Assigned",
      description: `${equipment?.name} has been assigned to ${selectedEmployee?.name}.`,
    });
    onOpenChange(false);
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{equipment.status === "Assigned" ? "Reassign" : "Assign"} Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="font-semibold text-foreground">{equipment.name}</p>
            <p className="text-sm text-muted-foreground">Serial: {equipment.serialNumber}</p>
          </div>

          <div>
            <Label htmlFor="employee">Select Employee *</Label>
            <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add a note about this assignment..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
