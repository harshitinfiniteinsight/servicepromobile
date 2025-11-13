import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, FileCheck, ClipboardList, UserCheck, Settings, BarChart3, Package, ChevronDown, DollarSign, Calendar, MapPinned, Clock, ArrowUpCircle, RotateCcw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const topItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Job Dashboard", url: "/jobs", icon: Briefcase },
];

const salesItems = [
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Estimates", url: "/estimates", icon: FileCheck },
  { title: "Agreements", url: "/agreements", icon: ClipboardList },
];

const appointmentItems = [
  { title: "Manage Appointment", url: "/appointments/manage", icon: Calendar },
  { title: "Add Appointment", url: "/appointments/add", icon: Calendar },
];

const employeeItems = [
  { title: "Employee List", url: "/employees", icon: UserCheck },
  { title: "Schedule", url: "/employees/schedule", icon: Clock },
  { title: "Tracking", url: "/employees/tracking", icon: MapPinned },
];

const inventoryItems = [
  { title: "Inventory List", url: "/inventory", icon: Package },
  { title: "Stock In/Out", url: "/inventory/stock-in-out", icon: ArrowUpCircle },
  { title: "Refunds", url: "/inventory/refunds", icon: RotateCcw },
];

const mainItems = [
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const [salesOpen, setSalesOpen] = useState(true);
  const [appointmentsOpen, setAppointmentsOpen] = useState(true);
  const [employeesOpen, setEmployeesOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);

  // Handler to close sidebar when a menu item is clicked
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
      : "hover:bg-muted";
  };

  const isSalesActive = salesItems.some(item => location.pathname === item.url);
  const isAppointmentsActive = appointmentItems.some(item => location.pathname === item.url);
  const isEmployeesActive = employeeItems.some(item => location.pathname === item.url);
  const isInventoryActive = inventoryItems.some(item => location.pathname === item.url);

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="p-4 md:p-6">
        <div className="p-4 md:p-6 border-b border-border -mx-4 md:-mx-6">
          <Logo size={open ? "md" : "sm"} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Top Items */}
              {topItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Sales Collapsible Group */}
              <Collapsible open={salesOpen} onOpenChange={setSalesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isSalesActive ? "bg-primary/10 text-primary" : ""}>
                      <DollarSign className="h-5 w-5" />
                      <span>Sales</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {salesItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Appointments Collapsible Group */}
              <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isAppointmentsActive ? "bg-primary/10 text-primary" : ""}>
                      <Calendar className="h-5 w-5" />
                      <span>Appointment</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {appointmentItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Employees Collapsible Group */}
              <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isEmployeesActive ? "bg-primary/10 text-primary" : ""}>
                      <UserCheck className="h-5 w-5" />
                      <span>Employees</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {employeeItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Inventory Collapsible Group */}
              <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isInventoryActive ? "bg-primary/10 text-primary" : ""}>
                      <Package className="h-5 w-5" />
                      <span>Inventory</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventoryItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Remaining Main Items */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
