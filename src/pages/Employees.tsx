import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockEmployees } from "@/data/mobileMockData";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import EmployeeCard from "@/components/cards/EmployeeCard";

const Employees = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "Deactivated">("Active");
  const [employeeColors, setEmployeeColors] = useState<Record<string, string>>({});

  const isActiveStatus = (status: string) => status === "Active";
  const isDeactivatedStatus = (status: string) => status === "Deactivated" || status === "Inactive";

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                         emp.email.toLowerCase().includes(search.toLowerCase()) ||
                         emp.phone.includes(search);
    const matchesTab = activeTab === "Active" 
      ? isActiveStatus(emp.status) 
      : isDeactivatedStatus(emp.status);
    return matchesSearch && matchesTab;
  });

  const handleQuickAction = (employeeId: string, action: string) => {
    switch (action) {
      case "edit":
        navigate(`/employees/${employeeId}?edit=true`);
        break;
      case "schedule":
        navigate(`/employees/schedule?employeeId=${employeeId}`);
        break;
      case "tracking":
        navigate(`/employees/tracking?employeeId=${employeeId}`);
        break;
      case "details":
        navigate(`/employees/${employeeId}`);
        break;
      case "deactivate":
        toast.info("Deactivation workflow coming soon");
        break;
      case "activate":
        // Handle activate action (already handled by onActivate callback)
        break;
      default:
        toast.info("Action coming soon");
    }
  };

  const handleColorChange = (employeeId: string, color: string) => {
    setEmployeeColors((prev) => ({
      ...prev,
      [employeeId]: color,
    }));
    toast.success("Employee color updated");
  };

  const handleActivate = (employeeId: string, employeeName: string) => {
    toast.success(`${employeeName} activation coming soon`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Employees"
        actions={
          <Button size="sm" onClick={() => navigate("/employees/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-2 p-2">
          <Button
            variant={activeTab === "Active" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("Active")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === "Active" 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active
          </Button>
          <Button
            variant={activeTab === "Deactivated" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("Deactivated")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === "Deactivated" 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Deactivated
          </Button>
        </div>
        
        {/* Employee Cards */}
        {filteredEmployees.length > 0 ? (
          <div className="space-y-3">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={{
                  ...employee,
                  color: employeeColors[employee.id] || employee.color || "#3B82F6",
                }}
                variant={isDeactivatedStatus(employee.status) ? "deactivated" : "default"}
                onActivate={
                  isDeactivatedStatus(employee.status)
                    ? () => handleActivate(employee.id, employee.name)
                    : undefined
                }
                onQuickAction={action => handleQuickAction(employee.id, action)}
                onColorChange={
                  isActiveStatus(employee.status)
                    ? (color) => handleColorChange(employee.id, color)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No {activeTab.toLowerCase()} employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
