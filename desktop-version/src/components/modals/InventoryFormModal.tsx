import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, X } from "lucide-react";

interface InventoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  inventory?: any;
  onInventoryAdded?: (inventory: any) => void;
}

export function InventoryFormModal({ open, onOpenChange, mode, inventory, onInventoryAdded }: InventoryFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "Fixed",
    price: "",
    itemUnit: "",
    sku: "",
    stockQuantity: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && inventory) {
        setFormData({
          name: inventory.name || "",
          type: inventory.type || "Fixed",
          price: inventory.price?.toString() || "",
          itemUnit: inventory.itemUnit || "",
          sku: inventory.sku || "",
          stockQuantity: inventory.stockQuantity?.toString() || "",
          image: null,
        });
        setImagePreview(inventory.image || "");
      } else if (mode === "create") {
        setFormData({
          name: "",
          type: "Fixed",
          price: "",
          itemUnit: "",
          sku: "",
          stockQuantity: "",
          image: null,
        });
        setImagePreview("");
        generateSKU();
      }
    }
  }, [mode, open, inventory]);

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    setFormData(prev => ({
      ...prev,
      sku: `INV-${randomPart}-${timestamp}`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "create" && onInventoryAdded) {
      const newInventory = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        itemUnit: formData.itemUnit,
        sku: formData.sku,
        stockQuantity: parseFloat(formData.stockQuantity) || 0,
        image: imagePreview,
      };
      onInventoryAdded(newInventory);
    }
    
    toast({
      title: mode === "create" ? "Inventory Added" : "Inventory Updated",
      description: `${formData.name} has been ${mode === "create" ? "added" : "updated"} successfully.`,
    });
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "create" ? "Add Inventory" : "Update Inventory"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Inventory Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="touch-target"
              placeholder="Enter inventory name"
            />
          </div>

          <div>
            <Label htmlFor="type">Inventory Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="touch-target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Per Unit">Per Unit</SelectItem>
                <SelectItem value="Variable">Variable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type !== "Variable" && (
            <div>
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="pl-7 touch-target"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {formData.type === "Per Unit" && (
            <div>
              <Label htmlFor="itemUnit">Item Unit *</Label>
              <Input
                id="itemUnit"
                placeholder="e.g., piece, foot, hour"
                value={formData.itemUnit}
                onChange={(e) => setFormData({ ...formData, itemUnit: e.target.value })}
                required
                className="touch-target"
              />
            </div>
          )}

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="touch-target"
              />
              {mode === "create" && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateSKU}
                  title="Generate new SKU"
                  className="touch-target"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              required
              className="touch-target"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="inventoryImage">Inventory Image (Optional)</Label>
            <Input
              id="inventoryImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer touch-target"
            />
            {imagePreview && (
              <div className="relative mt-3 w-full h-48 rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Inventory preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 touch-target">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 touch-target">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
