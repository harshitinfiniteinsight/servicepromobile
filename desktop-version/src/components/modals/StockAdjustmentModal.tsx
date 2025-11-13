import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X } from "lucide-react";

interface StockAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

export function StockAdjustmentModal({ open, onOpenChange, item }: StockAdjustmentModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    adjustBy: "",
    transactionType: "Stock In",
    adjustmentReason: "Received Inventory",
    remarks: "",
  });

  const stockInReasons = [
    "Received Inventory",
    "Correction",
    "Return or Restock",
    "Mark as Damaged",
    "Mark as Demo Units",
    "Mark as Equipment"
  ];

  const stockOutReasons = [
    "Correction",
    "Theft or Loss"
  ];

  const getReasons = () => {
    return formData.transactionType === "Stock In" ? stockInReasons : stockOutReasons;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset image when modal closes
  useEffect(() => {
    if (!open) {
      setImagePreview(null);
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Stock Adjusted",
      description: `Stock for ${item?.name} has been adjusted successfully.`,
    });
    // Reset form
    setFormData({
      adjustBy: "",
      transactionType: "Stock In",
      adjustmentReason: "Received Inventory",
      remarks: "",
    });
    handleRemoveImage();
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg space-y-1">
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            <p className="text-sm text-muted-foreground">Current Stock: <span className="font-semibold text-foreground">{item.stockQuantity}</span></p>
          </div>

          <div>
            <Label htmlFor="adjustBy">Adjust By *</Label>
            <Input
              id="adjustBy"
              type="number"
              value={formData.adjustBy}
              onChange={(e) => setFormData({ ...formData, adjustBy: e.target.value })}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <Label>Transaction Type *</Label>
            <RadioGroup 
              value={formData.transactionType} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                transactionType: value,
                adjustmentReason: value === "Stock In" ? "Received Inventory" : "Correction"
              })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Stock In" id="stockIn" />
                <Label htmlFor="stockIn" className="font-normal cursor-pointer">Stock In</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Stock Out" id="stockOut" />
                <Label htmlFor="stockOut" className="font-normal cursor-pointer">Stock Out</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="adjustmentReason">Adjustment Reason *</Label>
            <Select value={formData.adjustmentReason} onValueChange={(value) => setFormData({ ...formData, adjustmentReason: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getReasons().map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div>
            <Label>Upload Image (Optional)</Label>
            <div
              className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[150px]"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast({
                      title: "File too large",
                      description: "Please upload an image smaller than 10MB",
                      variant: "destructive",
                    });
                    return;
                  }
                  setUploadedImage(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[130px] mx-auto object-contain rounded"
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
                  <div className="relative mb-3">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5">
                      <Upload className="h-4 w-4 text-primary-foreground" />
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
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
