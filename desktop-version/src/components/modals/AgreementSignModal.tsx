import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgreementSignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreementId: string;
  onSignComplete?: () => void;
}

export const AgreementSignModal = ({
  open,
  onOpenChange,
  agreementId,
  onSignComplete,
}: AgreementSignModalProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before uploading.",
        variant: "destructive",
      });
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before sending.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadedImage) {
      toast({
        title: "Document Required",
        description: "Please upload a document before sending.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Agreement Signed",
      description: "Agreement documents have been uploaded successfully.",
    });
    onOpenChange(false);
    
    // Trigger payment modal after a brief delay
    setTimeout(() => {
      onSignComplete?.();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Sign & Upload Agreement Documents</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left side - Signature Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Please sign here</Label>
              <button
                onClick={clearCanvas}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="border-2 border-gray-200 rounded-lg bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full cursor-crosshair rounded-lg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>

          {/* Right side - Document Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Select Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full h-12 border-gray-300">
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driving-licence">Driving Licence</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="social-security">Social Security card</SelectItem>
                  <SelectItem value="real-id">REAL ID Act</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Upload Document</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer min-h-[300px]"
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
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setUploadedImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              >
                {uploadedImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded document" 
                      className="max-h-[280px] object-contain rounded mx-auto"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-blue-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1.5">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Click to upload or drag and drop
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
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            onClick={handleSend} 
            className="px-12 h-12 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            SEND
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
