import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LowStockAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

export function LowStockAlertModal({ open, onOpenChange, item }: LowStockAlertModalProps) {
  const { toast } = useToast();
  const [lowStockQty, setLowStockQty] = useState(item?.lowStockAlert || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Low Stock Alert Set",
      description: `Low stock alert for ${item?.name} has been updated.`,
    });
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Low Count Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">Current Stock: {item.stockQuantity}</p>
          </div>

          <div>
            <Label htmlFor="lowStockQty">Enter Low Stock Quantity *</Label>
            <Input
              id="lowStockQty"
              type="number"
              value={lowStockQty}
              onChange={(e) => setLowStockQty(e.target.value)}
              placeholder="e.g., 20"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              You'll be alerted when stock falls below this amount
            </p>
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
