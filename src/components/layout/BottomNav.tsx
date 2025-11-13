import { useLocation, useNavigate } from "react-router-dom";
import { Home, DollarSign, Calendar, Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import SalesSubmenu from "./SalesSubmenu";

const navItems = [
  { title: "Dashboard", path: "/", icon: Home, hasSubmenu: false },
  { title: "Sales", path: "/sales", icon: DollarSign, hasSubmenu: true },
  { title: "Appointments", path: "/appointments/manage", icon: Calendar, hasSubmenu: false },
  { title: "Customers", path: "/customers", icon: Users, hasSubmenu: false },
  { title: "Others", path: "/settings", icon: MoreHorizontal, hasSubmenu: false },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [salesSubmenuOpen, setSalesSubmenuOpen] = useState(false);
  const previousPathRef = useRef(location.pathname);
  const isOpeningSubmenuRef = useRef(false);

  // Close Sales submenu when navigating away from Sales routes
  useEffect(() => {
    const isSalesRoute = location.pathname.startsWith("/invoices") || 
                         location.pathname.startsWith("/estimates") || 
                         location.pathname.startsWith("/agreements");
    
    const routeChanged = previousPathRef.current !== location.pathname;
    
    // Only close if:
    // 1. We're not on a Sales route
    // 2. Submenu is currently open
    // 3. The route actually changed (user navigated to a different page)
    // 4. We're not in the process of opening the submenu via click
    if (!isSalesRoute && salesSubmenuOpen && routeChanged && !isOpeningSubmenuRef.current) {
      setSalesSubmenuOpen(false);
    }
    
    // If we navigated to a Sales route, reset the opening flag
    if (isSalesRoute && routeChanged) {
      isOpeningSubmenuRef.current = false;
    }
    
    // Update previous path
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  // Reset opening flag after submenu state changes
  useEffect(() => {
    if (isOpeningSubmenuRef.current) {
      const timer = setTimeout(() => {
        isOpeningSubmenuRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [salesSubmenuOpen]);

  const isActive = (path: string, hasSubmenu: boolean) => {
    if (path === "/") return location.pathname === "/";
    if (hasSubmenu) {
      // Check if current path is one of the sales submenu paths
      return location.pathname.startsWith("/invoices") || 
             location.pathname.startsWith("/estimates") || 
             location.pathname.startsWith("/agreements");
    }
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.hasSubmenu) {
      e.preventDefault();
      // Set flag to prevent useEffect from closing it immediately
      isOpeningSubmenuRef.current = true;
      // Toggle submenu: if already open, close it; otherwise open it
      setSalesSubmenuOpen(prev => !prev);
    } else {
      // Close submenu when clicking on other nav items
      setSalesSubmenuOpen(false);
      navigate(item.path);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 safe-bottom shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.hasSubmenu);
            
            return (
              <button
                key={item.path}
                onClick={(e) => handleItemClick(item, e)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full touch-target transition-all duration-200 relative",
                  active 
                    ? "text-primary" 
                    : "text-gray-500"
                )}
              >
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  active ? "bg-primary/10 scale-110" : "hover:bg-gray-50"
                )}>
                  <Icon className={cn("h-6 w-6", active && "scale-110")} />
                </div>
                <span className={cn(
                  "text-[11px] mt-0.5 transition-all whitespace-nowrap leading-4",
                  active ? "font-bold text-primary" : "font-medium text-gray-500"
                )}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <SalesSubmenu isOpen={salesSubmenuOpen} onClose={() => setSalesSubmenuOpen(false)} />
    </>
  );
};

export default BottomNav;


