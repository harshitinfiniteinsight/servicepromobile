import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { EmployeeCard } from "@/components/EmployeeCard";
import { DeactivatedEmployeeCard } from "@/components/DeactivatedEmployeeCard";
import { EmployeeFormModal } from "@/components/modals/EmployeeFormModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { toast } from "sonner";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [employeeColors, setEmployeeColors] = useState<Record<string, string>>(() => {
    // Initialize with colors from mockEmployees
    const colors: Record<string, string> = {};
    mockEmployees.forEach((emp) => {
      if (emp.color) {
        colors[emp.id] = emp.color;
      }
    });
    return colors;
  });

  const filteredEmployees = mockEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEmployees = filteredEmployees.filter((e) => e.status === "Active");
  const deactivatedEmployees = filteredEmployees.filter((e) => e.status === "Deactivated");

  const handleEdit = (employeeId: string, employeeName: string) => {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setModalMode("edit");
      setModalOpen(true);
    }
  };

  const handleDeactivate = (employeeId: string, employeeName: string) => {
    toast.success(`${employeeName} has been deactivated`);
  };

  const handleActivate = (employeeId: string, employeeName: string) => {
    toast.success(`${employeeName} has been activated`);
  };

  const handleColorChange = (employeeId: string, color: string) => {
    setEmployeeColors((prev) => ({
      ...prev,
      [employeeId]: color,
    }));
    toast.success("Employee color updated");
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search employees..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your team members</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedEmployee(null);
              setModalMode("create");
              setModalOpen(true);
            }} 
            className="gap-2 touch-target w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Add Employee
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2 h-auto">
            <TabsTrigger value="active" className="py-2.5 text-sm sm:text-base">Active Employees</TabsTrigger>
            <TabsTrigger value="deactivated" className="py-2.5 text-sm sm:text-base">Deactivated</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  email={employee.email}
                  phone={employee.phone}
                  role={employee.role}
                  status={employee.status}
                  hireDate={employee.hireDate}
                  totalJobs={employee.totalJobs}
                  avatar={employee.avatar}
                  color={employeeColors[employee.id] || employee.color || "#3B82F6"}
                  onEdit={() => handleEdit(employee.id, employee.name)}
                  onDeactivate={() => handleDeactivate(employee.id, employee.name)}
                  onColorChange={(color) => handleColorChange(employee.id, color)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deactivated" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deactivatedEmployees.length > 0 ? (
                deactivatedEmployees.map((employee) => (
                  <DeactivatedEmployeeCard
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    email={employee.email}
                    phone={employee.phone}
                    role={employee.role}
                    avatar={employee.avatar}
                    onActivate={() => handleActivate(employee.id, employee.name)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No deactivated employees
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <EmployeeFormModal 
          open={modalOpen} 
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              setSelectedEmployee(null);
            }
          }} 
          employee={selectedEmployee}
          mode={modalMode} 
        />
      </main>
    </div>
  );
};

export default Employees;
