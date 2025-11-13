import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { User, Lock, Shield, Globe, HelpCircle, FileText, CreditCard, Building2, Bell, ChevronRight, ClipboardList, Users, Package, BarChart3, Briefcase, Calendar, FileText as FileTextIcon, TrendingUp, ChevronDown, DollarSign } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  // Single state to track which accordion section is expanded (null = none)
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Helper function to toggle accordion sections (single-expand behavior)
  const toggleSection = (sectionName: string) => {
    setExpandedSection((prev) => (prev === sectionName ? null : sectionName));
  };

  const operationalModules = [
    {
      title: "Sales",
      isExpandable: true,
      parentIcon: DollarSign,
      items: [
        { icon: FileTextIcon, label: "Invoices", route: "/invoices" },
        { icon: TrendingUp, label: "Estimates", route: "/estimates" },
        { icon: ClipboardList, label: "Agreements", route: "/agreements" },
      ],
    },
    {
      title: "Operations",
      items: [
        { icon: Users, label: "Customers", route: "/customers" },
        { icon: Briefcase, label: "Jobs", route: "/jobs" },
        { icon: Calendar, label: "Appointments", route: "/appointments/manage" },
        { icon: Users, label: "Employees", route: "/employees" },
        { icon: Package, label: "Inventory", route: "/inventory" },
        { icon: BarChart3, label: "Reports", route: "/reports" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", route: "/settings/profile" },
        { icon: Lock, label: "Change Password", route: "/settings/change-password" },
      ],
    },
    {
      title: "Business",
      items: [
        { icon: Building2, label: "Business Policies", route: "/settings/business-policies" },
        { icon: CreditCard, label: "Payment Methods", route: "/settings/payment-methods" },
        { icon: FileText, label: "Terms & Conditions", route: "/settings/terms" },
        { icon: FileText, label: "Return Policy", route: "/settings/return-policy" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Globe, label: "Change Language", route: "/settings/language" },
        { icon: Shield, label: "Permissions", route: "/settings/permissions" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help", route: "/settings/help" },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Settings" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {operationalModules.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            {!section.isExpandable && (
            <div className="px-4 py-2 bg-muted/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                {section.title}
              </h3>
            </div>
            )}
            <div className="space-y-1">
              {section.isExpandable ? (
                // Expandable section (Sales or Employees)
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Parent Item */}
                  <button
                    onClick={() => {
                      if (section.title === "Sales") {
                        toggleSection("sales");
                      }
                    }}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        {section.title === "Sales" ? (
                          <DollarSign className="h-5 w-5 text-orange-500" />
                        ) : (
                          <section.parentIcon className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <span className="font-medium text-gray-800">{section.title}</span>
                    </div>
                    {expandedSection === "sales" ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Subheadings */}
                  {expandedSection === "sales" && (
                    <div className="pl-12 pr-4 py-2 space-y-1 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                      {section.items.map((subItem, subIdx) => (
                        <button
                          key={subIdx}
                          onClick={() => navigate(subItem.route)}
                          className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-gray-700">{subItem.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular items
                section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isEmployees = item.label === "Employees";
                  const isInventory = item.label === "Inventory";
                  const isReports = item.label === "Reports";
                  
                  if (isEmployees) {
                    return (
                      <div key={itemIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Employees Main Item */}
                        <button
                          onClick={() => toggleSection("employees")}
                          className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors border-b border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-orange-500" />
                            </div>
                            <span className="font-medium text-gray-800">{item.label}</span>
                          </div>
                          {expandedSection === "employees" ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          )}
                        </button>

                        {/* Subheadings */}
                        {expandedSection === "employees" && (
                          <div className="pl-12 pr-4 py-2 space-y-1 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={() => navigate("/employees")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Employee List</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/employees/schedule")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Schedule</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/employees/tracking")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Employee Tracking</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (isInventory) {
                    return (
                      <div key={itemIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Inventory Main Item */}
                        <button
                          onClick={() => toggleSection("inventory")}
                          className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors border-b border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-orange-500" />
                            </div>
                            <span className="font-medium text-gray-800">{item.label}</span>
                          </div>
                          {expandedSection === "inventory" ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          )}
                        </button>

                        {/* Subheadings */}
                        {expandedSection === "inventory" && (
                          <div className="pl-12 pr-4 py-2 space-y-1 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={() => navigate("/inventory")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Inventory List</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/inventory/stock-in-out")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Inventory Stock In/Out</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/inventory/refunds")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Inventory Refund</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (isReports) {
                    return (
                      <div key={itemIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Reports Main Item */}
                        <button
                          onClick={() => toggleSection("reports")}
                          className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors border-b border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-orange-500" />
                            </div>
                            <span className="font-medium text-gray-800">{item.label}</span>
                          </div>
                          {expandedSection === "reports" ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                          )}
                        </button>

                        {/* Subheadings */}
                        {expandedSection === "reports" && (
                          <div className="pl-12 pr-4 py-2 space-y-1 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={() => navigate("/reports/invoice")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Invoice Reports</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/reports/estimate")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Estimate Report</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => navigate("/reports/monthly-alert")}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-700">Monthly Report Alert</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.route)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
