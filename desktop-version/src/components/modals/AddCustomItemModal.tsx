import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, X, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface AddCustomItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
}

export function AddCustomItemModal({ open, onOpenChange, onAddItem }: AddCustomItemModalProps) {
  const [customItemName, setCustomItemName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    price: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreate = () => {
    // Reset validation errors
    setValidationErrors({ name: "", price: "" });

    // Validation
    let hasErrors = false;

    if (!customItemName.trim()) {
      setValidationErrors((prev) => ({ ...prev, name: "Custom Item Name is required" }));
      hasErrors = true;
    }

    const priceValue = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!price || isNaN(priceValue) || priceValue <= 0) {
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
    handleClose();
  };

  const handleClose = () => {
    setCustomItemName("");
    setPrice("");
    setImage(null);
    setImagePreview("");
    setValidationErrors({ name: "", price: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold">Add Custom Item</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="space-y-6 md:space-y-8 py-4 md:py-6"
        >
          {/* Custom Item Name */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="customItemName" className="text-sm md:text-base font-semibold">
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
              className={`touch-target text-base md:text-lg h-12 md:h-14 ${validationErrors.name ? "border-destructive" : ""}`}
              required
            />
            {validationErrors.name && (
              <p className="text-sm md:text-base text-destructive">{validationErrors.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="price" className="text-sm md:text-base font-semibold">
              Price *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground font-medium" />
              <Input
                id="price"
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setPrice(value);
                  if (validationErrors.price) {
                    setValidationErrors((prev) => ({ ...prev, price: "" }));
                  }
                }}
                placeholder="0.00"
                className={`pl-10 md:pl-12 touch-target text-base md:text-lg h-12 md:h-14 ${validationErrors.price ? "border-destructive" : ""}`}
                required
              />
            </div>
            {validationErrors.price && (
              <p className="text-sm md:text-base text-destructive">{validationErrors.price}</p>
            )}
          </div>

          {/* Upload Image */}
          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm md:text-base font-semibold">Upload Image</Label>
            <div
              className="border-2 border-dashed border-muted rounded-lg p-6 md:p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px] md:min-h-[250px]"
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
          <div className="flex justify-end gap-3 md:gap-4 pt-4 md:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="touch-target min-w-[100px] md:min-w-[120px] h-12 md:h-14 text-base md:text-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="touch-target min-w-[100px] md:min-w-[120px] h-12 md:h-14 text-base md:text-lg"
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

