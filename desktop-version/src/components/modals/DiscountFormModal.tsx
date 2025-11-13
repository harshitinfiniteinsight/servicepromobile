import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface DiscountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  discount?: any;
}

export function DiscountFormModal({ open, onOpenChange, mode, discount }: DiscountFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: discount?.name || "",
    value: discount?.value || "",
    type: discount?.type || "%",
    isDefault: discount?.isDefault || false,
  });

  // Update form data when discount prop changes
  useEffect(() => {
    if (discount && mode === "edit") {
      setFormData({
        name: discount.name || "",
        value: discount.value !== undefined && discount.value !== null ? String(discount.value) : "",
        type: discount.type || "%",
        isDefault: discount.isDefault || false,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        value: "",
        type: "%",
        isDefault: false,
      });
    }
  }, [discount, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === "create" ? "Discount Added" : "Discount Updated",
      description: `${formData.name} has been ${mode === "create" ? "added" : "updated"} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Discount" : "Edit Discount"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Discount Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Senior Citizen Discount"
              required
            />
          </div>

          <div>
            <Label htmlFor="value">Discount Value *</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="e.g., 10"
              required
            />
          </div>

          <div>
            <Label>Discount Type *</Label>
            <RadioGroup value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="%" id="percentage" />
                <Label htmlFor="percentage" className="font-normal cursor-pointer">Percentage (%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="$" id="fixed" />
                <Label htmlFor="fixed" className="font-normal cursor-pointer">Fixed Amount ($)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
            />
            <Label htmlFor="isDefault" className="font-normal cursor-pointer">
              Set as default discount
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
