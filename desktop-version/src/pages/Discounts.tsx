import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tags } from "lucide-react";
import { mockDiscounts } from "@/data/mockData";
import { DiscountFormModal } from "@/components/modals/DiscountFormModal";

const Discounts = () => {
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const handleAddDiscount = () => {
    setSelectedDiscount(null);
    setModalMode("create");
    setDiscountModalOpen(true);
  };

  const handleEditDiscount = (discount: any) => {
    setSelectedDiscount(discount);
    setModalMode("edit");
    setDiscountModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setDiscountModalOpen(open);
    if (!open) {
      setSelectedDiscount(null);
    }
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search discounts..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Tags className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Discounts</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage discount codes and offers</p>
            </div>
          </div>
          <Button 
            onClick={handleAddDiscount} 
            className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Discount</span>
          </Button>
        </div>

        {/* Discounts List */}
        <div className="grid gap-4">
          {mockDiscounts.map((discount) => (
            <Card 
              key={discount.id} 
              className="border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-bold text-lg text-foreground">{discount.name}</h3>
                      {discount.isDefault && (
                        <Badge variant="outline" className="w-fit bg-primary/15 text-primary border-primary/40 font-semibold px-3 py-1 shadow-sm">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <div className="px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                        <span className="text-xs text-muted-foreground block">Value</span>
                        <span className="font-bold text-xl text-accent">{discount.value}{discount.type}</span>
                      </div>
                      <div className="px-4 py-2 bg-muted rounded-lg border border-border">
                        <span className="text-xs text-muted-foreground block">Type</span>
                        <span className="font-semibold text-sm text-foreground">
                          {discount.type === "%" ? "Percentage" : "Fixed Amount"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 flex-1 lg:flex-initial hover:bg-primary/10 hover:text-primary hover:border-primary transition-all font-medium"
                      onClick={() => handleEditDiscount(discount)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 flex-1 lg:flex-initial text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Modal */}
      <DiscountFormModal 
        open={discountModalOpen} 
        onOpenChange={handleModalClose} 
        mode={modalMode}
        discount={selectedDiscount}
      />
    </div>
  );
};

export default Discounts;
