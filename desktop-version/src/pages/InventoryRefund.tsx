import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Search, Plus, DollarSign, Package, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockRefunds = [
  {
    id: "REF001",
    date: "2024-01-15",
    customerName: "John Smith",
    itemName: "Pipe Wrench 14in",
    sku: "PW-14-001",
    quantity: 2,
    amount: 89.98,
    reason: "Damaged on delivery",
    status: "Completed",
    invoiceNumber: "INV-2024-123",
  },
  {
    id: "REF002",
    date: "2024-01-14",
    customerName: "Sarah Johnson",
    itemName: "PVC Pipe 1/2in",
    sku: "PP-12-002",
    quantity: 10,
    amount: 45.50,
    reason: "Wrong item ordered",
    status: "Pending",
    invoiceNumber: "INV-2024-118",
  },
  {
    id: "REF003",
    date: "2024-01-13",
    customerName: "Mike Davis",
    itemName: "Copper Fitting Set",
    sku: "CF-SET-003",
    quantity: 1,
    amount: 125.00,
    reason: "Customer changed mind",
    status: "Completed",
    invoiceNumber: "INV-2024-105",
  },
];

const InventoryRefund = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const filteredRefunds = mockRefunds.filter(refund => {
    const matchesSearch = 
      refund.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || refund.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddRefund = () => {
    toast({
      title: "Refund Created",
      description: "The refund has been processed successfully.",
    });
    setRefundModalOpen(false);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search refunds..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <RotateCcw className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Refunds</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage customer refunds and returns</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Refunds Synced",
                  description: "Refunds have been synced successfully.",
                });
              }}
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Sync Refunds</span>
            </Button>
            <Button
              onClick={() => setRefundModalOpen(true)}
              className="gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Process Refund</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Refunds</p>
                  <p className="text-2xl font-bold text-foreground">45</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-success/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">$2,345</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Items Returned</p>
                  <p className="text-2xl font-bold text-foreground">67</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-border shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, item, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Refund Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Refunds Table */}
        <Card className="border border-border shadow-lg">
          <CardHeader className="border-b border-border bg-gradient-to-r from-muted/50 to-muted/20">
            <CardTitle className="text-lg font-bold">Refund History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Refund ID</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold text-right">Qty</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefunds.map((refund) => (
                    <TableRow key={refund.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell className="text-muted-foreground">{refund.date}</TableCell>
                      <TableCell className="font-semibold">{refund.customerName}</TableCell>
                      <TableCell className="font-medium text-foreground">{refund.itemName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {refund.sku}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{refund.quantity}</TableCell>
                      <TableCell className="text-right font-bold text-success text-lg">
                        ${refund.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {refund.reason}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            refund.status === "Completed"
                              ? "bg-success/20 text-success border-success/60 font-semibold shadow-sm"
                              : "bg-warning/20 text-warning border-warning/60 font-semibold shadow-sm"
                          }
                        >
                          {refund.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Refund Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Process Inventory Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice">Invoice Number *</Label>
                <Input id="invoice" placeholder="INV-2024-XXX" />
              </div>
              <div>
                <Label htmlFor="customer">Customer Name *</Label>
                <Input id="customer" placeholder="Enter customer name" />
              </div>
            </div>
            <div>
              <Label htmlFor="item">Select Item *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose inventory item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item1">Pipe Wrench 14in (PW-14-001)</SelectItem>
                  <SelectItem value="item2">PVC Pipe 1/2in (PP-12-002)</SelectItem>
                  <SelectItem value="item3">Copper Fitting Set (CF-SET-003)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" min="1" defaultValue="1" />
              </div>
              <div>
                <Label htmlFor="amount">Refund Amount *</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Refund Reason *</Label>
              <Textarea id="reason" placeholder="Enter reason for refund..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRefund}>Process Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryRefund;
