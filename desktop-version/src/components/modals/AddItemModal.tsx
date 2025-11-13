import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, Search, Upload, Camera, X, ArrowLeft, DollarSign } from "lucide-react";
import { mockInventory } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryFormModal } from "./InventoryFormModal";
import { SelectInventoryModal } from "./SelectInventoryModal";
import { toast } from "sonner";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
  context?: "invoice" | "estimate"; // Context to determine title
}

export const AddItemModal = ({ open, onOpenChange, onAddItem, context = "invoice" }: AddItemModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSelectInventoryModal, setShowSelectInventoryModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState("");
  
  // Custom item form states
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    price: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectInventory = (inventory: any) => {
    if (inventory.type === "Variable") {
      setSelectedInventory(inventory);
      setCustomPrice(inventory.price.toString());
    } else {
      onAddItem({
        description: `${inventory.name} (${inventory.type === "Fixed" ? "F" : "U"})`,
        quantity: 1,
        rate: inventory.price,
        amount: inventory.price,
        type: "inventory",
        inventoryId: inventory.id,
        sku: inventory.sku,
      });
      resetModal();
    }
  };

  const handleAddVariableInventory = () => {
    if (selectedInventory && customPrice) {
      onAddItem({
        description: `${selectedInventory.name} (V)`,
        quantity: 1,
        rate: parseFloat(customPrice),
        amount: parseFloat(customPrice),
        type: "inventory",
        inventoryId: selectedInventory.id,
        sku: selectedInventory.sku,
      });
      resetModal();
    }
  };

  const handleInventoryAdded = (inventory: any) => {
    onAddItem({
      description: `${inventory.name} (${getInventoryTypeLabel(inventory.type)})`,
      quantity: 1,
      rate: inventory.price,
      amount: inventory.price,
      type: "inventory",
      inventoryId: inventory.id,
      sku: inventory.sku,
    });
    setShowInventoryModal(false);
    resetModal();
  };

  const handleInventorySelected = (inventory: any, customPrice?: number) => {
    const price = customPrice !== undefined ? customPrice : inventory.price;
    const typeLabel = inventory.type === "Variable" ? "V" : inventory.type === "Fixed" ? "F" : "U";
    
    onAddItem({
      description: `${inventory.name} (${typeLabel})`,
      quantity: 1,
      rate: price,
      amount: price,
      type: "inventory",
      inventoryId: inventory.id,
      sku: inventory.sku,
    });
    setShowSelectInventoryModal(false);
    resetModal();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(file);
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateCustomItem = () => {
    // Reset validation errors
    setValidationErrors({ name: "", price: "" });

    // Validation
    let hasErrors = false;

    if (!customItemName.trim()) {
      setValidationErrors((prev) => ({ ...prev, name: "Custom Item Name is required" }));
      hasErrors = true;
    }

    const priceValue = parseFloat(customItemPrice.replace(/[^0-9.]/g, ""));
    if (!customItemPrice || isNaN(priceValue) || priceValue <= 0) {
      setValidationErrors((prev) => ({ ...prev, price: "Price must be a positive number" }));
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Add custom item to invoice
    onAddItem({
      description: customItemName.trim(),
      quantity: 1,
      rate: priceValue,
      amount: priceValue,
      type: "custom",
      image: image,
      imagePreview: imagePreview,
    });

    // Show success toast
    toast.success("Custom item added successfully!");

    // Reset form and close modal
    resetModal();
  };

  const resetModal = () => {
    setShowCustomItemForm(false);
    setShowSelectInventoryModal(false);
    setSelectedInventory(null);
    setCustomPrice("");
    setSearchQuery("");
    setCustomItemName("");
    setCustomItemPrice("");
    setImage(null);
    setImagePreview("");
    setValidationErrors({ name: "", price: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const getInventoryTypeLabel = (type: string) => {
    if (type === "Variable") return "V";
    if (type === "Fixed") return "F";
    return "U";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && resetModal()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden app-card">
        <DialogHeader>
          <DialogTitle className="text-gradient">
            {context === "estimate" 
              ? "Add Item to Estimate" 
              : "Add Item to Invoice"}
          </DialogTitle>
          <DialogDescription>
            Search inventory or create custom line items
          </DialogDescription>
        </DialogHeader>

        {!selectedInventory && !showCustomItemForm && (
          <div className="space-y-4 py-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowCustomItemForm(true)}
                variant="outline"
                className="h-14 gap-2 touch-target"
              >
                <Plus className="h-5 w-5" />
                Add Custom Item
              </Button>
              <Button
                onClick={() => setShowSelectInventoryModal(true)}
                variant="outline"
                className="h-14 gap-2 touch-target"
              >
                <Package className="h-5 w-5" />
                Add Inventory
              </Button>
            </div>

            {/* Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by name, SKU, or category..."
                className="pl-9 glass-effect"
              />
            </div>
            
            {/* Info Text */}
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-semibold">V</span> = Variable · <span className="font-semibold">F</span> = Fixed · <span className="font-semibold">U</span> = Per Unit Inventory
              </p>
            </div>

            {/* Inventory List */}
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectInventory(item)}
                      className="w-full p-4 text-left border rounded-xl hover:bg-muted/50 transition-all duration-200 hover:border-primary/50 hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {getInventoryTypeLabel(item.type)}
                            </Badge>
                            <p className="font-semibold group-hover:text-primary transition-colors">{item.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.sku} · {item.category}</p>
                          {item.type === "Per Unit" && item.itemUnit && (
                            <p className="text-xs text-muted-foreground mt-1">Unit: {item.itemUnit}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                          {item.type !== "Variable" && item.type !== "Fixed" && item.stockQuantity > 0 && (
                            <p className="text-xs text-muted-foreground">Stock: {item.stockQuantity}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No inventory items found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Custom Item Form (Inline) */}
        {showCustomItemForm && !selectedInventory && (
          <div className="space-y-6 py-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => setShowCustomItemForm(false)}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCustomItem();
              }}
              className="space-y-6"
            >
              {/* Custom Item Name */}
              <div className="space-y-2">
                <Label htmlFor="customItemName" className="text-base font-semibold">
                  Custom Item Name *
                </Label>
                <Input
                  id="customItemName"
                  value={customItemName}
                  onChange={(e) => {
                    setCustomItemName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  placeholder="Enter item name"
                  className={`h-12 text-base ${validationErrors.name ? "border-destructive" : ""}`}
                  required
                />
                {validationErrors.name && (
                  <p className="text-sm text-destructive">{validationErrors.name}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="customItemPrice" className="text-base font-semibold">
                  Price *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="customItemPrice"
                    type="text"
                    value={customItemPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      setCustomItemPrice(value);
                      if (validationErrors.price) {
                        setValidationErrors((prev) => ({ ...prev, price: "" }));
                      }
                    }}
                    placeholder="0.00"
                    className={`pl-10 h-12 text-base ${validationErrors.price ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {validationErrors.price && (
                  <p className="text-sm text-destructive">{validationErrors.price}</p>
                )}
              </div>

              {/* Upload Image */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Upload Image</Label>
                <div
                  className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-[180px] mx-auto object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <Camera className="h-16 w-16 text-muted-foreground" />
                        <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2">
                          <Upload className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomItemForm(false)}
                  className="min-w-[120px] h-12 text-base"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-[120px] h-12 text-base gradient-primary"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </div>
        )}

        {selectedInventory && (
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono">V</Badge>
                <p className="font-semibold">{selectedInventory.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{selectedInventory.sku}</p>
              <p className="text-xs text-muted-foreground mt-1">Category: {selectedInventory.category}</p>
            </div>

            <div className="grid gap-2">
              <Label>Set Price for Variable Item ($) *</Label>
              <Input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter price"
                className="glass-effect text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Default price: ${selectedInventory.price.toFixed(2)} (you can change this)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedInventory(null)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleAddVariableInventory} className="flex-1" disabled={!customPrice || parseFloat(customPrice) <= 0}>
                Add to Invoice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <SelectInventoryModal
        open={showSelectInventoryModal}
        onOpenChange={setShowSelectInventoryModal}
        onSelectInventory={handleInventorySelected}
      />
    </Dialog>
  );
};
