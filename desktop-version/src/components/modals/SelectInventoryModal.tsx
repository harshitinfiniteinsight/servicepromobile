import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockInventory } from "@/data/mockData";
import { Search } from "lucide-react";

interface SelectInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInventory: (item: any, customPrice?: number) => void;
}

export function SelectInventoryModal({
  open,
  onOpenChange,
  onSelectInventory,
}: SelectInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState("");

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: any) => {
    if (item.type === "Variable") {
      setSelectedItem(item);
      setCustomPrice(item.price.toString());
    } else {
      onSelectInventory(item);
      onOpenChange(false);
      setSearchQuery("");
      setSelectedItem(null);
      setCustomPrice("");
    }
  };

  const handleConfirmVariable = () => {
    if (selectedItem && customPrice) {
      onSelectInventory(selectedItem, parseFloat(customPrice));
      onOpenChange(false);
      setSearchQuery("");
      setSelectedItem(null);
      setCustomPrice("");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery("");
    setSelectedItem(null);
    setCustomPrice("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>
        
        {!selectedItem ? (
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <p className="text-sm text-muted-foreground">
              V = Variable and F = Fixed Inventory
            </p>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto border rounded-lg">
              <div className="space-y-2 p-2">
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {item.type === "Variable" ? "V" : item.type === "Fixed" ? "F" : "Unit"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">${item.price.toFixed(2)}</p>
                        {item.type === "Per Unit" && (
                          <p className="text-xs text-muted-foreground">per {item.itemUnit}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="font-medium">{selectedItem.name}</p>
              <p className="text-sm text-muted-foreground">{selectedItem.sku}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Set Price</Label>
              <Input
                type="number"
                placeholder="Enter price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmVariable} className="flex-1" disabled={!customPrice}>
                Add Item
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
