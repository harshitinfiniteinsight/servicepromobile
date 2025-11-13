import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { mockInventory } from "@/data/mockData";

interface AddAgreementInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAgreementInventoryModal({ open, onOpenChange }: AddAgreementInventoryModalProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const variableInventories = mockInventory.filter(
    item => item.type === "Variable" && !(item as any).isAgreementInventory
  );
  const filteredInventories = variableInventories.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one inventory item.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Agreement Inventory Added",
      description: `${selectedItems.length} item(s) added to agreement inventory.`,
    });
    setSelectedItems([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Agreement Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="search">Search Variable Inventories</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, ID, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-3 bg-muted/20">
            {filteredInventories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? "No matching inventories found" : "No variable inventories available"}
              </p>
            ) : (
              filteredInventories.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-background rounded-md border border-border hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => handleToggleItem(item.id)}>
                    <Label
                      htmlFor={item.id}
                      className="font-semibold text-base cursor-pointer"
                    >
                      {item.name}
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ID: <span className="font-medium text-foreground">{item.id}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        SKU: <span className="font-medium text-foreground">{item.sku}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        Stock: <span className="font-medium text-foreground">{item.stockQuantity}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <p className="text-sm font-medium text-foreground">
                {selectedItems.length} item(s) selected
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedItems([]);
                setSearchQuery("");
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Selected
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
