import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MobileLayout from "./components/layout/MobileLayout";

// Import pages (will be created)
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import AddCustomer from "./pages/AddCustomer";
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import Invoices from "./pages/Invoices";
import AddInvoice from "./pages/AddInvoice";
import InvoiceDueAlert from "./pages/InvoiceDueAlert";
import InvoiceDetails from "./pages/InvoiceDetails";
import Estimates from "./pages/Estimates";
import AddEstimate from "./pages/AddEstimate";
import EstimateDetails from "./pages/EstimateDetails";
import Agreements from "./pages/Agreements";
import AddAgreement from "./pages/AddAgreement";
import AgreementDetails from "./pages/AgreementDetails";
import MinimumDepositPercentage from "./pages/MinimumDepositPercentage";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";
import AddEmployee from "./pages/AddEmployee";
import EmployeeSchedule from "./pages/EmployeeSchedule";
import EmployeeTracking from "./pages/EmployeeTracking";
import JobDetails from "./pages/JobDetails";
import Inventory from "./pages/Inventory";
import InventoryItemDetails from "./pages/InventoryItemDetails";
import AddInventoryItem from "./pages/AddInventoryItem";
import EditInventoryItem from "./pages/EditInventoryItem";
import AddDiscount from "./pages/AddDiscount";
import InventoryStockInOut from "./pages/InventoryStockInOut";
import InventoryRefund from "./pages/InventoryRefund";
import Discounts from "./pages/Discounts";
import LowInventoryAlertSettings from "./pages/LowInventoryAlertSettings";
import ManageAppointments from "./pages/ManageAppointments";
import AddAppointment from "./pages/AddAppointment";
import Reports from "./pages/Reports";
import InvoiceReport from "./pages/InvoiceReport";
import EstimateReport from "./pages/EstimateReport";
import MonthlyReportAlert from "./pages/MonthlyReportAlert";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import PermissionSettings from "./pages/PermissionSettings";
import ChangeLanguage from "./pages/ChangeLanguage";
import Help from "./pages/Help";
import TermsConditions from "./pages/TermsConditions";
import ReturnPolicy from "./pages/ReturnPolicy";
import BusinessPolicies from "./pages/BusinessPolicies";
import PaymentMethods from "./pages/PaymentMethods";
import Walkthrough from "./pages/Walkthrough";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup', '/walkthrough'].includes(location.pathname);

  return (
    <div className="h-full w-full overflow-hidden">
      {isAuthPage ? (
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/walkthrough" element={<Walkthrough />} />
        </Routes>
      ) : (
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<AddCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<AddJob />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/appointments/manage" element={<ManageAppointments />} />
            <Route path="/appointments/add" element={<AddAppointment mode="create" />} />
            <Route path="/appointments/new" element={<AddAppointment mode="create" />} />
            <Route path="/appointments/:id/edit" element={<AddAppointment mode="edit" />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/new" element={<AddInvoice />} />
            <Route path="/invoices/due-alert" element={<InvoiceDueAlert />} />
            <Route path="/estimates" element={<Estimates />} />
            <Route path="/estimates/:id" element={<EstimateDetails />} />
            <Route path="/estimates/new" element={<AddEstimate />} />
            <Route path="/estimates/:id/edit" element={<AddEstimate />} />
            <Route path="/agreements" element={<Agreements />} />
            <Route path="/agreements/:id" element={<AgreementDetails />} />
            <Route path="/agreements/new" element={<AddAgreement />} />
            <Route path="/agreements/minimum-deposit" element={<MinimumDepositPercentage />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<AddEmployee />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/employees/schedule" element={<EmployeeSchedule />} />
            <Route path="/employees/tracking" element={<EmployeeTracking />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/new" element={<AddInventoryItem />} />
            <Route path="/inventory/:id/edit" element={<EditInventoryItem />} />
            <Route path="/inventory/:id" element={<InventoryItemDetails />} />
            <Route path="/inventory/alert-settings" element={<LowInventoryAlertSettings />} />
            <Route path="/inventory/stock-in-out" element={<InventoryStockInOut />} />
            <Route path="/inventory/refunds" element={<InventoryRefund />} />
            <Route path="/inventory/discounts" element={<Discounts />} />
            <Route path="/inventory/discounts/new" element={<AddDiscount />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/invoice" element={<InvoiceReport />} />
            <Route path="/reports/estimate" element={<EstimateReport />} />
            <Route path="/reports/monthly-alert" element={<MonthlyReportAlert />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile" element={<Profile />} />
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/settings/permissions" element={<PermissionSettings />} />
            <Route path="/settings/terms" element={<TermsConditions />} />
            <Route path="/settings/return-policy" element={<ReturnPolicy />} />
            <Route path="/settings/business-policies" element={<BusinessPolicies />} />
            <Route path="/settings/payment-methods" element={<PaymentMethods />} />
            <Route path="/settings/language" element={<ChangeLanguage />} />
            <Route path="/settings/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileLayout>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;


