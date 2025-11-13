import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, X, CheckCircle, Send, Eye, PenTool, Lock, Camera, User, Upload, Trash2, Mail, MessageSquare, Edit } from "lucide-react";
import { mockCustomers, mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { SendEmailModal } from "./SendEmailModal";
import { SendSMSModal } from "./SendSMSModal";
import { AgreementSignModal } from "./AgreementSignModal";
import { AgreementPaymentModal } from "./AgreementPaymentModal";

interface PreviewAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreement: any;
  onPayNow?: (agreement: any) => void;
  onUpdate?: (agreement: any) => void;
}

export const PreviewAgreementModal = ({ open, onOpenChange, agreement, onPayNow, onUpdate }: PreviewAgreementModalProps) => {
  const { toast } = useToast();
  const [signature, setSignature] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoIdInputRef = useRef<HTMLInputElement>(null);
  const snapshotInputRef = useRef<HTMLInputElement>(null);

  if (!agreement) return null;

  // Find customer and employee details
  const customer = mockCustomers.find(c => c.id === agreement.customerId);
  const employee = mockEmployees.find(e => e.id === agreement.employeeId);
  const isPaid = agreement.status === "Paid";

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Format terms
  const formatTerms = (terms: string) => {
    if (!terms) return "due on receipt";
    return terms.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    toast({
      title: "PDF Download",
      description: "PDF download initiated",
    });
  };

  // Signature drawing functions
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
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
      }
    }
  };

  const handlePhotoIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoId(reader.result as string);
        toast({
          title: "Photo ID Uploaded",
          description: "Photo ID has been uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSnapshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSnapshot(reader.result as string);
        toast({
          title: "Snapshot Uploaded",
          description: "Snapshot has been uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhotoId = () => {
    setPhotoId(null);
    if (photoIdInputRef.current) {
      photoIdInputRef.current.value = "";
    }
  };

  const removeSnapshot = () => {
    setSnapshot(null);
    if (snapshotInputRef.current) {
      snapshotInputRef.current.value = "";
    }
  };

  // Mock audit trail data
  const auditTrail = [
    {
      trail: "Document Created",
      user: "Merchant Name (merchant@gmail.com)",
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.1",
      icon: CheckCircle,
    },
    {
      trail: "Document Sent",
      user: "Merchant Name (merchant@gmail.com)",
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.1",
      icon: Send,
    },
    {
      trail: "Document Viewed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: Eye,
    },
    {
      trail: "Document Signed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: PenTool,
    },
    {
      trail: "Document Sealed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: Lock,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-white">
        <div className="bg-white">
          {/* Header - Blue Banner */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-3xl font-bold">U</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">UNIVERSELL Store</h1>
                  <div className="space-y-1 text-sm">
                    <p>Business Hub, Miami Street, Miami, Florida.</p>
                    <p>Email: admin@universalstore.xyz</p>
                    <p>Phone: (406) 262-7649</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-blue-700 h-10 w-10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Ticket Number - Top Right */}
            <div className="flex justify-end">
              <p className="text-green-600 font-semibold text-sm">
                Ticket Number: <span className="text-gray-900">{agreement.ticketNumber || agreement.id || "N/A"}</span>
              </p>
            </div>

            {/* Service Work Order Section */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Service Work Order</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-900">{customer?.name || agreement.customerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Employee Name</p>
                  <p className="font-semibold text-gray-900">{employee?.name || agreement.employeeName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Agreement Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Payment Terms</p>
                  <p className="font-semibold text-gray-900">{formatTerms(agreement.paymentTerms || "due on receipt")}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Agreement Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agreement Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">{agreement.terms || agreement.description || "Enter Description"}</p>
              </div>
            </div>

            {/* Service and Amount Table */}
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-900">{agreement.title || "Service"}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${(agreement.amount || 0).toFixed(2)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">${(agreement.amount || 0).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF DOWNLOAD
                  </Button>
                  {isPaid && (
                    <Badge className="bg-green-600 text-white text-center py-2 px-4 w-full">
                      Fully Paid
                    </Badge>
                  )}
                </div>
                {!isPaid && (
                  <Button
                    onClick={() => {
                      setShowSignModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                  >
                    PAY NOW
                  </Button>
                )}
              </div>
            </div>

            {/* Agreement Expiry Date - Bottom Right */}
            <div className="flex justify-end">
              <p className="text-green-600 font-semibold text-sm">
                Agreement Expiry Date: <span className="text-gray-900">{formatDate(agreement.endDate || agreement.expiryDate)}</span>
              </p>
            </div>

            {/* Signature, Photo ID, Snapshot Fields */}
            <div className="grid grid-cols-3 gap-4">
              {/* Signature Field */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Signature</p>
                  {signature && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSignature}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {signature ? (
                  <div className="relative">
                    <img src={signature} alt="Signature" className="w-full h-32 object-contain border border-gray-200 rounded" />
                  </div>
                ) : (
                  <div className="relative bg-gray-50 rounded border border-gray-200" style={{ height: "128px" }}>
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={128}
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <PenTool className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Photo ID Field */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Photo ID</p>
                  {photoId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePhotoId}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {photoId ? (
                  <div className="relative">
                    <img src={photoId} alt="Photo ID" className="w-full h-32 object-cover border border-gray-200 rounded" />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <User className="h-8 w-8 mb-2 text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                    <input
                      ref={photoIdInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoIdUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Snapshot Field */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Snapshot</p>
                  {snapshot && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeSnapshot}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {snapshot ? (
                  <div className="relative">
                    <img src={snapshot} alt="Snapshot" className="w-full h-32 object-cover border border-gray-200 rounded" />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Camera className="h-8 w-8 mb-2 text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                    <input
                      ref={snapshotInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleSnapshotUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Audit Trail Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trail</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time & Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {auditTrail.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-900">{item.trail}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.time}
                            <br />
                            <span className="text-xs text-gray-500">{item.location}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {isPaid ? (
                  <>
                    <Button
                      onClick={() => setShowEmailModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button
                      onClick={() => setShowSMSModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send via SMS
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowEmailModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button
                      onClick={() => setShowSMSModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send via SMS
                    </Button>
                    {onUpdate && (
                      <Button
                        onClick={() => {
                          if (onUpdate) {
                            onUpdate(agreement);
                            onOpenChange(false);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Agreement
                      </Button>
                    )}
                  </>
                )}
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Close
              </Button>
            </div>

            {/* Footer */}
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-600 text-lg font-bold">U</span>
                </div>
                <p className="text-sm font-medium">Powered by UNIVERSELL</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Send Email Modal */}
      <SendEmailModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        customerEmail={customer?.email || agreement.customerEmail || ""}
      />

      {/* Send SMS Modal */}
      <SendSMSModal
        open={showSMSModal}
        onOpenChange={setShowSMSModal}
        customerName={customer?.name || agreement.customerName || ""}
        phoneNumber={customer?.phone || agreement.customerPhone || ""}
      />

      {/* Sign & Upload Agreement Documents Modal */}
      <AgreementSignModal
        open={showSignModal}
        onOpenChange={setShowSignModal}
        agreementId={agreement.id}
        onSignComplete={() => {
          setShowSignModal(false);
          setShowPaymentModal(true);
        }}
      />

      {/* Payment Due Modal */}
      <AgreementPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        agreement={agreement}
      />
    </Dialog>
  );
};

