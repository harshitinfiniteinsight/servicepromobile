import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, Calendar, Search, Filter } from "lucide-react";

const mockTransactions = [
  {
    id: "T001",
    date: "2024-01-15",
    itemName: "Pipe Wrench 14in",
    sku: "PW-14-001",
    type: "Stock In",
    quantity: 50,
    reason: "Received Inventory",
    reference: "PO-2024-001",
  },
  {
    id: "T002",
    date: "2024-01-14",
    itemName: "PVC Pipe 1/2in",
    sku: "PP-12-002",
    type: "Stock Out",
    quantity: 25,
    reason: "Job Consumption",
    reference: "JOB-2024-045",
  },
  {
    id: "T003",
    date: "2024-01-13",
    itemName: "Copper Fitting Set",
    sku: "CF-SET-003",
    type: "Stock In",
    quantity: 100,
    reason: "Return or Restock",
    reference: "RET-2024-008",
  },
  {
    id: "T004",
    date: "2024-01-12",
    itemName: "Thread Seal Tape",
    sku: "TS-TP-004",
    type: "Stock Out",
    quantity: 15,
    reason: "Correction",
    reference: "ADJ-2024-012",
  },
];

const InventoryStockInOut = () => {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesSearch = transaction.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search transactions..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <ArrowUpCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Stock In/Out History</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Track all inventory movements</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-success/10 rounded-lg">
                  <ArrowUpCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Stock In</p>
                  <p className="text-2xl font-bold text-foreground">150</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-destructive/10 rounded-lg">
                  <ArrowDownCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Stock Out</p>
                  <p className="text-2xl font-bold text-foreground">40</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-gradient-to-br from-card to-card/50 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <Filter className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Movement</p>
                  <p className="text-2xl font-bold text-success">+110</p>
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
                  placeholder="Search by item name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Stock In">Stock In Only</SelectItem>
                  <SelectItem value="Stock Out">Stock Out Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border border-border shadow-lg">
          <CardHeader className="border-b border-border bg-gradient-to-r from-muted/50 to-muted/20">
            <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold text-right">Quantity</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                      <TableCell className="font-semibold text-foreground">{transaction.itemName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {transaction.sku}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            transaction.type === "Stock In"
                              ? "bg-success/20 text-success border-success/60 font-semibold shadow-sm"
                              : "bg-destructive/20 text-destructive border-destructive/60 font-semibold shadow-sm"
                          }
                        >
                          {transaction.type === "Stock In" ? (
                            <ArrowUpCircle className="h-3.5 w-3.5 mr-1.5" />
                          ) : (
                            <ArrowDownCircle className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">{transaction.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.reason}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {transaction.reference}
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
    </div>
  );
};

export default InventoryStockInOut;
