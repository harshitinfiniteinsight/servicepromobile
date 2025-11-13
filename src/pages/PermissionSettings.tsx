import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";

const PermissionSettings = () => {
  const roles = [
    { id: "admin", name: "Admin", color: "bg-destructive/10 text-destructive" },
    { id: "manager", name: "Manager", color: "bg-primary/10 text-primary" },
    { id: "technician", name: "Technician", color: "bg-success/10 text-success" },
    { id: "office", name: "Office Staff", color: "bg-accent/10 text-accent" },
  ];

  const permissions = [
    { id: "view_customers", label: "View Customers" },
    { id: "edit_customers", label: "Edit Customers" },
    { id: "view_invoices", label: "View Invoices" },
    { id: "edit_invoices", label: "Edit Invoices" },
    { id: "view_estimates", label: "View Estimates" },
    { id: "create_estimates", label: "Create Estimates" },
    { id: "manage_employees", label: "Manage Employees" },
    { id: "view_reports", label: "View Reports" },
    { id: "manage_inventory", label: "Manage Inventory" },
    { id: "manage_appointments", label: "Manage Appointments" },
  ];

  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    roles.forEach(role => {
      initial[role.id] = {};
      permissions.forEach(perm => {
        // Set defaults based on role
        if (role.id === "admin") {
          initial[role.id][perm.id] = true;
        } else if (role.id === "manager") {
          initial[role.id][perm.id] = perm.id.includes("view") || perm.id.includes("edit") || perm.id.includes("create");
        } else if (role.id === "technician") {
          initial[role.id][perm.id] = perm.id.includes("view") && !perm.id.includes("manage");
        } else {
          initial[role.id][perm.id] = perm.id.includes("view") || perm.id.includes("create");
        }
      });
    });
    return initial;
  });

  const togglePermission = (roleId: string, permId: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permId]: !prev[roleId][permId],
      },
    }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Permission Settings" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {roles.map(role => (
          <div key={role.id} className="mb-6">
            <div className="px-4 py-3 bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge className={role.color}>{role.name}</Badge>
              </div>
            </div>
            <div className="space-y-1">
              {permissions.map(perm => (
                <div
                  key={perm.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors"
                >
                  <Label htmlFor={`${role.id}-${perm.id}`} className="flex-1 cursor-pointer">
                    {perm.label}
                  </Label>
                  <Switch
                    id={`${role.id}-${perm.id}`}
                    checked={rolePermissions[role.id]?.[perm.id] || false}
                    onCheckedChange={() => togglePermission(role.id, perm.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionSettings;
