import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, FileCheck, Plus, Link as LinkIcon } from "lucide-react";
import { mockEstimates } from "@/data/mockData";
import { mockInvoices } from "@/data/mockData";
import { mockAgreements } from "@/data/mockData";
import { toast } from "sonner";

interface LinkModulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceModule: "estimate" | "invoice" | "agreement";
  sourceId: string;
  sourceName: string;
  targetModule: "estimate" | "invoice" | "agreement";
}

export const LinkModulesModal = ({
  open,
  onOpenChange,
  sourceModule,
  sourceId,
  sourceName,
  targetModule,
}: LinkModulesModalProps) => {
  const [activeTab, setActiveTab] = useState<"create" | "attach">("create");
  const [selectedRecord, setSelectedRecord] = useState<string>("");

  const getTargetRecords = () => {
    switch (targetModule) {
      case "estimate":
        return mockEstimates;
      case "invoice":
        return mockInvoices;
      case "agreement":
        return mockAgreements;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "estimate":
        return <FileText className="h-4 w-4" />;
      case "invoice":
        return <DollarSign className="h-4 w-4" />;
      case "agreement":
        return <FileCheck className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getModuleLabel = (module: string) => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  const handleCreateNew = () => {
    toast.success(`New ${getModuleLabel(targetModule)} created and linked to ${sourceName}`);
    onOpenChange(false);
  };

  const handleAttach = () => {
    if (!selectedRecord) {
      toast.error(`Please select a ${getModuleLabel(targetModule)} to attach`);
      return;
    }
    toast.success(`${getModuleLabel(targetModule)} attached to ${sourceName}`);
    onOpenChange(false);
  };

  const targetRecords = getTargetRecords();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Link {getModuleLabel(targetModule)} to {getModuleLabel(sourceModule)}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a new {getModuleLabel(targetModule).toLowerCase()} or attach an existing one to <strong>{sourceName}</strong>
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "attach")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
            <TabsTrigger value="attach" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Attach Existing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  {getModuleIcon(targetModule)}
                  <div>
                    <p className="font-medium">Create New {getModuleLabel(targetModule)}</p>
                    <p className="text-sm text-muted-foreground">
                      A new {getModuleLabel(targetModule).toLowerCase()} will be created and automatically linked to this {sourceModule}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Create & Link
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="attach" className="space-y-4 mt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Select {getModuleLabel(targetModule)} to Attach
              </label>
              <Select value={selectedRecord} onValueChange={setSelectedRecord}>
                <SelectTrigger>
                  <SelectValue placeholder={`Choose a ${getModuleLabel(targetModule).toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {targetRecords.map((record: any) => (
                    <SelectItem key={record.id} value={record.id}>
                      <div className="flex items-center gap-2">
                        {getModuleIcon(targetModule)}
                        <span>
                          {record.id} - {record.customerName || record.customer}
                          {record.amount && ` ($${record.amount.toLocaleString()})`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRecord && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    {(() => {
                      const record = targetRecords.find((r: any) => r.id === selectedRecord);
                      if (!record) return null;
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getModuleIcon(targetModule)}
                              <span className="font-medium">{record.id}</span>
                            </div>
                            <Badge variant="outline">{record.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {record.customerName}
                          </p>
                          {record.amount && (
                            <p className="text-lg font-semibold text-primary">
                              ${record.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAttach} className="gap-2" disabled={!selectedRecord}>
                <LinkIcon className="h-4 w-4" />
                Attach
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
