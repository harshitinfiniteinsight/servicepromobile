import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CustomerCard } from "@/components/CustomerCard";
import { DeactivatedCustomerCard } from "@/components/DeactivatedCustomerCard";
import { CustomerFormModal } from "@/components/modals/CustomerFormModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { mockCustomers } from "@/data/mockData";
import { toast } from "sonner";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const activeCustomers = filteredCustomers.filter(c => c.status === "active");
  const deactivatedCustomers = filteredCustomers.filter(c => c.status === "deactivated");

  const handleActivate = (customerId: string, customerName: string) => {
    toast.success(`${customerName} has been activated`);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search customers..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fade-in">
        <div className="app-card p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent relative overflow-hidden">
          <div className="gradient-mesh absolute inset-0 opacity-50"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
                <span className="text-gradient">Customers</span>
              </h1>
              <p className="text-sm text-muted-foreground">Manage your customer relationships</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg hover:shadow-xl button-scale gradient-primary border-0 touch-target">
              <Plus className="h-5 w-5" />
              Add Customer
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1 h-auto shadow-sm">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all rounded-lg py-2.5 font-semibold"
            >
              Active Customers
            </TabsTrigger>
            <TabsTrigger 
              value="deactivated" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all rounded-lg py-2.5 font-semibold"
            >
              Deactivated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCustomers.map((customer) => (
                <CustomerCard key={customer.id} {...customer} isActive={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deactivated" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deactivatedCustomers.length > 0 ? (
                deactivatedCustomers.map((customer) => (
                  <DeactivatedCustomerCard 
                    key={customer.id} 
                    id={customer.id}
                    name={customer.name}
                    email={customer.email}
                    phone={customer.phone}
                    avatar={customer.avatar}
                    gender={customer.gender}
                    onActivate={() => handleActivate(customer.id, customer.name)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No deactivated customers
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <CustomerFormModal open={modalOpen} onOpenChange={setModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Customers;
